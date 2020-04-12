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
            decks: [],
            cards: {},
            selectedDeck: null,
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
            const duplicate = this.state.decks.find(deck => {
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

    UNSAFE_componentWillReceiveProps(props) {
        this.waitToLoadDecks(props);
    }

    componentDidMount() {
        this.waitToLoadDecks(this.props);
    }

    waitToLoadDecks(props) {
        if (props.tReady && !this._hasLoadedDecks) {
            this.loadDecks();
            this._hasLoadedDecks = true;
        }
    }

    loadDecks() {
        Promise.all([
            fetch('/api/decks', {
               headers: {
                   'Authorization': `Bearer ${this.props.token}`
               },
            })
            .then(res => res.json())
        ,
            fetch('/api/cards', {
               headers: {
                   'Authorization': `Bearer ${this.props.token}`
               },
            })
            .then(res => res.json())
        ]).then(data => {
            const decks = data[0].decks;
            const cards = data[1].cards;
            const linkedDecks = linkDeckCards(decks, cards);

            this.setState({
                cards,
                decks: linkedDecks,
            });

            if (!this.state.selectedDeck && linkedDecks.length) {
                this.handleSelectDeck(linkedDecks[0]);
            }
        });
    }

    componentWillReceiveProps(props) {
        if (!this.props) {
            return;
        }

        const shouldRefresh = (
            (props.deleteSuccess && !this.props.deleteSuccess) ||
            (props.importSuccess && !this.props.importSuccess)
        );

        if (shouldRefresh) {
            this.loadDecks();
        }
    }

    handleDeleteDeck() {
        this.props.deleteDeck(this.state.selectedDeck);

        const remainingDecks = this.state.decks.filter(d => d.uuid !== this.state.selectedDeck.uuid);
        if (remainingDecks.length) {
            this.handleSelectDeck(remainingDecks[0]);
        }
    }

    handleSelectDeck(deck) {
        this.setState({
            selectedDeck: deck,
        });

        if (this.state.decks.length && Object.keys(this.state.cards).length && deck) {
            buildDeckList(deck, 'en', (t) => t, this.state.cards)
                .then(img => this.setState({
                    deckImage: img,
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
                    <DeckList className='deck-list' activeDeck={ this.state.selectedDeck } decks={ this.state.decks } onSelectDeck={ this.handleSelectDeck } />
                </Panel>
                <div>
                    <div style={{
                        height: '32px',
                        margin: '10px 5px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                    }}>
                        { this.state.selectedDeck &&
                            <ConfirmedButton onClick={ this.handleDeleteDeck }><Trans>Delete</Trans></ConfirmedButton>
                        }
                    </div>
                    { (this.state.selectedDeck && this.state.deckImage) &&
                        <Deck src={ this.state.deckImage }/>
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
    loading: PropTypes.bool,
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
        deckDeleted: state.cards.deckDeleted,
        loading: state.api.loading,
    };
}

export default withTranslation()(connect(mapStateToProps, actions)(Decks));
