import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CardPile from './CardPile';
import SquishableCardPanel from './SquishableCardPanel';
import DrawDeck from './DrawDeck';
import IdentityCard from './IdentityCard';
import Droppable from './Droppable';

import { withTranslation } from 'react-i18next';
import { buildArchon, buildDeckList } from '../../archonMaker';
import * as Images from '../../assets/img';
import * as actions from '../../ReduxActions/misc';

class PlayerRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = { deckListUrl: Images.cardback };
        this.sendUpdate = this.sendUpdate.bind(this);
    }

    sendUpdate(type, direction) {
        this.props.sendGameMessage('changeStat', type, direction === 'up' ? 1 : -1);
    }

    getStatValueOrDefault(stat) {
        if(!this.props.stats) {
            return 0;
        }

        return this.props.stats[stat] || 0;
    }

    getButton(stat, name, statToSet = stat) {
        return (
            <div className='state chains' style={{
                marginTop: this.props.player === 1 ? 0 : '35px'
            }}>
                { (this.props.player === 1 && this.props.manualMode) ? <button className='btn btn-stat' onClick={ this.sendUpdate.bind(this, statToSet, 'down') }>
                    <img src='/img/Minus.png' title='-' alt='-' />
                </button> : null }
                <div className={ `stat-image ${stat}` } style={{ width: '40px', height: '40px', backgroundSize: '40px 40px' }}>
                    <div className='stat-value' style={{ fontSize: '16px', color: '#FFF' }}>{ this.getStatValueOrDefault(stat) }</div>
                </div>
                { (this.props.player === 1 && this.props.manualMode) ? <button className='btn btn-stat' onClick={ this.sendUpdate.bind(this, statToSet, 'up') }>
                    <img src='/img/Plus.png' title='+' alt='+' />
                </button> : null }
            </div>
        );
    }

    componentDidMount() {
        const deck = {
            name: this.props.deckName,
            cards: this.props.deckCards,
            houses: this.props.houses,
            uuid: this.props.deckUuid,
            expansion: this.props.deckSet
        };
        buildArchon(deck, this.props.language)
            .then(cardBackUrl => {
                if(this.props.player === 1) {
                    this.props.setPlayer1CardBack(cardBackUrl);
                } else {
                    this.props.setPlayer2CardBack(cardBackUrl);
                }
            });
        buildDeckList(deck, this.props.language, this.props.t, this.props.cards)
            .then(deckListUrl => {
                this.setState({ deckListUrl });
            });
    }

    componentDidUpdate(prevProps) {
        const deck = {
            name: this.props.deckName,
            cards: this.props.deckCards,
            houses: this.props.houses,
            uuid: this.props.deckUuid,
            expansion: this.props.deckSet
        };

        if(this.props.language) {
            if(this.props.language !== prevProps.language || this.props.deckName !== prevProps.deckName) {
                buildDeckList(deck, this.props.language, this.props.t, this.props.cards).then(deckListUrl => this.setState({ deckListUrl }));
            }
        }
    }

    renderDroppablePile(source, child) {
        return this.props.isMe ? <Droppable onDragDrop={ this.props.onDragDrop } source={ source } manualMode={ this.props.manualMode }>{ child }</Droppable> : <div className="drop-target">{ child }</div>;
    }

    renderKeys() {
        let t = this.props.t;

        let keys = ['red', 'blue', 'yellow']
            .sort(color => this.props.keys[color] ? -1 : 1)
            .map(color => {
                return <img style={{ width: this.props.side === 'top' ? '42px' : '60px' }} key={ `key ${color}` } src={ `/img/${this.props.keys[color] ? 'forgedkey' : 'unforgedkey'}${color}.png` } title={ t('Forged Key') } />;
            });

        return <div className={ `keys ${this.props.side === 'top' ? 'large' : 'x-large'}` }>{ keys }</div>;
    }

    render() {
        let t = this.props.t;

        let cardPileProps = {
            manualMode: this.props.manualMode,
            onCardClick: this.props.onCardClick,
            onDragDrop: this.props.onDragDrop,
            onMouseOut: this.props.onMouseOut,
            onMouseOver: this.props.onMouseOver,
            popupLocation: this.props.side,
            size: 'large'
        };

        let sortedHand = this.props.hand.sort((a, b) => {
            if(a.printedHouse < b.printedHouse) {
                return -1;
            } else if(a.printedHouse > b.printedHouse) {
                return 1;
            }

            return 0;
        });

        let handSize = this.props.cardSize === 'x-large' || this.props.cardSize === 'large' ? 'x-large' : 'large';
        if (this.props.side === 'top') {
            handSize = 'large';
        }

        let hand = (<SquishableCardPanel
            cards={ sortedHand }
            className='panel hand'
            groupVisibleCards
            cardBackUrl={ this.props.cardBackUrl }
            username={ this.props.username }
            manualMode={ this.props.manualMode }
            maxCards={ 5 }
            onCardClick={ this.props.onCardClick }
            onMouseOut={ this.props.onMouseOut }
            onMouseOver={ this.props.onMouseOver }
            source='hand'
            title={ t('Hand') }
            cardSize={ handSize } />);

        let drawDeck = (<DrawDeck
            cardCount={ this.props.numDeckCards }
            cards={ this.props.drawDeck }
            isMe={ this.props.isMe }
            manualMode={ this.props.manualMode }
            numDeckCards={ this.props.numDeckCards }
            onPopupChange={ this.props.onDrawPopupChange }
            onShuffleClick={ this.props.onShuffleClick }
            showDeck={ this.props.showDeck }
            spectating={ this.props.spectating }
            cardBackUrl={ this.props.cardBackUrl }
            { ...cardPileProps } />);

        let hasArchivedCards = !!this.props.archives && (this.props.archives.length > 0);

        let archives = (<CardPile className='archives' title={ t('Archives') } source='archives' cards={ this.props.archives }
            hiddenTopCard={ hasArchivedCards && !this.props.isMe } cardBackUrl={ this.props.cardBackUrl }
            { ...cardPileProps } />);

        let discard = (<CardPile className='discard' title={ t('Discard') } source='discard' cards={ this.props.discard }
            { ...cardPileProps } />);

        let purged = (<CardPile className='purged' title={ t('Purged') } source='purged' cards={ this.props.purgedPile }
            { ...cardPileProps } />);

        let identity = <IdentityCard className='identity' deckListUrl={ this.state.deckListUrl } size={ 'large' } onMouseOut={ this.props.onMouseOut } onMouseOver={ this.props.onMouseOver }/>;

        return (
            <div className='player-home-row-container'>
                { this.renderKeys() }
                { this.renderDroppablePile('hand', hand) }
                { this.renderDroppablePile('archives', archives) }
                { identity }
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ zIndex: 120 }}>
                        { this.renderDroppablePile('deck', drawDeck) }
                    </div>
                    { (this.props.manualMode || this.getStatValueOrDefault('chains') > 0) && (
                        <div style={{
                            zIndex: 121,
                            position: 'absolute',
                            top: '30%',
                            pointerEvents: this.props.manualMode ? '' : 'none',
                        }}>
                            { this.getButton('chains', 'Chains') }
                        </div>
                    )}
                </div>
                { this.renderDroppablePile('discard', discard) }
                { ((this.props.purgedPile.length > 0) || this.props.manualMode) ? this.renderDroppablePile('purged', purged) : null }
            </div>
        );
    }
}

