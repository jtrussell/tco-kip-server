import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import Link from '../../Components/Link';
import DeckList from '../../Components/Decks/DeckList';
import * as actions from '../../actions';
import styled from 'styled-components';
import Background from '../../Components/Background';
import Card from '../../Components/GameBoard/Card';
import getCardImageURL from '../../getCardImageURL';
import { withTranslation, Trans } from 'react-i18next';
import { buildDeckList } from '../../archonMaker';
import linkDeckCards from './linkDeckCards';
import colors from '../../colors';

const Container = styled.div`
    max-width: 1000px;
    margin: 60px auto;
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

const FoilContainer = styled.div`
    margin: 0 20px 20px 20px;
    margin-top: 80px;
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

const FoilCard = ({ name, id, cards }) => {
    const imageUrl = getCardImageURL(name);
    const card = Object.assign({
        upgrades: [],
        facedown: false,
        foil: true,
    }, cards[id]);
    return (
        <FoilContainer>
            <Card
                cardBackUrl = { imageUrl }
                canDrag={ false }
                card={ card }
                disableMouseOver={ true }
                onClick={ () => {}}
                onMenuItemClick={ () => {}}
                onMouseOut={ () => {}}
                onMouseOver={ () => {}}
                size='giant'
                source='play area'
            />
        </FoilContainer>
    );
}

class Foils extends React.Component {
    constructor() {
        super();
        this.state = {
            i: 0, // lazy but pragmatic
        };
        this.handleSelectDeck = this.handleSelectDeck.bind(this);
        this.handleFoil = this.handleFoil.bind(this);
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

        if (this.props.selectedDeck) {
            this.buildImageForDeck(this.props.selectedDeck);
        }
    }

    componentWillReceiveProps(props) {
        if (props.selectedDeck) {
            this.buildImageForDeck(props.selectedDeck);
        }

        if (props.user && !this._hasFetchedFoils) {
            this._hasFetchedFoils = true;
            fetch(`/api/users/${props.user.username}/foils`)
                .then(response => response.json())
                .then(({ foils }) => {
                    if (foils.length) {
                        this.setState({
                            ownedFoils: foils,
                        });
                    }
                });
        }
    }

