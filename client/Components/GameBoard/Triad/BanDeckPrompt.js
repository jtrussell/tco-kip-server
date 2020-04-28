import React from 'react';
import styled from 'styled-components';
import Panel from '../../Site/Panel';
import { buildDeckList } from '../../../archonMaker';
import linkDeckCards from '../../../pages/Decks/linkDeckCards';
import Deck from './Deck';

class BanDeckPrompt extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            deckImage0: '/img/idbacks/decklist.png',
            deckImage1: '/img/idbacks/decklist.png',
            deckImage2: '/img/idbacks/decklist.png',
            madeSelection: false,
        };
    }

    componentWillReceiveProps(props) {
        if (!props.buttons.length) {
            return;
        }

        props.triadData[props.otherPlayer.name].deckUuids
            .forEach((uuid, i) => {
                const deck = props.triadData[props.otherPlayer.name].decks[uuid];
                linkDeckCards(deck, props.cards);
                buildDeckList(deck, 'en', (t) => t, props.cards)
                    .then(img => {
                        const state = {};
                        state[`deckImage${i}`] = img;
                        state[`deckUuid${i}`] = deck.uuid;
                        this.setState(state);
                    });
            });
    }

    onButtonClick(event, command, arg, uuid, method) {
        event.preventDefault();

        if(this.props.onButtonClick) {
            this.props.onButtonClick(command, arg, uuid, method);
        }

        this.setState({
            madeSelection: true,
        });
    }

    getButtons() {
        let buttonIndex = 0;
        let buttons = [];

        for(const button of this.props.buttons) {
            let option = (
                <button key={ button.command + buttonIndex.toString() }
                    disabled={ this.state.madeSelection }
                    className={`btn btn-default prompt-button ${this.state.madeSelection ? 'disabled' : ''}`}
                    onClick={ event => this.onButtonClick(event, button.command, button.arg, button.uuid, button.method) }
                    style={{ width: '130px' }}
                >{ button.text }</button>);
            buttonIndex++;
            buttons.push(option);
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
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            paddingTop: '10px',
            zIndex: 99,
            margin: 0,
        };

        return (
            <Panel title='' titleClass='phase-indicator' panelBodyClass='player-prompt-body' styles={ styles }>
                <div className='menu-pane' style={ {
                    marginTop: '10px',
                } }>
                    <div>
                        <h4>{ promptTexts }</h4>
                    </div>
                    <div style={ {
                        display: 'flex',
                        justifyContent: 'space-around',
                        marginTop: '30px',
                    } }>
                        { this.getButtons() }
                    </div>
                    <div style={ {
                        display: 'flex',
                        justifyContent: 'space-around',
                        marginTop: '10px',
                    } }>
                        <Deck uuid={ this.state.deckUuid0 } image={ this.state.deckImage0 }/>
                        <Deck uuid={ this.state.deckUuid1 } image={ this.state.deckImage1 }/>
                        <Deck uuid={ this.state.deckUuid2 } image={ this.state.deckImage2 }/>
                    </div>
                </div>
            </Panel>
        );
    }
}

export default BanDeckPrompt;
