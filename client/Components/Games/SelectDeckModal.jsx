import React from 'react';
import PropTypes from 'prop-types';

import AlertPanel from '../Site/AlertPanel';
import DeckList from '../Decks/DeckList.jsx';
import Modal from '../Site/Modal';

import { withTranslation, Trans } from 'react-i18next';

class SelectDeckModal extends React.Component {
    render() {
        let t = this.props.t;
        let decks = null;

        if(this.props.loading) {
            decks = <div><Trans>Loading decks from the server...</Trans></div>;
        } else if(this.props.apiError) {
            decks = <AlertPanel type='error' message={ this.props.apiError } />;
        } else {
            const earlyAccessDecks = [{
                id: '00000000-0000-0000-0000-ea0000000001',
                houses: ['dis', 'logos', 'shadows'],
            }]
            decks = (
                <div>
                    { this.props.allowEarlyAccessDecks && (
                        <div style={{ marginBottom: '20px', height: '200px' }}>
                            <div style={{ margin: '0 0 5px 20px' }}>
                                Early Access Decks
                            </div>
                            <DeckList
                                disableStarring={true}
                                hideControls={true}
                                className='deck-list-popup'
                                decks={ earlyAccessDecks }
                                onSelectDeck={ this.props.onDeckSelected }
                            />
                        </div>
                    )}
                    <DeckList
                        disableStarring={true}
                        className='deck-list-popup'
                        decks={ this.props.decks }
                        onSelectDeck={ this.props.onDeckSelected }
                    />
                </div>
            );
        }

        return (
            <Modal id={ this.props.id } bodyClassName='col-xs-12 deck-body' className='deck-popup' title={ t('Select Deck') }>
                { decks }
            </Modal>);
    }
}

export default withTranslation()(SelectDeckModal);
