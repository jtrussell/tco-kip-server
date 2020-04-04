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

        const {
            thisPlayer,
            otherPlayer
        } = props;

        const deckA = {
            name: thisPlayer.deckName,
            cards: thisPlayer.deckCards,
            houses: thisPlayer.houses,
            uuid: thisPlayer.deckUuid,
            expansion: thisPlayer.deckSet
        };

        buildDeckList(deckA, 'en', (t) => t, props.cards)
            .then(img => this.setState({ deckImageA: img }));

        const deckB = {
            name: otherPlayer.deckName,
            cards: otherPlayer.deckCards,
            houses: otherPlayer.houses,
            uuid: otherPlayer.deckUuid,
            expansion: otherPlayer.deckSet
        };

        buildDeckList(deckB, 'en', (t) => t, props.cards)
            .then(img => this.setState({ deckImageB: img }));
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
            paddingTop: '20px',
            zIndex: 99,
            margin: 0,
        };

        const DeckList = styled.img`
            height: 500px;
            width: calc(500px * 0.714285714);
            margin: 20px;
        `;

        return (
            <Panel title='' titleClass='phase-indicator' panelBodyClass='player-prompt-body' styles={ styles }>
                { promptTitle }
                <div className='menu-pane' style={ {
                    marginTop: '10px',
                } }>
                    <div >
                        <h4>{ promptTexts }</h4>
                    </div>
                    <div style={ {
                        display: 'flex',
                        justifyContent: 'space-around',
                        marginTop: '10px',
                    } }>
                        <DeckList src={ this.state.deckImageA }/>
                        <DeckList src={ this.state.deckImageB }/>
                    </div>
                    <div style={ {
                        display: 'flex',

                    } }>
                        { this.getButtons() }
                    </div>
                </div>
            </Panel>
        );
    }
}

AdaptiveShortDeckSelectPrompt.displayName = 'AdaptiveShortDeckSelectPrompt';

export default withTranslation()(AdaptiveShortDeckSelectPrompt);
