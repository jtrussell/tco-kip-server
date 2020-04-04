const confetti = require('./confetti');
const React = require('react');
const ReactDOM = require('react-dom');
const chatHighlighter = require('./chat-highlighter');
const setupCSS = require('./css-overrides');

let started = false;

function start() {
    if(started) {
        return;
    }

    started = true;

    //setTimeout(() => {
    setupCSS();
    //}, 100);
    require('./chat-drag')();

    try {
        const el = document.querySelector('.player-avatar');
        const key = Object.keys(el).find(k => /__reactInternalInstance/.test(k));
        let target = el[key];

        while(target.return) {
            target = target.return;
        }

        const store = target.stateNode.current.memoizedState.element.props.store;

        const getSocket = () => {
            return new Promise((resolve, reject) => {
                const interval = setInterval(() => {
                    const state = store.getState();
                    if(state.games && state.games.socket) {
                        resolve(state.games.socket);
                        clearInterval(interval);
                    }
                }, 100);
            });
        };

        const user = document.querySelector('.gravatar').parentElement.innerText;
        const opponent = document.querySelectorAll('.gravatar')[1].parentElement.innerText;
        const opponentBoard = document.querySelectorAll('.player-board')[0];
        const opponentCreatures = opponentBoard.querySelectorAll('.card-row')[1];

        let socketRef;
        let socketEvents = [];
        let socketEventAt = 0;
        let gameRef;

        const shutdown = () => {
            started = false;
            if(document.querySelector('#crucible-streamer-addons')) {
                document.querySelector('#crucible-streamer-addons').remove();
            }

            if(document.querySelector('#crucible-streamer-addons-css')) {
                document.querySelector('#crucible-streamer-addons-css').remove();
            }

            socketRef.off('gamestate', handleSocketEvent);
        };

        const userHand = document.querySelectorAll('.player-home-row-container')[1];
        const userBoard = document.querySelectorAll('.player-board')[1];

        const showNoFightingAlert = () => {
            userBoard.style.borderTop = '5px dashed #cc3fff';
            userBoard.style.marginTop = '-10px';
            userBoard.style.paddingTop = '5px';
        };

        const dimBoardCardsOfType = (type) => {
            try {
                if(gameRef && gameRef.players) {
                    const { cardsInPlay } = gameRef.players[user].cardPiles;
                    cardsInPlay.forEach((card, i) => {
                        if(card.type === type) {
                            const cardEl = userBoard.querySelectorAll('.card-wrapper')[i];
                            cardEl.classList.add('gray-scale-filter');
                        }
                    });
                }
            } catch(e) {}
        };

        const dimHandCardsOfType = (type) => {
            try {
                if(gameRef && gameRef.players) {
                    const { hand } = gameRef.players[user].cardPiles;
                    hand.forEach((card, i) => {
                        if(card.type === type) {
                            const cardEl = userHand.querySelectorAll('.card-wrapper')[i];
                            cardEl.classList.add('gray-scale-filter');
                        }
                    });
                }
            } catch(e) {}
        };

        const clearVisualQues = () => {
            const boardCards = Array.from(userBoard.querySelectorAll('.card-wrapper'));
            const handCards = Array.from(userHand.querySelectorAll('.card-wrapper'));

            boardCards
                .concat(handCards)
                .forEach(el => el.classList.remove('gray-scale-filter'));
            userBoard.style.borderTop = 'unset';
            userBoard.style.marginTop = 'unset';
            userBoard.style.paddingTop = 'unset';
        };

        const useCards = [
            {
                card: 'Lifeward',
                disallow: ['creature']
            },
            {
                card: 'Scrambler Storm',
                disallow: ['action']
            },
            {
                card: 'Stealth Mode',
                disallow: ['action']
            },
            {
                card: 'Foggify',
                disallow: ['fight']
            },
            {
                card: 'Fogbank',
                disallow: ['fight']
            }
        ];

        const handleSocketEvent = game => {
            chatHighlighter.update();

            gameRef = game;

            if(game.messages) {
                const newEvents = game.messages.slice(socketEventAt);
                socketEventAt = game.messages.length;

                if(newEvents.length) {
                    socketEvents = socketEvents.concat(newEvents);

                    newEvents.forEach(event => {
                        if(Array.isArray(event.message)
                  && event.message[0]
                  && event.message[0].name === user
                  && event.message[1] === ' chooses '
                  && event.message[3] === ' as their active house this turn'
                        ) {
                            clearVisualQues();
                        }

                        useCards.forEach(({ card, disallow }) => {
                            if(Array.isArray(event.message)
                    && event.message[0]
                    && event.message[0].name !== user
                    && event.message[1] === ' uses '
                    && event.message[2].label === card
                            ) {
                                disallow.forEach(c => {
                                    if(c === 'fight') {
                                        showNoFightingAlert();
                                        return;
                                    }

                                    dimHandCardsOfType(c);
                                });
                            }
                        });

                        if(Array.isArray(event.message)
                  && event.message[0]
                  && event.message[0].name !== user
                  && /uses/.test(event.message[1])
                  && /Skippy Timehog/.test(event.message[2].label)
                  && /to/.test(event.message[3])
                  && event.message[4]
                  && /stop/.test(event.message[4][0])
                        ) {
                            dimBoardCardsOfType('creature');
                            dimBoardCardsOfType('action');
                            dimBoardCardsOfType('artifact');
                        }

                        confetti(event, user);
                    });
                }
            }
        };

        getSocket()
            .then(socket => {
                socketRef = socket;
                socket.on('gamestate', handleSocketEvent);

                const shutdownInterval = setInterval(() => {
                    if(!isInGame()) {
                        shutdown();
                        clearInterval(shutdownInterval);
                    }
                }, 100);
            });

        const isInGame = () => {
            return !!document.querySelector('.player-home-row-container');
        };
    } catch(e) {
        console.error('Crucible Tracker error:');
        console.error(e);
    }
}

module.exports = start;
