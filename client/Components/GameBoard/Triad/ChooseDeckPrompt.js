import React from 'react';
import styled from 'styled-components';
import Panel from '../../Site/Panel';
import { buildDeckList } from '../../../archonMaker';
import linkDeckCards from '../../../pages/Decks/linkDeckCards';
import Deck from './Deck';
import Title from './Title';

class ChooseDeckPrompt extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            deckImage0: '/img/idbacks/decklist.png',
            deckImage1: '/img/idbacks/decklist.png',
            deckImage2: '/img/idbacks/decklist.png',
            horizontalLayout: true,
        };
    }

    componentDidMount() {
        if(!this.props.buttons.length) {
            return;
        }

        const playerName = this.props.thisPlayer.name;

        this.props.triadData[playerName].deckUuids
            .forEach((uuid, i) => {
                const deck = this.props.triadData[playerName].decks[uuid];
                linkDeckCards(deck, this.props.cards);
                buildDeckList(deck, 'en', (t) => t, this.props.cards)
                    .then(img => {
                        const state = {};
                        state[`deckImage${i}`] = img;
                        state[`deckUuid${i}`] = deck.uuid;
                        this.setState(state);
                    });
            });
    }

    onButtonClick(event, command, arg, uuid, method, text) {
        event.preventDefault();

        if(!confirm(`Play ${text} first?`)) {
            return;
        }

        if(this.props.onButtonClick) {
            this.props.onButtonClick(command, arg, uuid, method);
        }
    }

    getButtons() {
        let buttonIndex = 0;
        let buttons = [];

        for(const button of this.props.buttons) {
            let option = (
                <button key={ button.command + buttonIndex.toString() }
                    className='btn btn-default prompt-button'
                    onClick={ event => this.onButtonClick(event, button.command, button.arg, button.uuid, button.method, button.text) }
                    style={ { width: '130px' } }
                >{ button.text }</button>
            );
            buttonIndex++;
            buttons.push(option);
        }

        const playerName = this.props.thisPlayer.name;
        const { triadData } = this.props;
        const bannedUuid = triadData[playerName].bannedDeck;

        const bannedBtn = (
            <button key={ 'banned-btn' }
                disabled
                className='btn btn-default prompt-button disabled'
                style={ { width: '130px' } }
            >Banned</button>
        );

        if(bannedUuid === this.state.deckUuid0) {
            buttons.unshift(bannedBtn);
        }

        if(bannedUuid === this.state.deckUuid1) {
            buttons = [buttons[0], bannedBtn, buttons[1]];
        }

        if(bannedUuid === this.state.deckUuid2) {
            buttons.push(bannedBtn);
        }

        return buttons;
    }

    safePromptText(promptObject) {
        if(promptObject) {
            return (typeof promptObject === 'string') ? promptObject : promptObject.text;
        }

        return null;
    }

    render() {
        let promptText = this.safePromptText(this.props.promptText);
        let promptTexts = [];

        if(promptText) {
            if(promptText.includes('\n')) {
                let split = promptText.split('\n');
                for(let token of split) {
                    promptTexts.push(token);
                    promptTexts.push(<br />);
                }
            } else {
                promptTexts.push(promptText);
            }
        }

        let styles = {
            overflow: 'auto',
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: '305px',
            width: 'calc(100% - 305px)',
            paddingTop: '10px',
            zIndex: 99,
            margin: 0,
        };

        const playerName = this.props.thisPlayer.name;
        const { triadData } = this.props;
        const bannedUuid = triadData[playerName].bannedDeck;
        const buttons = this.getButtons();

        const swapLayoutBtn = (
            <div style={ { marginTop: '20px' } } >
                <span
                    style={ { cursor: 'pointer', fontSize: '12px', backgroundColor: '#333', padding: '4px' } }
                    onClick={ () => this.setState({ horizontalLayout: !this.state.horizontalLayout }) }
                >
                    { this.state.horizontalLayout ? 'use vertial layout' : 'use horizonatal layout' }
                </span>
            </div>
        );

        if(!this.state.horizontalLayout) {
            return (
                <Panel title='' titleClass='phase-indicator' panelBodyClass='player-prompt-body' styles={ styles }>
                    <div className='menu-pane' style={ {
                        marginTop: '10px',
                    } }>
                        <div>
                            <Title>{ promptTexts }</Title>
                        </div>
                        { swapLayoutBtn }
                        <div style={ {
                            marginTop: '10px',
                        } }>
                            <div style={ {
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                marginTop: '20px',
                            } }>
                                { buttons[0] }
                                <Deck uuid={ this.state.deckUuid0 } image={ this.state.deckImage0 } banned={ this.state.deckUuid0 === bannedUuid } />
                            </div>
                            <div style={ {
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                marginTop: '20px',
                            } }>
                                { buttons[1] }
                                <Deck uuid={ this.state.deckUuid1 } image={ this.state.deckImage1 } banned={ this.state.deckUuid1 === bannedUuid } />
                            </div>
                            <div style={ {
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                marginTop: '20px',
                            } }>
                                { buttons[2] }
                                <Deck uuid={ this.state.deckUuid2 } image={ this.state.deckImage2 } banned={ this.state.deckUuid2 === bannedUuid } />
                            </div>
                        </div>
                    </div>
                </Panel>
            );
        }

        return (
            <Panel title='' titleClass='phase-indicator' panelBodyClass='player-prompt-body' styles={ styles }>
                <div className='menu-pane' style={ {
                    marginTop: '10px',
                } }>
                    <div>
                        <Title>{ promptTexts }</Title>
                    </div>
                    { swapLayoutBtn }
                    <div style={ {
                        display: 'flex',
                        justifyContent: 'space-around',
                        marginTop: '30px',
                    } }>
                        { buttons }
                    </div>
                    <div style={ {
                        display: 'flex',
                        justifyContent: 'space-around',
                        marginTop: '10px',
                        overflowX: 'auto',
                    } }>
                        <Deck uuid={ this.state.deckUuid0 } image={ this.state.deckImage0 } banned={ this.state.deckUuid0 === bannedUuid } />
                        <Deck uuid={ this.state.deckUuid1 } image={ this.state.deckImage1 } banned={ this.state.deckUuid1 === bannedUuid } />
                        <Deck uuid={ this.state.deckUuid2 } image={ this.state.deckImage2 } banned={ this.state.deckUuid2 === bannedUuid } />
                    </div>
                </div>
            </Panel>
        );
    }
}

export default ChooseDeckPrompt;