PlayerRow.displayName = 'PlayerRow';
PlayerRow.propTypes = {
    archives: PropTypes.array,
    cardBackUrl: PropTypes.string,
    cardSize: PropTypes.string,
    cards: PropTypes.object,
    conclavePile: PropTypes.array,
    deckCards: PropTypes.array,
    deckName: PropTypes.string,
    deckSet: PropTypes.number,
    deckUuid: PropTypes.string,
    discard: PropTypes.array,
    drawDeck: PropTypes.array,
    faction: PropTypes.object,
    hand: PropTypes.array,
    houses: PropTypes.array,
    i18n: PropTypes.object,
    isMe: PropTypes.bool,
    isMelee: PropTypes.bool,
    keys: PropTypes.object,
    language: PropTypes.string,
    manualMode: PropTypes.bool,
    numDeckCards: PropTypes.number,
    onCardClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onDrawPopupChange: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    onShuffleClick: PropTypes.func,
    player: PropTypes.number,
    power: PropTypes.number,
    purgedPile: PropTypes.array,
    setPlayer1CardBack: PropTypes.func,
    setPlayer2CardBack: PropTypes.func,
    showDeck: PropTypes.bool,
    side: PropTypes.oneOf(['top', 'bottom']),
    spectating: PropTypes.bool,
    t: PropTypes.func,
    title: PropTypes.object,
    username: PropTypes.string
};

function mapStateToProps(state) {
    return {
        cards: state.cards.cards
    };
}

function mapDispatchToProps(dispatch) {
    let boundActions = bindActionCreators(actions, dispatch);
    boundActions.dispatch = dispatch;
    return boundActions;
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(PlayerRow));
