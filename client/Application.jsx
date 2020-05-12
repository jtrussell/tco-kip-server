import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { connect } from 'react-redux';

import { Constants } from './constants';
import ErrorBoundary from './Components/Site/ErrorBoundary';
import NavBar from './Components/Site/NavBar';
import FloatingNavBar from './Components/FloatingNavBar';
import Router from './Router';
import { tryParseJSON } from './util';
import AlertPanel from './Components/Site/AlertPanel';
import * as actions from './actions';
import { useMediaQuery } from 'react-responsive';
import Footer from './Components/Footer';
import GoodbyeArticle from './pages/GoodbyeArticle';

class Application extends React.Component {
    render() {
        return (
            <GoodbyeArticle/>
        );
    }
}

Application.displayName = 'Application';
Application.propTypes = {
    authenticate: PropTypes.func,
    connectLobby: PropTypes.func,
    currentGame: PropTypes.object,
    loadCards: PropTypes.func,
    loadFactions: PropTypes.func,
    loadPacks: PropTypes.func,
    loadRestrictedList: PropTypes.func,
    navigate: PropTypes.func,
    path: PropTypes.string,
    setAuthTokens: PropTypes.func,
    setContextMenu: PropTypes.func,
    token: PropTypes.string,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        currentGame: state.lobby.currentGame,
        path: state.navigation.path,
        token: state.account.token,
        user: state.account.user
    };
}


const Component = connect(mapStateToProps, actions)(Application);

export default (context) => (
    <Component isMobile={useMediaQuery({ maxWidth: 767 })}/>
);

//export default connect(mapStateToProps, actions)(Application);
