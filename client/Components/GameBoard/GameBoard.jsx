import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import $ from 'jquery';
import { toastr } from 'react-redux-toastr';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';

import PlayerStats from './PlayerStats';
import PlayerRow from './PlayerRow';
import ActivePlayerPrompt from './ActivePlayerPrompt';
import AdaptiveShortDeckSelectPrompt from './AdaptiveShortDeckSelectPrompt';
import CardZoom from './CardZoom';
import PlayerBoard from './PlayerBoard';
import GameChat from './GameChat';
import GameConfigurationModal from './GameConfigurationModal';
import Droppable from './Droppable';
import TimeLimitClock from './TimeLimitClock';
import ChessClock from './ChessClock';
import * as actions from '../../actions';
import getCardImageURL from '../../getCardImageURL';
import DeckTracker from '../DeckTracker';
import Menu from './Menu';
import styled from 'styled-components';
import { withTranslation, Trans } from 'react-i18next';
import TrackerLink from './TrackerLink';

const MenuContainer = styled.div`
    max-width: 280px;
    min-width: 160px;
    z-index: 20;
    position: fixed;
    top: 0;
    right: 0;
    display: flex;
    justify-content: flex-end;
`;

const startCrucibleAddons = require('../../crucibleaddons/index');

const placeholderPlayer = {
    cardPiles: {
        cardsInPlay: [],
        discard: [],
        hand: [],
        purged: [],
        deck:[]
    },
    faction: null,
    activePlayer: false,
    numDeckCards: 0,
    stats: {
        keys: { red: false, blue: false, yellow: false }
    },
    houses: [],
    deckName: '',
    deckUuid: '',
    deckSet: 0,
    deckCards:[],
    title: null,
    user: null
};

export class GameBoard extends React.Component {
    constructor() {
        super();

        setTimeout(() => {
            startCrucibleAddons();
        }, 0);

        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onCardClick = this.onCardClick.bind(this);
        this.handleDrawPopupChange = this.handleDrawPopupChange.bind(this);
        this.onDragDrop = this.onDragDrop.bind(this);
        this.onCommand = this.onCommand.bind(this);
        this.onConcedeClick = this.onConcedeClick.bind(this);
        this.onLeaveClick = this.onLeaveClick.bind(this);
        this.onReportWin = this.onReportWin.bind(this);
        this.onShuffleClick = this.onShuffleClick.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);
        this.sendChatMessage = this.sendChatMessage.bind(this);
        this.onSettingsClick = this.onSettingsClick.bind(this);
        this.onMessagesClick = this.onMessagesClick.bind(this);
        this.onManualModeClick = this.onManualModeClick.bind(this);
        this.onMuteClick = this.onMuteClick.bind(this);

