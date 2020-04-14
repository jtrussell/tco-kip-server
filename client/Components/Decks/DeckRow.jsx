import React from 'react';
import PropTypes from 'prop-types';
import DeckChains from '../DeckChains';
import colors from '../../colors';

import { withTranslation } from 'react-i18next';
import styled from 'styled-components';

const Container = styled.div`
    height: 60px;
    display: flex;
    justify-content: space-between;
    paddig: 2px 4px;
    background-color: ${(props) => props.active ? '' : colors.background2};
    border-color: ${colors.background};
    cursor: pointer;
    user-select: none;

    &:hover {
        background-color: ${(props) => props.active ? '' : colors.background3};
        border-color: ${colors.background};
    }
`;

class DeckRow extends React.Component {
    constructor(props) {
        super(props);
        this.handleDeckClick = this.handleDeckClick.bind(this);
    }

    handleDeckClick() {
        if(this.props.onSelect) {
            this.props.onSelect(this.props.deck);
        }
    }

    render() {
        let language = this.props.i18n.language;

        const expansionMap = {
            341: 'CotA',
            435: 'AoA',
            452: 'WC',
        };

        return (
            <Container 
                className={ this.props.active ? 'deck-row active' : 'deck-row' }
                key={ this.props.deck.name }
                onClick={ this.handleDeckClick }
                onDoubleClick={ () => this.props.onToggleStar(this.props.deck.uuid) }
                active={ this.props.active } 
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        fontSize: '18px',
                        color: colors.text,
                        width: '85%',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                    }}
                >
                    <div>
                        { this.props.starred && (
                            <span style={{ color: '#f0ad4e' }}>★ </span>
                        )}
                        { this.props.deck.name }
                    </div>
                    <div style={{ display: 'inline-block', transform: 'scale(0.8)', transformOrigin: 'bottom left', marginLeft: this.props.starred ? '20px' : '' }}>
                        {this.props.deck.chains > 0 && <DeckChains chains={ this.props.deck.chains } /> }
                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    color: 'rgb(255, 255, 255)',
                }}>
                    {expansionMap[this.props.deck.expansion]}
                    <div>
                        <img style={{ width: '23px' }} src={ '/img/house/' + this.props.deck.houses[0] + '.png' } />
                        <img style={{ width: '23px' }} src={ '/img/house/' + this.props.deck.houses[1] + '.png' } />
                        <img style={{ width: '23px' }} src={ '/img/house/' + this.props.deck.houses[2] + '.png' } />
                    </div>
                </div>
            </Container>);
    }
}

DeckRow.displayName = 'DeckRow';
DeckRow.propTypes = {
    active: PropTypes.bool,
    deck: PropTypes.object.isRequired,
    i18n: PropTypes.object,
    onSelect: PropTypes.func,
    t: PropTypes.func
};

export default withTranslation()(DeckRow);
