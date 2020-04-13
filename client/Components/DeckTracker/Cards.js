import React from 'react';

let lastCards;

const getHouse = (card) => card.printedHouse || card.house;

class Cards extends React.Component {
    render() {
        const {
            game,
            user
        } = this.props;

        if(!game || !user) {
            return null;
        }

        const { deckCards, cardPiles } = game.players[user];
        let cards = deckCards;
        let cardInDeckIndexMap = {};

        try {
            cards = cards
                .sort((a, b) => {
                    if(getHouse(a) === getHouse(b)) {
                        return a.name.localeCompare(b.name);
                    }

                    return getHouse(a).localeCompare(getHouse(b));
                })
                .map((c) => {
                    const cardInDeck = cardPiles.deck.find((deckCard, i) => {
                        const out = deckCard.id === c.id && !cardInDeckIndexMap[i];
                        if(out) {
                            cardInDeckIndexMap[i] = true;
                        }

                        return out;
                    });

                    c.dim = !cardInDeck;
                    return c;
                })
                .filter((c) => !!c);

            cards = cards.sort((a, b) => {
                if(getHouse(a) === getHouse(b)) {
                    if(a.dim && !b.dim) {
                        return 1;
                    }

                    if(!a.dim && b.dim) {
                        return -1;
                    }
                }

                return getHouse(a).localeCompare(getHouse(b));
            });

            if(cards.length < 36 && lastCards) {
                cards = lastCards;
            }

            lastCards = cards;
        } catch(e) {
            console.error(e);
            return null;
        }

        return (
            <div style={ { userSelect: 'none' } }>
                { cards.map((card, i) => {
                    const baseCardStyle = {
                        marginTop: '-40px',
                        marginLeft: '90px',
                        width: '80%'
                    };

                    if(card.type === 'upgrade') {
                        baseCardStyle.marginTop = '40px';
                    }

                    const houseColorMap = {
                        mars: '#73b757',
                        brobnar: 'rgb(222,148,68)',
                        logos: 'rgb(231,226,213)',
                        sanctum: 'rgb(75,106,172)',
                        dis: 'rgb(222,152,172)',
                        shadows: 'rgb(194,179,170)',
                        untamed: 'rgb(92,172,124)',
                        saurian: 'rgb(123,193,210)',
                        staralliance: 'rgb(119,125,163)'
                    };

                    const houseStyle = {
                        width: '22px',
                        height: '22px',
                        backgroundColor: houseColorMap[getHouse(card)],
                        position: 'absolute',
                        zIndex: 100
                    };

                    return (
                        <div
                            style={ {
                                position: 'relative',
                                height: '22px',
                                overflow: 'hidden',
                                border: '1px solid black'
                            } }
                            key={ card + i }
                        >
                            { card.dim
                                ? (
                                    <div>
                                        <img
                                            style={
                                                Object.assign(houseStyle, { filter: 'brightness(0.2)' })
                                            }
                                            src={ `img/house/${getHouse(card)}.png` }
                                        />
                                        <div style={ {
                                            position: 'absolute',
                                            height: '100%',
                                            top: 0,
                                            bottom: 0,
                                            left: '22px',
                                            right: 0,
                                            backgroundColor: 'rgba(40,40,40,0.6)',
                                            color: 'rgba(255, 255, 255, 0.1)',
                                            zIndex: 2,
                                            fontSize: '13px',
                                            padding: '1px 2px 1px 5px',
                                            userSelect: 'none'
                                        } }
                                        >
                                            { card.name }
                                        </div>
                                    </div>
                                )
                                : (
                                    <div>
                                        <img style={ houseStyle } src={ `img/house/${getHouse(card)}.png` } />
                                        <div style={ {
                                            position: 'absolute',
                                            height: '100%',
                                            top: 0,
                                            bottom: 0,
                                            left: '22px',
                                            right: 0,
                                            backgroundColor: 'rgba(40,40,40,0.6)',
                                            color: '#FFF',
                                            zIndex: 2,
                                            fontSize: '13px',
                                            padding: '1px 2px 1px 5px',
                                            userSelect: 'none'
                                        } }
                                        >
                                            { card.name }
                                        </div>
                                    </div>
                                ) }
                        </div>
                    );
                }) }
            </div>
        );
    }
}

export default Cards;
