import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import AlertPanel from '../../Components/Site/AlertPanel';
import Link from '../../Components/Site/Link';
import DeckList from '../../Components/Decks/DeckList';
import ViewDeck from '../../Components/Decks/ViewDeck';
import * as actions from '../../actions';
import styled from 'styled-components';
import ConfirmedButton from '../../Components/Form/ConfirmedButton';
import Background from '../../Components/Background';
import Input from '../../Components/Form/Input';
import Card from '../../Components/GameBoard/Card';
import getCardImageURL from '../../getCardImageURL';
import { withTranslation, Trans } from 'react-i18next';
import { buildDeckList } from '../../archonMaker';
import linkDeckCards from './linkDeckCards'; 

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
            //foilCardA: {
				//id: 'hunting-witch',
				//name: 'Hunting Witch',
			//},
            //foilCardB: {
				//id: 'hunting-witch',
				//name: 'Hunting Witch',
			//}
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
    }

    handleFoil() {
        if (!this.props.selectedDeck) {
            return;
        }

        toastr.confirm(`Proceed with "${this.props.selectedDeck.name}"?`, {
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
				console.log('picked', pickA);

				const remainingUniqueCards = uniqueCardIds.filter(id => id !== pickA);
				const n2 = Math.random() * remainingUniqueCards.length | 0;
				const pickB = remainingUniqueCards[n2];
				console.log('picked', pickB);

				this.setState({
					foilCardA: this.props.selectedDeck.cards.find(c => c.id === pickA),
					foilCardB: this.props.selectedDeck.cards.find(c => c.id === pickB),
				});
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

        return (
            <Container>
				<Background/>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}>
					{(this.props.selectedDeck && this.state.foilCardA) ? ( 
						<div style={{
							display: 'flex',
							justifyContent: 'center',
						}}>
							<FoilCard id={this.state.foilCardA.id} name={this.state.foilCardA.name} cards={this.props.cards}/>
							<FoilCard id={this.state.foilCardB.id} name={this.state.foilCardB.name} cards={this.props.cards}/>
						</div>
					) : (
						<Fragment>
							<Panel>
								<div style={{ marginBottom: '20px', height: '36px', display: 'flex', justifyContent: 'center' }}>
									<button
										style={{
											width: '144px',
											backgroundSize: '144px 32px',
										}}
										className='btn btn-default'
										onClick={ this.handleFoil }
									>
									   { 'Add Random Foils' } { this.props.apiLoading && <span className='spinner button-spinner' /> }
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
        apiLoading: state.api.REQUEST_DECKS ? state.api.REQUEST_DECKS.loading : undefined,
        cards: state.cards.cards,
        decks: state.cards.decks,
        selectedDeck: state.cards.selectedDeck
    };
}

export default withTranslation()(connect(mapStateToProps, actions)(Foils));