        this.state = {
            cardToZoom: undefined,
            spectating: true,
            showActionWindowsMenu: false,
            showCardMenu: {},
            showMessages: true,
            lastMessageCount: 0,
            newMessages: 0,
            menuOptions: [],
            showDeckTracker: false,
            showTrackerLink: false,
        };
    }

    componentDidMount() {
        this.updateContextMenu(this.props);

        // Timing issues can result in the modal 'sticking', manually clear it
        $('.modal-backdrop').remove();
    }

    componentWillReceiveProps(props) {
        this.updateContextMenu(props);

        let lastMessageCount = this.state.lastMessageCount;
        let currentMessageCount = props.currentGame ? props.currentGame.messages.length : 0;

        if (props.currentGame.winner && !this.state.showTrackerLink) {
            this.setState({ showTrackerLink: true });
        }

        if(this.state.showMessages) {
            this.setState({ lastMessageCount: currentMessageCount, newMessages: 0 });
        } else {
            this.setState({ newMessages: currentMessageCount - lastMessageCount });
        }
    }

    updateContextMenu(props) {
        if(!props.currentGame || !props.user) {
            return;
        }

        let thisPlayer = props.currentGame.players[props.user.username];

        if(thisPlayer) {
            this.setState({ spectating: false });
        } else {
            this.setState({ spectating: true });
        }

        let menuOptions = [{
            text: 'Profile',
            onClick: () => this.props.navigate('/profile')
        }];

        if(props.currentGame && props.currentGame.started) {
            const playerNames = Object.keys(props.currentGame.players);
            const isPlayer = props.currentGame.players[props.user.username];

            if(isPlayer) {
                const opponentName = playerNames.filter(p => p !== props.user.username)[0];

                menuOptions = [{
                    text: 'Toggle Deck Tracker',
                    onClick: () => this.setState({ showDeckTracker: !this.state.showDeckTracker }),
                }, {
                    text: 'Profile',
                    onClick: () => this.props.navigate('/profile')
                }];
                const hasWinner = props.currentGame.winner;
                if (!hasWinner) {
                    menuOptions.push({   
                        text: 'Concede',
                        onClick: this.onConcedeClick 
                    });
                }

                if (opponentName) {
                    const opponent = props.currentGame.players[opponentName];
                    const hasOpponentWhoLeft = opponent && (opponent.left || opponent.disconnected);
                    const isManualMode = props.currentGame.manualMode;

                    if (hasOpponentWhoLeft || isManualMode || hasWinner) {
                        menuOptions.push({
                            text: 'Leave Game',
                            onClick: this.onLeaveClick
                        });
                    }

                    if (hasOpponentWhoLeft && !hasWinner) {
                        menuOptions.push({
                            text: 'Report as Win',
                            onClick: this.onReportWin
                        });
                    }
                } else {
                    menuOptions.push({
                        text: 'Leave Game',
                        onClick: this.onLeaveClick
                    });
                }
            } else {
                menuOptions.push({
                    text: 'Leave Game',
                    onClick: this.onLeaveClick
                });
            }

            menuOptions.unshift({
                text: `${props.currentGame.spectators.length} spectators`,
                options: props.currentGame.spectators.map(s => s.name)
            });

            if (isPlayer) {
                menuOptions.unshift({
                    text: 'Manual Mode',
                    onClick: this.onManualModeClick,
                });
            }

            this.setContextMenu(menuOptions);
        } else {
            this.setContextMenu([]);
        }
    }

    setContextMenu(menu) {
        this.setState({
            menuOptions: menu
        });
    }

    onConcedeClick() {
        toastr.confirm('Are you sure you want to concede?', {
            okText: 'Yes',
            cancelText: 'Cancel',
            onOk: () => {
                this.props.sendGameMessage('concede');
            }
        });
    }

    isGameActive() {
        if(!this.props.currentGame || !this.props.user) {
            return false;
        }

        if(this.props.currentGame.winner) {
            return false;
        }

        let thisPlayer = this.props.currentGame.players[this.props.user.username];
        if(!thisPlayer) {
            thisPlayer = Object.values(this.props.currentGame.players)[0];
        }

        let otherPlayer = Object.values(this.props.currentGame.players).find(player => {
            return player.name !== thisPlayer.name;
        });

        if(!otherPlayer) {
            return false;
        }

        if(otherPlayer.disconnected || otherPlayer.left) {
            return false;
        }

        return true;
    }

    onLeaveClick() {
        let t = this.props.t;

        if(!this.state.spectating && this.isGameActive()) {
            toastr.confirm(t('Your game is not finished, are you sure you want to leave?'), {
                okText: 'Yes',
                cancelText: 'Cancel',
                onOk: () => {
                    this.props.sendGameMessage('leavegame');
                    this.props.closeGameSocket();
                }
            });

            return;
        }

        this.props.sendGameMessage('leavegame');
        this.props.closeGameSocket();
    }

    onReportWin() {
        toastr.confirm('Are you sure you want to report as a win?', {
            okText: 'Yes',
            cancelText: 'Cancel',
            onOk: () => {
                this.props.sendGameMessage('wingame');
            }
        });
    }

    onMouseOver(card) {
        this.props.zoomCard(card);
    }

    onMouseOut() {
        this.props.clearZoom();
    }

    onCardClick(card) {
        this.props.sendGameMessage('cardClicked', card.uuid);
    }

    handleDrawPopupChange(event) {
        this.props.sendGameMessage('showDrawDeck', event.visible);
    }

    sendChatMessage(message) {
        this.props.sendGameMessage('chat', message);
    }

    onShuffleClick() {
        this.props.sendGameMessage('shuffleDeck');
    }

    onDragDrop(card, source, target) {
        this.props.sendGameMessage('drop', card.uuid, source, target);
    }

    getChessClock() {
        let clock = null;
        if(this.props.currentGame.useChessClock) {
            const players = Object.values(this.props.currentGame.players)
            const activePlayer = players.find(player => player.activePlayer);
            clock = (<ChessClock
                players={ this.props.currentGame.players }
                activePlayer={ activePlayer }
            />);
        }

        return clock;
    }

    onCommand(command, arg, uuid, method) {
        let commandArg = arg;

        this.props.sendGameMessage(command, commandArg, uuid, method);
    }

    onMenuItemClick(card, menuItem) {
        this.props.sendGameMessage('menuItemClick', card.uuid, menuItem);
    }

    onOptionSettingToggle(option, value) {
        this.props.sendGameMessage('toggleOptionSetting', option, value);
    }

    onMuteClick() {
        this.props.sendGameMessage('toggleMuteSpectators');
    }

    onSettingsClick() {
        $('#settings-modal').modal('show');
    }

    onMessagesClick() {
        const showState = !this.state.showMessages;

        let newState = {
            showMessages: showState
        };

        if(showState) {
            newState.newMessages = 0;
            newState.lastMessageCount = this.props.currentGame.messages.length;
        }

        this.setState(newState);
    }

    onManualModeClick(event) {
        event.preventDefault();
        this.props.sendGameMessage('toggleManualMode');
    }

    defaultPlayerInfo(source) {
        let player = Object.assign({}, placeholderPlayer, source);
        player.cardPiles = Object.assign({}, placeholderPlayer.cardPiles, player.cardPiles);
        return player;
    }

    renderBoard(thisPlayer, otherPlayer) {
        return [
            <div key='board-middle' className='board-middle'>
                <div className='player-home-row'>
                    <PlayerRow
                        player={ 2 }
                        stats={ otherPlayer.stats }
                        sendGameMessage={ this.props.sendGameMessage }
                        manualMode={ this.props.currentGame.manualMode }
                        cardBackUrl={ this.props.player2CardBack }
                        faction={ otherPlayer.faction }
                        archives={ otherPlayer.cardPiles.archives }
                        hand={ otherPlayer.cardPiles.hand } isMe={ false }
                        language={ this.props.i18n.language }
                        deckCards = { otherPlayer.deckCards }
                        deckName = { otherPlayer.deckName }
                        deckUuid = { otherPlayer.deckUuid }
                        deckSet = { otherPlayer.deckSet }
                        drawDeck = { otherPlayer.cardPiles.deck }
                        houses = { otherPlayer.houses }
                        numDeckCards={ otherPlayer.numDeckCards }
                        discard={ otherPlayer.cardPiles.discard }
                        onCardClick={ this.onCardClick }
                        onMouseOver={ this.onMouseOver }
                        onMouseOut={ this.onMouseOut }
                        purgedPile={ otherPlayer.cardPiles.purged }
                        keys={ otherPlayer.stats.keys }
                        spectating={ this.state.spectating }
                        title={ otherPlayer.title }
                        side='top'
                        username={ this.props.user.username }
                        cardSize={ this.props.user.settings.cardSize } />
                </div>
                <div className='board-inner'>
                    <div className='play-area'>
                        <PlayerBoard
                            cardBackUrl={ this.props.player2CardBack }
                            cardsInPlay={ otherPlayer.cardPiles.cardsInPlay }
                            onCardClick={ this.onCardClick }
                            onMenuItemClick={ this.onMenuItemClick }
                            onMouseOut={ this.onMouseOut }
                            onMouseOver={ this.onMouseOver }
                            rowDirection='reverse'
                            playerName={ this.props.playerName }
                            side='top'
                            user={ this.props.user } />
                        <Droppable onDragDrop={ this.onDragDrop } source='play area' manualMode={ this.props.currentGame.manualMode }>
                            <PlayerBoard
                                cardBackUrl={ this.props.player1CardBack }
                                cardsInPlay={ thisPlayer.cardPiles.cardsInPlay }
                                manualMode={ this.props.currentGame.manualMode }
                                onCardClick={ this.onCardClick }
                                onMenuItemClick={ this.onMenuItemClick }
                                onMouseOut={ this.onMouseOut }
                                onMouseOver={ this.onMouseOver }
                                rowDirection='default'
                                side='bottom'
                                user={ this.props.user } />
                        </Droppable>
                    </div>
                </div>
                { this.getChessClock() }
                <div className='player-home-row our-side'>
                    <PlayerRow isMe={ !this.state.spectating }
                        player={ 1 }
                        stats={ thisPlayer.stats }
                        sendGameMessage={ this.props.sendGameMessage }
                        cardBackUrl={ this.props.player1CardBack }
                        archives={ thisPlayer.cardPiles.archives }
                        language={ this.props.i18n.language }
                        deckCards = { thisPlayer.deckCards }
                        deckName = { thisPlayer.deckName }
                        deckUuid = { thisPlayer.deckUuid }
                        deckSet = { thisPlayer.deckSet }
                        drawDeck = { thisPlayer.cardPiles.deck }
                        houses = { thisPlayer.houses }
                        faction={ thisPlayer.faction }
                        hand={ thisPlayer.cardPiles.hand }
                        onCardClick={ this.onCardClick }
                        onMouseOver={ this.onMouseOver }
                        onMouseOut={ this.onMouseOut }
                        numDeckCards={ thisPlayer.numDeckCards }
                        keys={ thisPlayer.stats.keys }
                        onDrawPopupChange={ this.handleDrawPopupChange }
                        onShuffleClick={ this.onShuffleClick }
                        purgedPile={ thisPlayer.cardPiles.purged }
                        onDragDrop={ this.onDragDrop }
                        discard={ thisPlayer.cardPiles.discard }
                        showDeck={ thisPlayer.showDeck }
                        spectating={ this.state.spectating }
                        title={ thisPlayer.title }
                        onMenuItemClick={ this.onMenuItemClick }
                        cardSize={ this.props.user.settings.cardSize }
                        manualMode={ this.props.currentGame.manualMode }
                        side='bottom' />
                </div>
            </div>
        ];
    }

    render() {
        if(!this.props.currentGame || !this.props.cards || !this.props.currentGame.started) {
            return <div><Trans>Waiting for server...</Trans></div>;
        }

        window.game = this.props.currentGame;

        if(!this.props.user) {
            this.props.navigate('/');
            return <div><Trans>You are not logged in, redirecting...</Trans></div>;
        }

        let thisPlayer = this.props.currentGame.players[this.props.user.username];
        if(!thisPlayer) {
            thisPlayer = Object.values(this.props.currentGame.players)[0];
        }

        if(!thisPlayer) {
            return <div><Trans>Waiting for game to have players or close...</Trans></div>;
        }

        let otherPlayer = Object.values(this.props.currentGame.players).find(player => {
            return player.name !== thisPlayer.name;
        });

        // Default any missing information
        thisPlayer = this.defaultPlayerInfo(thisPlayer);
        otherPlayer = this.defaultPlayerInfo(otherPlayer);

        let boundActionCreators = bindActionCreators(actions, this.props.dispatch);

        let boardClass = classNames('game-board', {
            'select-cursor': thisPlayer && thisPlayer.selectCard
        });

        let manualMode = this.props.currentGame.manualMode;
        let cardToZoom;

        if(this.props.cardToZoom && this.props.cards[this.props.cardToZoom.code]) {
            cardToZoom = this.props.cards[this.props.cardToZoom.code];
        } else if(this.props.cardToZoom) {
            cardToZoom = this.props.cardToZoom;
        }

        let adaptivePrompt = null;
        if (this.props.currentGame.adaptiveData && this.props.currentGame.adaptiveData.match > 1) {
            const { adaptiveData } = this.props.currentGame;
            const player1 = Object.keys(this.props.currentGame.players)[0];
            const player2 = Object.keys(this.props.currentGame.players)[1];

            if (player1 && player2) {
                const player1Wins = adaptiveData.records.filter(record => record === player1).length;
                const player2Wins = adaptiveData.records.filter(record => record === player2).length;
                adaptivePrompt = (
                    <div style={{ position: 'absolute', top: '50px', right: '340px', }}>
                        {`GAME ${Math.min(adaptiveData.match, 3)}`}
                        <br/>
                        {`${player1} has ${player1Wins} win${player1Wins === 1 ? '' : 's'}`}
                        <br/>
                        {`${player2} has ${player2Wins} win${player2Wins === 1 ? '' : 's'}`}
                    </div>
                )
            }
        }

        [
            thisPlayer, otherPlayer
        ].forEach(player => {
            const foiledCards = player.deckCards.filter(c => c.foil);
            foiledCards.forEach(card => {
                ['hand', 'deck', 'discard', 'archives', 'purged', 'cardsInPlay']
                    .forEach(location => {
                        player.cardPiles[location].forEach(locationCard => {
                            if (locationCard.id === card.id) {
                                locationCard.foil = true;
                            }
                        });
                    });
            });
        });

        return (
            <div className={ boardClass }>
                <MenuContainer>
                    <Menu user={this.props.user} options={this.state.menuOptions}/>
                </MenuContainer>
                <GameConfigurationModal
                    optionSettings={ thisPlayer.optionSettings }
                    onOptionSettingToggle={ this.onOptionSettingToggle.bind(this) }
                    id='settings-modal' />
                <div className='player-stats-row stats-top'>
                    <PlayerStats stats={ otherPlayer.stats } side='top' deckUuid={ otherPlayer.deckUuid } houses={ otherPlayer.houses } activeHouse={ otherPlayer.activeHouse }
                        user={ otherPlayer.user } activePlayer={ otherPlayer.activePlayer } />
                </div>
                <div className='prompt-area'>
                    <div className='inset-pane'>
                        {thisPlayer.promptType !== 'adaptive-short-deck-select' && (
                            <ActivePlayerPrompt
                                cards={ this.props.cards }
                                buttons={ thisPlayer.buttons }
                                controls={ thisPlayer.controls }
                                promptText={ thisPlayer.menuTitle }
                                promptType={ thisPlayer.promptType }
                                promptTitle={ thisPlayer.promptTitle }
                                onButtonClick={ this.onCommand }
                                onMouseOver={ this.onMouseOver }
                                onMouseOut={ this.onMouseOut }
                                user={ this.props.user }
                                phase={ thisPlayer.phase }
                            />
                        )}
                    </div>
                </div>
                <div className='main-window'>
                    { this.renderBoard(thisPlayer, otherPlayer) }
                    <CardZoom
                        imageUrl={ cardToZoom ? getCardImageURL(cardToZoom.name) : '' }
                        show={ !!cardToZoom }
                        cardName={ cardToZoom ? cardToZoom.name : null }
                        card={ cardToZoom }
                        size={ cardToZoom ? cardToZoom.size : null }
                    />
                    <div className='right-side'>
                        <div className='prompt-area'>
                            <div className='inset-pane'>
                                {thisPlayer.promptType === 'adaptive-short-deck-select' && (
                                    <AdaptiveShortDeckSelectPrompt
                                        cards={ this.props.cards }
                                        thisPlayer={ thisPlayer }
                                        otherPlayer={ otherPlayer }
                                        onButtonClick={ this.onCommand }
                                        buttons={ thisPlayer.buttons }
                                        promptText={ thisPlayer.menuTitle }
                                        promptType={ thisPlayer.promptType }
                                        promptTitle={ thisPlayer.promptTitle }
                                        phase={ thisPlayer.phase }
                                    />
                                )}
                            </div>
                        </div>
                        { this.state.showMessages && <div className='gamechat'>
                            <GameChat key='gamechat'
                                messages={ this.props.currentGame.messages }
                                onCardMouseOut={ this.onMouseOut }
                                onCardMouseOver={ this.onMouseOver }
                                onSendChat={ this.sendChatMessage }
                                muted={ this.state.spectating && this.props.currentGame.muteSpectators } />
                        </div>
                        }
                    </div>
                </div>
                <div className='player-stats-row' style={{ position: 'absolute', bottom: 0 }}>
                    <PlayerStats { ...boundActionCreators } side='bottom' stats={ thisPlayer.stats } showControls={ !this.state.spectating && manualMode } user={ thisPlayer.user }
                        activePlayer={ thisPlayer.activePlayer } onSettingsClick={ this.onSettingsClick } showMessages
                        onMessagesClick={ this.onMessagesClick } numMessages={ this.state.newMessages } houses={ thisPlayer.houses } onManualModeClick={ this.onManualModeClick }
                        activeHouse={ thisPlayer.activeHouse } manualModeEnabled={ manualMode } showManualMode={ !this.state.spectating }
                        muteSpectators={ this.props.currentGame.muteSpectators } onMuteClick={ this.onMuteClick } deckUuid={ thisPlayer.deckUuid }/>
                </div>
                {(!this.state.spectating && this.state.showDeckTracker) && <DeckTracker
                    user={this.props.user.username}
                    game={this.props.currentGame}
                />}
                {adaptivePrompt}
                {this.state.showTrackerLink && <TrackerLink gameId={ this.props.currentGame.id }/>}
            </div >);
    }
}

