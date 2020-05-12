import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import DeckList from '../../Components/Decks/DeckList';
import * as actions from '../../actions';
import styled from 'styled-components';
import Background from '../../Components/Background';
import { withTranslation, Trans } from 'react-i18next';
import { buildDeckList } from '../../archonMaker';
import linkDeckCards from '../Decks/linkDeckCards';
import colors from '../../colors';
import RollForFoil from './RollForFoil';

const Container = styled.div`
    max-width: 900px;
    margin: 70px auto;
    display: flex;
    flex-direction: column;
`
const Panel = styled.div`
    width: 505px;
    margin-top: 55px;
`;

const Deck = styled.img`
    height: 600px;
    margin: 0 20px 20px 20px;
`;

const LoadingCover = styled.div`
    z-index: 1;
    position: relative;
    top: 0;
    left: 0;
    margin: 0 auto;
    width: 680px;
    height: 550px;
    background-color: ${colors.background};
`;

class Foils extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        let checkCount = 0;
        const checkForCards = () => {
            checkCount += 1;
            if (checkCount > 10) {
                return;
            }

            if (this.props.cards) {
                this.props.loadDecks();
            } else {
                setTimeout(checkForCards, 100 * (checkCount + 1));
            }
        }

        if (!this.props.decks || !this.props.decks.length) {
            checkForCards();
        }
    }

    componentWillReceiveProps(props) {
        if (props.user && !this._hasFetchedFoils) {
            this._hasFetchedFoils = true;
            Promise.all([
                fetch(`/api/users/${props.user.username}/foils`).then(response => response.json()),
                fetch(`/api/users/${props.user.username}/coupons`).then(response => response.json())
            ])
            .then(response => {
                this.setState({
                    foils: response[0].foils,
                    coupons: response[1].coupons,
                });
            });
        }
    }

    render() {
        if(this.props.apiLoading || this.state.foils === undefined || !this.props.cards || !Object.keys(this.props.cards)) {
            return (
                <Container>
                    <Background/>
                    <div style={{ margin: '20px auto' }}>
                        Loading
                    </div>
                </Container>
            );
        }

        if(this.state.foils.length >= 40 && !this.state.coupons.length) {
            return (
                <Container>
                    <Background/>
                    <div style={{ margin: '20px auto' }}>
                        You have no foils to redeem
                    </div>
                </Container>
            );
        }

        return (
            <Container>
                <RollForFoil
                    coupons={this.state.coupons}
                    foils={this.state.foils}
                    selectedDeck={this.props.selectedDeck}
                    selectDeck={this.props.selectDeck}
                    user={this.props.user}
                    cards={this.props.cards}
                    navigate={this.props.navigate}
                    decks={this.props.decks}
                />
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.account.user,
        apiLoading: state.api.REQUEST_DECKS ? state.api.REQUEST_DECKS.loading : undefined,
        cards: state.cards.cards,
        decks: state.cards.decks,
        selectedDeck: state.cards.selectedDeck
    };
}

export default withTranslation()(connect(mapStateToProps, actions)(Foils));
