import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AlertPanel from '../../Components/Site/AlertPanel';
import Link from '../../Components/Site/Link';
import DeckList from '../../Components/Decks/DeckList';
import ViewDeck from '../../Components/Decks/ViewDeck';
import * as actions from '../../actions';
import styled from 'styled-components';
import ConfirmedButton from '../../Components/Form/ConfirmedButton';
import Background from '../../Components/Background';
import Input from '../../Components/Form/Input';

import { withTranslation, Trans } from 'react-i18next';
import { buildDeckList } from '../../archonMaker';
import linkDeckCards from './linkDeckCards'; 

const Container = styled.div`
    max-width: 1000px;
    margin: 60px auto;
    display: flex;
    flex-direction: column;
`

const Deck = styled.img`
    height: 600px;
    margin: 0 20px 20px 20px;
`;

const Panel = styled.div`
  width: 600px;
  margin-top: 55px;
`;

class Decks extends React.Component {
    constructor() {
        super();
        this.state = {
            importError: '',
            deckString: '',
        };

        this.handleDeleteDeck = this.handleDeleteDeck.bind(this);
        this.handleSelectDeck = this.handleSelectDeck.bind(this);
        this.handleImportDeck = this.handleImportDeck.bind(this);
        this.onDeckStringChange = this.onDeckStringChange.bind(this);
    }

    handleImportDeck() {
        this.setState({
            importError: '',
            deckString: '',
        });

        const regex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
        let uuid = this.state.deckString.match(regex);

        if(uuid && uuid[0] !== '00000000-0000-0000-0000-000000000000') {
            const duplicate = this.props.decks.find(deck => {
                return deck.uuid === uuid[0];
            });
            if (duplicate) {
                setTimeout(() => {
                    this.setState({ importError: '' });
                }, 5000);
                this.setState({
                    importError: `${duplicate.name} has already been imported`
                });
                return;
            }

            this.props.saveDeck({ uuid: uuid[0] });
        } else {
            setTimeout(() => {
                this.setState({ importError: '' });
            }, 5000);
            this.setState({
                importError: 'The URL you entered is invalid.  Please check it and try again.' 
            });
        }
    }

    onDeckStringChange(event) {
        this.setState({ deckString: event.target.value });
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

    handleDeleteDeck() {
        this.props.deleteDeck(this.props.selectedDeck);

        const remainingDecks = this.props.decks.filter(d => d.uuid !== this.props.selectedDeck.uuid);
        if (remainingDecks.length) {
            this.handleSelectDeck(remainingDecks[0]);
        }
    }

    handleSelectDeck(deck) {
        this.props.selectDeck(deck);
        this.buildImageForDeck(deck);
    }

    buildImageForDeck(deck) {
        if (deck) {
            buildDeckList(deck, 'en', (t) => t, this.props.cards)
                .then(img => this.setState({
                    deckImage: img,
                    deckUuid: deck.uuid
                }));
        }
    }

    render() {
        let t = this.props.t;

        if(this.props.apiLoading) {
            return (
                <Container>
                    <Background/>
                    Loading... refresh if nothing appears.
                </Container>
            );
        }

        return (
            <Container>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <Background/>
                    { this.state.importError && (
                        <div style={{
                            position: 'fixed',
                            right: '30px',
                            bottom: '10px',
                        }}>
                            <AlertPanel type='error' message={ t(this.state.importError) } /> 
                        </div>
                    )}
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                <Panel>
                    <div style={{ marginBottom: '20px', height: '36px' }}>
                        <Input
                            autoComplete='off'
                            name='importUrl'
                            placeholder={ 'DoK Link' }
                            type='text'
                            onChange={ this.onDeckStringChange }
                            value={ this.state.deckString }
                            fieldClass='col-xs-8'
                        >
                            <div className='col-xs-1'>
                                <button
                                    className='btn btn-default'
                                    onClick={ this.handleImportDeck }
                                >
                                   { 'Import Deck' } { this.props.apiLoading && <span className='spinner button-spinner' /> }
                               </button>
                            </div>
                        </Input>
                    </div>
                    <DeckList className='deck-list' activeDeck={ this.props.selectedDeck } decks={ this.props.decks } onSelectDeck={ this.handleSelectDeck } />
                </Panel>
                <div>
                    <div style={{
                        height: '32px',
                        margin: '10px 5px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                    }}>
                        { this.props.selectedDeck &&
                            <ConfirmedButton onClick={ this.handleDeleteDeck }><Trans>Delete</Trans></ConfirmedButton>
                        }
                    </div>
                        { (this.props.selectedDeck && this.state.deckImage) &&
                            <a target='_blank' href={`https://www.decksofkeyforge.com/decks/${this.state.deckUuid}`}>
                                <Deck src={ this.state.deckImage }/>
                            </a>
                        }
                </div>
                </div>
            </Container>
        );
    }
}

Decks.displayName = 'Decks';
Decks.propTypes = {
    apiLoading: PropTypes.bool,
    apiMessage: PropTypes.string,
    apiSuccess: PropTypes.bool,
    cards: PropTypes.object,
    clearDeckStatus: PropTypes.func,
    deckDeleted: PropTypes.bool,
    decks: PropTypes.array,
    deleteDeck: PropTypes.func,
    i18n: PropTypes.object,
    loadDecks: PropTypes.func,
    navigate: PropTypes.func,
    selectedDeck: PropTypes.object,
    t: PropTypes.func
};

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        apiLoading: state.api.REQUEST_DECKS ? state.api.REQUEST_DECKS.loading : undefined,
        apiMessage: state.api.REQUEST_DECKS ? state.api.REQUEST_DECKS.message : undefined,
        apiSuccess: state.api.REQUEST_DECKS ? state.api.REQUEST_DECKS.success : undefined,
        deleteSuccess: state.api.DELETE_DECK ? state.api.DELETE_DECK.success : undefined,
        importSuccess: state.api.SAVE_DECK ? state.api.SAVE_DECK.success : undefined,
        cards: state.cards.cards,
        decks: state.cards.decks,
        deckDeleted: state.cards.deckDeleted,
        selectedDeck: state.cards.selectedDeck
    };
}

export default withTranslation()(connect(mapStateToProps, actions)(Decks));
