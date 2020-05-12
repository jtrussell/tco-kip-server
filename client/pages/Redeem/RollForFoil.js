import React, { Fragment } from 'react';
import { toastr } from 'react-redux-toastr';
import DeckList from '../../Components/Decks/DeckList';
import styled from 'styled-components';
import Background from '../../Components/Background';
import { buildDeckList } from '../../archonMaker';
import linkDeckCards from '../Decks/linkDeckCards';
import colors from '../../colors';
import FoilCard from './Card';

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const Panel = styled.div`
    width: 505px;
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
    height: 700px;
    background-color: ${colors.background};
`;

const CouponCount = styled.span`
    background-color: ${colors.darkBlue};
    padding: 2px 9px;
    margin-left: 3px;
`;

class RollForFoil extends React.Component {
    constructor() {
        super();
        this.state = {
            revealStage: 0,
        };
        this.handleSelectDeck = this.handleSelectDeck.bind(this);
        this.handleFoil = this.handleFoil.bind(this);
    }

    componentWillMount() {
        if(this.props.selectedDeck) {
            this.buildImageForDeck(this.props.selectedDeck);
        }
    }

    componentWillReceiveProps(props) {
        if(props.selectedDeck) {
            this.buildImageForDeck(props.selectedDeck);
        }
    }

    handleFoil() {
        if(!this.props.selectedDeck) {
            return;
        }

        const candidates = this.props.selectedDeck.cards.filter(card => {
            return ['creature', 'artifact'].includes(card.card.type) && !card.foil;
        });

        if(candidates.length === 0) {
            toastr.error(`There are no cards you can foil in ${this.props.selectedDeck.name}`);
            return;
        }

        toastr.confirm(`Do you want to add a foil to ${this.props.selectedDeck.name}?`, {
            okText: 'Yes',
            cancelText: 'Cancel',
            onOk: () => {
                const uniqueCardIds = [];
                candidates.forEach(c => {
                    if(!uniqueCardIds.includes(c.id)) {
                        uniqueCardIds.push(c.id);
                    }
                });

                const n = Math.random() * uniqueCardIds.length | 0;
                const cardId = uniqueCardIds[n];

                this.setState({
                    foilCard: this.props.selectedDeck.cards.find(c => c.id === cardId),
                    coverCards: true,
                });

                fetch(`/api/decks/${this.props.selectedDeck.uuid}/foils`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: this.props.user.username,
                        cardId,
                    })
                }).catch(err => console.log(err));

                setTimeout(() => {
                    this.setState({ coverCards: false });
                }, 1000 * 4);

                const incrementI = () => {
                    this.setState({ revealStage: this.state.revealStage + 1 });
                    if(this.state.coverCards) {
                        setTimeout(incrementI, 400);
                    }
                };

                setTimeout(incrementI, 400);
            }
        });
    }

    handleSelectDeck(deck) {
        this.props.selectDeck(deck);
        this.buildImageForDeck(deck);
    }

    buildImageForDeck(deck) {
        if(deck && this.props.cards && Object.keys(this.props.cards).length) {
            if(deck.cards.length < 36) {
                try {
                    linkDeckCards(deck, this.props.cards);
                } catch(e) {
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
        if(!this.state.deckImage) {
            return (
                <Background/>
            );
        }

        let foilsToRedeem = this.props.foils.length < 40 ? (40 - this.props.foils.length) : 0;
        foilsToRedeem += this.props.coupons.length;

        return (
            <Container>
                <Background/>
                <div style={ {
                    display: 'flex',
                    justifyContent: 'center',
                } }>
                    { (this.props.selectedDeck && this.state.foilCard) ? (
                        <div style={ {
                            position: 'relative',
                            textAlign: 'center',
                            width: '100%',
                        } }>
                            { this.state.coverCards && <LoadingCover/> }
                            <div style={ {
                                width: '100%',
                                position: 'absolute',
                                top: 0,
                                fontSize: '22px',
                                color: 'white',
                                zIndex: 3,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            } }>
                                { this.state.coverCards ?
                                    `Finding the perfect foil for ${this.props.selectedDeck.name}${'.'.repeat(this.state.revealStage % 4)}`
                                    :
                                    `Success! ${ this.state.foilCard.card.name } has been foiled in ${this.props.selectedDeck.name}!`
                                }
                            </div>
                            <div style={ {
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                position: this.state.coverCards ? 'absolute' : '',
                                zIndex: 0,
                                top: 0,
                                width: '100%',
                            } }>
                                <FoilCard id={ this.state.foilCard.id } name={ this.state.foilCard.name } cards={ this.props.cards }/>
                                <div style={ { marginTop: '20px' } }>
                                    <button
                                        style={ {
                                            width: '144px',
                                            backgroundSize: '144px 32px',
                                        } }
                                        className='btn btn-default'
                                        onClick={ () => window.location.replace('/redeem') }
                                    >
                                        { 'Another!' }
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Fragment>
                            { (this.props.selectedDeck && this.state.deckImage) &&
                                <div style={ { marginTop: '0px' } }>
                                    <a target='_blank' href={ `https://www.decksofkeyforge.com/decks/${this.state.deckUuid}` }>
                                        <Deck src={ this.state.deckImage }/>
                                    </a>
                                </div>
                            }
                            <Panel>
                                <div style={ {
                                    marginBottom: '20px',
                                    height: '36px',
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                    alignItems: 'center',
                                } }>
                                    <div style={ {
                                        fontSize: '20px',
                                        color: '#FFF',
                                    } }>
                                        { 'You can redeem ' }
                                        <CouponCount>{ `${ foilsToRedeem } foil${ foilsToRedeem === 1 ? '' : 's' }` }</CouponCount>
                                    </div>
                                    <button
                                        style={ {
                                            width: '144px',
                                            backgroundSize: '144px 32px',
                                        } }
                                        className='btn btn-default foil'
                                        onClick={ this.handleFoil }
                                    >
                                        { 'Add Foil' }
                                    </button>
                                </div>
                                <DeckList
                                    hideControls
                                    showAll
                                    hideHouses
                                    hideSet
                                    hideChains
                                    disableStarring
                                    className='deck-list'
                                    activeDeck={ this.props.selectedDeck }
                                    decks={ this.props.decks }
                                    onSelectDeck={ this.handleSelectDeck }
                                />
                            </Panel>
                        </Fragment>
                    ) }
                </div>
            </Container>
        );
    }
}

export default RollForFoil;
