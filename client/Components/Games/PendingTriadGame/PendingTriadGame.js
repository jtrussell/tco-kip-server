import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import $ from 'jquery';

import Panel from '../../Site/Panel';
import Messages from '../../GameBoard/Messages';
import Avatar from '../../Site/Avatar';
import SelectDeckModal from '../SelectDeckModal';
import DeckStatus from '../../Decks/DeckStatus';
import * as actions from '../../../actions';

class PendingTriadGame extends React.Component {
    constructor() {
        super();

        this.isGameReady = this.isGameReady.bind(this);
        this.onSelectDeckClick = this.onSelectDeckClick.bind(this);
        this.onLeaveClick = this.onLeaveClick.bind(this);
        this.onStartClick = this.onStartClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onSendClick = this.onSendClick.bind(this);
        this.onMouseOut = this.onMouseOver.bind(this);

        this.state = {
            playerCount: 1,
            decks: [],
            playSound: true,
            message: '',
            decksLoading: true,
            waiting: false,
            phase: 'select-deck',
        };

        this.notification = undefined;
    }

    componentDidMount() {
        this.props.loadDecks();
    }

    componentWillReceiveProps(props) {
        if(!props.user) {
            return;
        }

        let players = this.getNumberOfPlayers(props);

        if(this.notification && this.state.playerCount === 1 && players === 2 && props.currentGame.owner === this.props.user.username) {
            let promise = this.notification.play();

            if(promise !== undefined) {
                promise.catch(() => {
                }).then(() => {
                });
            }

            if(window.Notification && Notification.permission === 'granted') {
                let otherPlayer = Object.values(props.currentGame.players).find(p => p.name !== props.user.username);
                let windowNotification = new Notification('KiP Tournaments', { body: `${otherPlayer.name} has joined your game`, icon: '/img/amber.png' });
                setTimeout(() => windowNotification.close(), 5000);
            }
        }

        if(props.connecting) {
            this.setState({ waiting: false });
        }

        this.setState({ playerCount: players });
    }

    isGameReady() {
        if(!this.props.user) {
            return false;
        }

        if(!Object.values(this.props.currentGame.players).every(player => {
            const triadData = this.props.currentGame.triadData[player.name];
            return triadData && triadData.deckUuids.length === 3;
        })) {
            return false;
        }

        if(this.getNumberOfPlayers(this.props) < 2) {
            return false;
        }

        return this.props.currentGame.owner === this.props.user.username;
    }

    onSelectDeckClick(id) {
        $('#decks-modal-' + id).modal('show');
    }

    selectDeck(deck, slot) {
        $('#decks-modal-a').modal('hide');
        $('#decks-modal-b').modal('hide');
        $('#decks-modal-c').modal('hide');

        if(this.props.currentGame.triadData[this.props.user.username].deckUuids.includes(deck.uuid)) {
            return;
        }

        if(slot === 0) {
            this.props.socket.emit('selectdeck', this.props.currentGame.id, deck._id);
        }

        this.props.socket.emit('selecttriaddeck', this.props.currentGame.id, deck.uuid, slot);
    }

    getNumberOfPlayers(props) {
        return Object.values(props.currentGame.players).length;
    }