GameBoard.displayName = 'GameBoard';
GameBoard.propTypes = {
    cardToZoom: PropTypes.object,
    cards: PropTypes.object,
    clearZoom: PropTypes.func,
    closeGameSocket: PropTypes.func,
    currentGame: PropTypes.object,
    dispatch: PropTypes.func,
    i18n: PropTypes.object,
    navigate: PropTypes.func,
    packs: PropTypes.array,
    player1CardBack: PropTypes.string,
    player2CardBack: PropTypes.string,
    restrictedList: PropTypes.array,
    sendGameMessage: PropTypes.func,
    setContextMenu: PropTypes.func,
    socket: PropTypes.object,
    t: PropTypes.func,
    user: PropTypes.object,
    zoomCard: PropTypes.func
};

function mapStateToProps(state) {
    return {
        cardToZoom: state.cards.zoomCard,
        cards: state.cards.cards,
        currentGame: state.lobby.currentGame,
        packs: state.cards.packs,
        player1CardBack: state.cards.player1CardBack,
        player2CardBack: state.cards.player2CardBack,
        restrictedList: state.cards.restrictedList,
        socket: state.lobby.socket,
        user: state.account.user
    };
}

function mapDispatchToProps(dispatch) {
    let boundActions = bindActionCreators(actions, dispatch);
    boundActions.dispatch = dispatch;

    return boundActions;
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(GameBoard));