    handleFoil() {
        if (!this.props.selectedDeck) {
            return;
        }

        toastr.confirm(`Do you want to use ${this.props.selectedDeck.name}?`, {
            okText: 'Yes',
            cancelText: 'Cancel',
            onOk: () => {
                let candidates = this.props.selectedDeck.cards.filter(card => {
                    return ['creature', 'artifact'].includes(card.card.type);
                });

                const uniqueCardIds = [];
                candidates.forEach(c => {
                    if (!uniqueCardIds.includes(c.id)) {
                        uniqueCardIds.push(c.id);
                    }
                });

                const n = Math.random() * uniqueCardIds.length | 0;
                const pickA = uniqueCardIds[n];

                const remainingUniqueCards = uniqueCardIds.filter(id => id !== pickA);
                const n2 = Math.random() * remainingUniqueCards.length | 0;
                const pickB = remainingUniqueCards[n2];

                this.setState({
                    foilCardA: this.props.selectedDeck.cards.find(c => c.id === pickA),
                    foilCardB: this.props.selectedDeck.cards.find(c => c.id === pickB),
                    coverCards: true,
                });

                fetch(`/api/decks/${this.props.selectedDeck.uuid}/foils`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        playerName: this.props.user.username,
                        cards: [{
                            cardId: pickA,
                        }, {
                            cardId: pickB,
                        }]
                    })
                })
                .catch(err => console.log(err));

                setTimeout(() => {
                    this.setState({ coverCards: false });
                }, 1000 * 4);

                const incrementI = () => {
                    this.setState({ i: this.state.i + 1 });
                    if (this.state.coverCards) {
                        setTimeout(incrementI, 400);
                    }
                }

                setTimeout(incrementI, 400);
            }
        });
    }

    handleSelectDeck(deck) {
        this.props.selectDeck(deck);
        this.buildImageForDeck(deck);
    }

    buildImageForDeck(deck) {
        if (deck && this.props.cards && Object.keys(this.props.cards).length) {
            if (deck.cards.length < 36) {
                try {
                    linkDeckCards(deck, this.props.cards);
                } catch (e) {
                    console.log(e);
                }
            }
            buildDeckList(deck, 'en', (t) => t, this.props.cards)
                .then(img => this.setState({
                    deckImage: img,
                    deckUuid: deck.uuid
                }));
        }
    }

    render() {
        if(this.props.apiLoading) {
            return (
                <Container>
                    <Background/>
                </Container>
            );
        }

        if(this.state.ownedFoils) {
            return (
                <Container>
                    <Background/>
                    <div style={{
                        margin: '20px auto',
                        fontSize: '20px',
                        color: '#FFF',
                    }}>
                        You already have foil cards in <Link text='this deck' url={`https://www.decksofkeyforge.com/decks/${this.state.ownedFoils[0].deck_uuid }`}/>
                    </div>
                </Container>
            );
        }

        return (
            <Container>
                <Background/>
                <div style={{
                    margin: '20px auto',
                    fontSize: '20px',
                    color: '#FFF',
                    display: this.state.foilCardA ? 'none' : '',
                }}>
                    Pick a deck and we'll foil two cards at random! You can do this once.
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                    {(this.props.selectedDeck && this.state.foilCardA) ? (
                        <div style={{
                            position: 'relative',
                        }}>
                            { this.state.coverCards && <LoadingCover/> }
                            <div style={{
                                position: 'absolute',
                                top: '15px',
                                left: '20px',
                                fontSize: '22px',
                                color: 'white',
                                zIndex: 3,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}>
                                { this.state.coverCards ?
                                    `Finding the perfect foils for ${this.props.selectedDeck.name}${'.'.repeat(this.state.i % 4)}`
                                 :
                                    `Success! These have been added to ${this.props.selectedDeck.name}!`
                                }
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                position: this.state.coverCards ? 'absolute' : '',
                                zIndex: 0,
                                top: 0,
                            }}>
                                <FoilCard id={this.state.foilCardA.id} name={this.state.foilCardA.name} cards={this.props.cards}/>
                                <FoilCard id={this.state.foilCardB.id} name={this.state.foilCardB.name} cards={this.props.cards}/>
                            </div>
                        </div>
                    ) : (
                        <Fragment>
                            <Panel>
                                <div style={{ marginBottom: '20px', height: '36px', display: 'flex', justifyContent: 'space-around' }}>
                                    <button
                                        style={{
                                            width: '144px',
                                            backgroundSize: '144px 32px',
                                        }}
                                        className='btn btn-default'
                                        onClick={ this.handleFoil }
                                    >
                                       { 'Add Foils' } { this.props.apiLoading && <span className='spinner button-spinner' /> }
                                    </button>
                                    <button
                                        style={{
                                            width: '144px',
                                            backgroundSize: '144px 32px',
                                        }}
                                        className='btn btn-primary'
                                        onClick={ () => this.props.navigate('/faq-foils') }
                                    >
                                       { 'FAQ' } { this.props.apiLoading && <span className='spinner button-spinner' /> }
                                   </button>
                                </div>
                                <DeckList
                                    hideControls={true}
                                    showAll={true}
                                    disableStarring={true}
                                    className='deck-list'
                                    activeDeck={ this.props.selectedDeck }
                                    decks={ this.props.decks }
                                    onSelectDeck={ this.handleSelectDeck }
                                />
                            </Panel>
                            { (this.props.selectedDeck && this.state.deckImage) &&
                                <div style={{ marginTop: '60px' }}>
                                    <a target='_blank' href={`https://www.decksofkeyforge.com/decks/${this.state.deckUuid}`}>
                                        <Deck src={ this.state.deckImage }/>
                                    </a>
                                </div>
                            }
                        </Fragment>
                    )}
                </div>
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