    getPlayerStatus(player, username, triadData) {
        let playerIsMe = player && player.name === username;

        let selectLink = null;

        if(!playerIsMe) {
            const decks = triadData[player.name] ? triadData[player.name].deckUuids : [];

            return (
                <div className='player-row' key={ player.name } style={ { display: 'flex' } }>
                    <div>
                        <Avatar user={ player } />
                        <span style={ { marginTop: '5px' } }>{ player.name }</span>
                        { decks.length === 3
                            ?
                            ' is ready'
                            :
                            ' is selecting decks'
                        }
                    </div>
                </div>
            );
        }

        triadData[username] = triadData[username] || {
            deckUuids: [],
            decks: {},
        };

        let deckA;
        const deckAUuid = triadData[username].deckUuids[0];
        if(deckAUuid) {
            deckA = this.props.decks.find(d => d.uuid === deckAUuid);
        }

        let deckB;
        const deckBUuid = triadData[username].deckUuids[1];
        if(deckBUuid) {
            deckB = this.props.decks.find(d => d.uuid === deckBUuid);
        }

        let deckC;
        const deckCUuid = triadData[username].deckUuids[2];
        if(deckCUuid) {
            deckC = this.props.decks.find(d => d.uuid === deckCUuid);
        }

        return (
            <div className='player-row' key={ player.name } style={ { display: 'flex' } }>
                <div>
                    <Avatar user={ player } />
                    <span style={ { marginTop: '5px' } }>{ player.name }</span>
                </div>
                <div>
                    <div style={ { margin: '5px 10px 15px' } }>
                        { deckA ? (
                            <span className='deck-selection clickable' style={ { margin: 0 } } onClick={ () => this.onSelectDeckClick('a') }>{ deckA.name }</span>
                        ) : (
                            <span className='card-link' onClick={ () => this.onSelectDeckClick('a') }>Select deck A...</span>
                        ) }
                    </div>
                    <div style={ { margin: '15px 10px' } }>
                        { deckB ? (
                            <span className='deck-selection clickable' style={ { margin: 0 } } onClick={ () => this.onSelectDeckClick('b') }>{ deckB.name }</span>
                        ) : (
                            <span className='card-link' onClick={ () => this.onSelectDeckClick('b') }>Select deck B...</span>
                        ) }
                    </div>
                    <div style={ { margin: '15px 10px' } }>
                        { deckC ? (
                            <span className='deck-selection clickable' style={ { margin: 0 } } onClick={ () => this.onSelectDeckClick('c') }>{ deckC.name }</span>
                        ) : (
                            <span className='card-link' onClick={ () => this.onSelectDeckClick('c') }>Select deck C...</span>
                        ) }
                    </div>
                </div>
            </div>
        );

        if(player && player.deck && player.deck.selected) {
            if(playerIsMe) {
                deck = <span className='deck-selection clickable' onClick={ this.onSelectDeckClick }>{ player.deck.name }</span>;
            } else {
                deck = <span className='deck-selection'>Deck Selected</span>;
            }
        } else if(player && playerIsMe) {
            selectLink = <span className='card-link' onClick={ this.onSelectDeckClick } style={ { marginLeft: '10px' } }>Select deck...</span>;
        }

        return (
            <div className='player-row' key={ player.name } style={ { display: 'flex', alignItems: 'center' } }>
                <Avatar user={ player } /><span>{ player.name }</span>{ deck } { selectLink }
            </div>);
    }

    getGameType() {
        return {
            adaptive: 'Adaptive',
            chainbound: 'Chainbound',
            adaptiveShort: 'Adaptive Short',
            freeplay: 'Free Play',
            triad: 'Triad',
        }[this.props.currentGame.gameType];
    }

    getGameStatus() {
        if(this.props.connecting) {
            return 'Connecting to game server';
        }

        if(this.state.waiting) {
            return 'Waiting for lobby server...';
        }

        if(this.getNumberOfPlayers(this.props) < 2) {
            return 'Waiting for players...';
        }

        if(!Object.values(this.props.currentGame.players).every(player => {
            const triadData = this.props.currentGame.triadData[player.name];
            return triadData && triadData.deckUuids.length === 3;
        })) {
            return 'Waiting for players to select decks';
        }

        if(this.props.currentGame.owner === this.props.user.username) {
            return 'Ready to begin, click start to begin the game';
        }

        return 'Ready to begin, waiting for opponent to start the game';
    }

    onLeaveClick(event) {
        event.preventDefault();
        this.props.leaveGame(this.props.currentGame.id);
    }

    onStartClick(event) {
        event.preventDefault();
        this.setState({ waiting: true });
        this.props.startGame(this.props.currentGame.id);
    }

    sendMessage() {
        if(this.state.message === '') {
            return;
        }

        this.props.sendSocketMessage('chat', this.state.message);
        this.setState({ message: '' });
    }

    onKeyPress(event) {
        if(event.key === 'Enter') {
            this.sendMessage();
            event.preventDefault();
        }
    }

    onSendClick(event) {
        event.preventDefault();
        this.sendMessage();
    }

