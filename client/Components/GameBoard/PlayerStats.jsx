import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '../Site/Avatar';

import { withTranslation, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';

export class PlayerStats extends React.Component {
    constructor() {
        super();

        this.sendUpdate = this.sendUpdate.bind(this);
        this.setActiveHouse = this.setActiveHouse.bind(this);
    }

    sendUpdate(type, direction) {
        this.props.sendGameMessage('changeStat', type, direction === 'up' ? 1 : -1);
    }

    setActiveHouse(house) {
        if(this.props.showControls) {
            this.props.sendGameMessage('changeActiveHouse', house);
        }
    }

    getStatValueOrDefault(stat) {
        if(!this.props.stats) {
            return 0;
        }

        return this.props.stats[stat] || 0;
    }

    getButton(stat, name, statToSet = stat) {
        return (
            <div className='state' title={ name }>
                { this.props.showControls ? <button className='btn btn-stat' onClick={ this.sendUpdate.bind(this, statToSet, 'down') }>
                    <img src='/img/Minus.png' title='-' alt='-' />
                </button> : null }
                <div className={ `stat-image ${stat}` }>
                    <div className='stat-value'>{ this.getStatValueOrDefault(stat) }</div>
                </div>
                { this.props.showControls ? <button className='btn btn-stat' onClick={ this.sendUpdate.bind(this, statToSet, 'up') }>
                    <img src='/img/Plus.png' title='+' alt='+' />
                </button> : null }
            </div>
        );
    }

    onSettingsClick(event) {
        event.preventDefault();

        if(this.props.onSettingsClick) {
            this.props.onSettingsClick();
        }
    }

    getHouses() {
        return (
            <div className='state'>
                { this.props.houses.map(house => (<img key={ house } onClick={ this.setActiveHouse.bind(this, house) } className='img-responsive' src={ `/img/house/${house}.png` } title={ this.props.t(house) } />)) }
            </div>
        );
    }

    writeChatToClipboard(event) {
        event.preventDefault();
        let messagePanel = document.getElementsByClassName('messages panel')[0];
        if(messagePanel) {
            navigator.clipboard.writeText(messagePanel.innerText)
                .then(() => toastr.success('Copied game chat to clipboard'))
                .catch((err) => toastr.error(`Could not copy game chat: ${err}`));
        }
    }

    render() {
        let t = this.props.t;
        let playerAvatar = (
            <div className='player-avatar'>
                <Avatar user={ this.props.user } />
                <b>{ this.props.user ? this.props.user.username : t('Noone') }</b>
            </div>);
        let playerDeck = (
            <div style={{ margin: '0 5px 3px 0'}}>
                <a
                    style={{ textDecoration: 'underline !important' }}
                    href={`https://decksofkeyforge.com/decks/${this.props.deckUuid}`}
                    target='_blank'
                >
                    Deck
                </a>
            </div>
        );
        let muteClass = this.props.muteSpectators ? 'glyphicon-eye-close' : 'glyphicon-eye-open';

        return (
            <div className='panel player-stats'>
                { playerAvatar }
                { playerDeck }

                { this.props.houses ? this.getHouses() : null }

                { this.getButton('amber', 'Amber') }
                { this.getButton('keyCost', 'Current Key Cost') }
                { this.props.showMessages &&
                    <div className='state chat-status'>
                    </div>
                }
            </div>
        );
    }
}

PlayerStats.displayName = 'PlayerStats';
PlayerStats.propTypes = {
    activeHouse: PropTypes.string,
    activePlayer: PropTypes.bool,
    houses: PropTypes.array,
    i18n: PropTypes.object,
    manualModeEnabled: PropTypes.bool,
    muteSpectators: PropTypes.bool,
    numMessages: PropTypes.number,
    onManualModeClick: PropTypes.func,
    onMessagesClick: PropTypes.func,
    onMuteClick: PropTypes.func,
    onSettingsClick: PropTypes.func,
    playerName: PropTypes.string,
    sendGameMessage: PropTypes.func,
    showControls: PropTypes.bool,
    showManualMode: PropTypes.bool,
    showMessages: PropTypes.bool,
    stats: PropTypes.object,
    t: PropTypes.func,
    user: PropTypes.object
};

export default withTranslation()(PlayerStats);
