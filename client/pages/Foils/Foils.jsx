import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import Link from '../../Components/Link';
import DeckList from '../../Components/Decks/DeckList';
import * as actions from '../../actions';
import styled from 'styled-components';
import Background from '../../Components/Background';
import { withTranslation, Trans } from 'react-i18next';
import { buildDeckList } from '../../archonMaker';
import linkDeckCards from '../Decks/linkDeckCards';
import colors from '../../colors';
import Gallery from './Gallery';

const Container = styled.div`
    max-width: 900px;
    margin: 60px auto;
    display: flex;
    flex-direction: column;
`

class Foils extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {};
    }


    componentWillMount() {
        this.fetchUserData(this.props.user);
    }

    componentWillReceiveProps(props) {
        this.fetchUserData(props.user);
    }

    fetchUserData(user) {
        if (user && !this._hasFetchedFoils) {
            this._hasFetchedFoils = true;
            Promise.all([
                fetch(`/api/users/${user.username}/foils`).then(response => response.json()),
                fetch(`/api/users/${user.username}/coupons`).then(response => response.json())
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

        return (
            <Container>
                <Background/>
                <Gallery foils={this.state.foils} cards={this.props.cards} navigate={this.props.navigate} />
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.account.user,
        apiLoading: state.api.REQUEST_DECKS ? state.api.REQUEST_DECKS.loading : undefined,
        cards: state.cards.cards,
    };
}

export default withTranslation()(connect(mapStateToProps, actions)(Foils));
