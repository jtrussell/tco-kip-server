import React from 'react';
import { withTranslation } from 'react-i18next';
import styled from 'styled-components';

import AbilityTargeting from './AbilityTargeting';
import CardNameLookup from './CardNameLookup';
import TraitNameLookup from './TraitNameLookup';
import HouseSelect from './HouseSelect';
import OptionsSelect from './OptionsSelect';
import Panel from '../Site/Panel';
import { buildDeckList } from '../../archonMaker';
import * as Images from '../../assets/img';

class AdaptiveShortDeckSelectPrompt extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            deckImageA: Images.cardback,
            deckImageB: Images.cardback
        };
    }

    componentWillReceiveProps(props) {
        if (!props.buttons.length) {
            return;
        }

        const {
            thisPlayer,
            otherPlayer
        } = props;

        const playerA = props.buttons[0].arg === thisPlayer.deckUuid ? thisPlayer : otherPlayer;
        const playerB = props.buttons[0].arg === thisPlayer.deckUuid ? otherPlayer : thisPlayer;

        const deckA = {
            name: playerA.deckName,
            cards: playerA.deckCards,
            houses: playerA.houses,
            uuid: playerA.deckUuid,
            expansion: playerA.deckSet
        };

        buildDeckList(deckA, 'en', (t) => t, props.cards)
            .then(img => this.setState({
                deckImageA: img,
                deckAUUID: deckA.uuid,
            }));

        const deckB = {
            name: playerB.deckName,
            cards: playerB.deckCards,
            houses: playerB.houses,
            uuid: playerB.deckUuid,
            expansion: playerB.deckSet
        };

        buildDeckList(deckB, 'en', (t) => t, props.cards)
            .then(img => this.setState({
                deckImageB: img,
                deckBUUID: deckB.uuid,
            }));
    }

    onButtonClick(event, command, arg, uuid, method) {
        event.preventDefault();

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
        let promptTitle;

        if(this.props.promptTitle) {
            let promptTitleText = this.safePromptText(this.props.promptTitle);
            promptTitle = (<div className='menu-pane-source'>
                Adaptive Short Deck Selection
            </div>);
        }

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

        const DeckList = styled.img`
            height: 500px;
            margin: 0 20px 20px 20px;
        `;

        return (
            <Panel title='' titleClass='phase-indicator' panelBodyClass='player-prompt-body' styles={ styles }>
                { promptTitle }
                <div className='menu-pane' style={ {
                    marginTop: '10px',
                } }>
                    <div >
                        <h4>{ promptTexts }</h4>
                        <a href='https://www.reddit.com/r/KeyforgeGame/comments/cfpk2m/adaptive_short_a_format_concept_that_takes_the/' target='_blank'>Variant Rules</a>
                    </div>
                    <div style={ {
                        display: 'flex',
                        justifyContent: 'space-around',
                    } }>
                        { this.getButtons() }
                    </div>
                    <div style={ {
                        display: 'flex',
                        justifyContent: 'space-around',
                        marginTop: '10px',
                    } }>
                        <a href={this.state.deckAUUID ? `https://www.decksofkeyforge.com/decks/${this.state.deckAUUID}` : ''} target='_blank'>
                            <DeckList src={ this.state.deckImageA }/>
                        </a>
                        <a href={this.state.deckBUUID ? `https://www.decksofkeyforge.com/decks/${this.state.deckBUUID}` : ''} target='_blank'>
                            <DeckList src={ this.state.deckImageB }/>
                        </a>
                    </div>
                </div>
            </Panel>
        );
    }
}

AdaptiveShortDeckSelectPrompt.displayName = 'AdaptiveShortDeckSelectPrompt';

export default withTranslation()(AdaptiveShortDeckSelectPrompt);