    onChange(event) {
        this.setState({ message: event.target.value });
    }

    onMouseOver(card) {
        this.props.zoomCard(card);
    }

    render() {
        let t = this.props.t;

        if(this.props.currentGame && this.props.currentGame.started) {
            return <div>Loading game in progress, please wait...</div>;
        }

        if(!this.props.user) {
            this.props.navigate('/');
            return <div>You must be logged in to play, redirecting...</div>;
        }

        if(this.state.phase === 'ban') {
            return (
                <BanScreen />
            );
        }

        return (
            <div>
                <audio ref={ ref => this.notification = ref }>
                    <source src='/sound/charge.mp3' type='audio/mpeg' />
                    <source src='/sound/charge.ogg' type='audio/ogg' />
                </audio>
                <Panel title={ this.props.currentGame.name }>
                    <div className='btn-group' style={ { display: 'flex', justifyContent: 'space-between' } }>
                        <button className='btn btn-success' disabled={ !this.isGameReady() || this.props.connecting || this.state.waiting } onClick={ this.onStartClick }>Start</button>
                        <button className='btn btn-danger' onClick={ this.onLeaveClick }>Leave</button>
                    </div>
                    <div style={ { display: 'flex', justifyContent: 'space-between', marginTop: '10px' } }>
                        <div>{ this.getGameStatus() }</div>
                        <div>{ this.getGameType() }</div>
                    </div>
                </Panel>
                <Panel title={ 'Players' }>
                    {
                        Object.values(this.props.currentGame.players).map(player => {
                            return this.getPlayerStatus(player, this.props.user.username, this.props.currentGame.triadData);
                        })
                    }
                </Panel>
                <Panel title={ `Spectators(${this.props.currentGame.spectators.length })` }>
                    { this.props.currentGame.spectators.map(spectator => {
                        return <div key={ spectator.name }>{ spectator.name }</div>;
                    }) }
                </Panel>
                <Panel title={ 'Chat' }>
                    <div className='message-list'>
                        <Messages messages={ this.props.currentGame.messages } onCardMouseOver={ this.onMouseOver } onCardMouseOut={ this.onMouseOut } />
                    </div>
                    <form className='form form-hozitontal'>
                        <div className='form-group'>
                            <input className='form-control' type='text' placeholder={ 'Enter a message...' } value={ this.state.message }
                                onKeyPress={ this.onKeyPress } onChange={ this.onChange } />
                        </div>
                    </form>
                </Panel>
                <SelectDeckModal
                    apiError={ this.props.apiError }
                    decks={ this.props.decks }
                    allowEarlyAccessDecks={ this.props.currentGame.allowEarlyAccessDecks }
                    id='decks-modal-a'
                    loading={ this.props.loading }
                    onDeckSelected={ (deck) => this.selectDeck(deck, 0) }
                    standaloneDecks={ this.props.standaloneDecks }
                />
                <SelectDeckModal
                    apiError={ this.props.apiError }
                    decks={ this.props.decks }
                    allowEarlyAccessDecks={ this.props.currentGame.allowEarlyAccessDecks }
                    id='decks-modal-b'
                    loading={ this.props.loading }
                    onDeckSelected={ (deck) => this.selectDeck(deck, 1) }
                    standaloneDecks={ this.props.standaloneDecks }
                />
                <SelectDeckModal
                    apiError={ this.props.apiError }
                    decks={ this.props.decks }
                    allowEarlyAccessDecks={ this.props.currentGame.allowEarlyAccessDecks }
                    id='decks-modal-c'
                    loading={ this.props.loading }
                    onDeckSelected={ (deck) => this.selectDeck(deck, 2) }
                    standaloneDecks={ this.props.standaloneDecks }
                />
            </div >);
    }
}

function mapStateToProps(state) {
    return {
        apiError: state.api.message,
        connecting: state.games.connecting,
        currentGame: state.lobby.currentGame,
        decks: state.cards.decks,
        host: state.games.gameHost,
        loading: state.api.loading,
        socket: state.lobby.socket,
        standaloneDecks: state.cards.standaloneDecks,
        user: state.account.user
    };
}

export default connect(mapStateToProps, actions)(PendingTriadGame);
