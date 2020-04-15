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

class Application extends React.Component {
    constructor(props) {
        super(props);

        this.router = new Router();

        this.state = {
        };

        if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
            location.replace(`https:${location.href.substring(location.protocol.length)}`);
        }
    }

    componentWillMount() {
        if(!localStorage) {
            this.setState({ incompatibleBrowser: true });
        } else {
            try {
                let token = localStorage.getItem('token');
                let refreshToken = localStorage.getItem('refreshToken');
                if(refreshToken) {
                    const parsedToken = tryParseJSON(refreshToken);
                    if(parsedToken) {
                        this.props.setAuthTokens(token, parsedToken);
                        this.props.authenticate();
                    }
                }
            } catch(error) {
                this.setState({ cannotLoad: true });
            }
        }

        this.props.loadCards();
        this.props.loadFactions();

        $(document).ajaxError((event, xhr) => {
            if(xhr.status === 403) {
                this.props.navigate('/unauth');
            }
        });

        this.props.connectLobby();
    }

    componentDidUpdate() {
        if(!this.props.currentGame) {
            this.props.setContextMenu([]);
        }
    }

    render() {
        let gameBoardVisible = this.props.currentGame && this.props.currentGame.started && this.props.path === '/play';

        let component = this.router.resolvePath({
            pathname: this.props.path,
            user: this.props.user,
            currentGame: this.props.currentGame
        });

        if(this.state.incompatibleBrowser) {
            component = <AlertPanel type='error' message='Your browser does not provide the required functionality for this site to work.  Please upgrade your browser.  The site works best with a recet version of Chrome, Safari or Firefox' />;
        } else if(this.state.cannotLoad) {
            component = <AlertPanel type='error' message='This site requires the ability to store cookies and local site data to function.  Please enable these features to use the site.' />;
        }

        let backgroundClass = 'bg';
        let bgStyles = {};

        if(gameBoardVisible && this.props.user) {
            let localBackgroundUrl;
            try {
                localBackgroundUrl = localStorage.getItem('localBackgroundUrl');
            } catch (e) {
                console.log(e);
            }

            if (localBackgroundUrl) {
                bgStyles.backgroundImage = `url(${localBackgroundUrl})`;
            } else {
                let houseIndex = Constants.HousesNames.indexOf(this.props.user.settings.background);
                if(houseIndex === -1) {
                    backgroundClass = '';
                } else {
                    backgroundClass += ` bg-board-${Constants.Houses[houseIndex]}`;
                }
            }
        }

        const showFloatingNavBar = [
            '/',
            '/faq',
            '/foil',
            '/foils',
            '/profile',
            '/leaderboard',
            '/leaderboards',
            '/decks',
            '/tournaments',
        ].includes(this.props.path);

        let navBarComponent = <NavBar title='KiP Tournaments' />;
        let floatingNavBarComponent = <FloatingNavBar isMobile={this.props.isMobile}/>;

        if (gameBoardVisible) {
            navBarComponent = null;
            floatingNavBarComponent = null;
        }

        if (showFloatingNavBar)
            navBarComponent = null;
        else
            floatingNavBarComponent = null;

        let showFooter = [
            '/',
        ].includes(this.props.path);

        return (<div style={ { height: '100%' } }>
            <div className={ backgroundClass } style={bgStyles} />
                {navBarComponent}
                {floatingNavBarComponent}
            <div className='wrapper'>
                <div className='content'>
                    <ErrorBoundary navigate={ this.props.navigate } errorPath={ this.props.path } message={ 'We\'re sorry - something\'s gone wrong.' }>
                        { component }
                    </ErrorBoundary>
                </div>
                {showFooter && <Footer navigate={ this.props.navigate } />}
            </div>
        </div>);
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
