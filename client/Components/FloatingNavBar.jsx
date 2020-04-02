import React from 'react';
import { connect } from 'react-redux';

import Link from './Site/Link';
import Avatar from './Site/Avatar';
import * as actions from '../actions';
import menus from '../menus';

import i18n from '../i18n';
import { withTranslation } from 'react-i18next';

import styled from 'styled-components';

const NavBar = styled.div`
    z-index: 1;
    position: fixed;
    top: 20px;
    right: 0;
    left: 0;
    margin-bottom: 20px;
    color: #000;
`;

const Container = styled.div`
    max-width: 1000px;
    height: 40px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const LeftItems = styled.div`
    display: flex;
    align-items: baseline;
`;

const RightItems = styled.div`
    display: flex;
    align-items: baseline;
`;

const Logo = styled.div`
    font-size: 2em;
    margin: 0 10px;
    margin-right: 20px;
`;

const User = styled.div`
    display: flex;
    align-items: center;
`;

const Button = ({ navigate, path, children, padding, margin }) => {
    const El = styled.div`
        padding: ${padding || '5px'};
        margin: ${margin || '0 10px'};
        letter-spacing: 1.1px;
        cursor: pointer;
    `;

    return (
        <El onClick={ () => navigate(path) }>
            { children }
        </El>
    );
};

const RegisterButton = ({ navigate, path, children }) => {
    const El = styled.div`
        padding: 7px 10px;
        margin: 0 10px;
        letter-spacing: 1.1px;
        cursor: pointer;
        color: #FFF;
        background-color: #6464fa;
        border-radius: 3px;
    `;

    return (
        <El onClick={ () => navigate(path) }>
            { children }
        </El>
    );
};

class Component extends React.Component {
    constructor(props) {
        super(props);

        this.options = [
            {
                name: 'English',
                value: 'en'
            }
        ];

        this.state = {};

        this.onLanguageClick = this.onLanguageClick.bind(this);
    }

    componentDidMount() {
        let lang = this.normalizedLanguage();

        i18n.changeLanguage(lang);
    }

    onMenuItemMouseOver(menuItem) {
        this.setState({
            showPopup: menuItem
        });
    }

    onMenuItemMouseOut() {
        this.setState({
            showPopup: undefined
        });
    }

    onLanguageClick(lang) {
        i18n.changeLanguage(lang.value);
    }

    normalizedLanguage() {
        let lang = i18n.language.replace('-', '').toLowerCase();
        let option = this.options.find((option) => {
            return option.value === lang;
        });

        if(!option) {
            let idx = i18n.language.indexOf('-');
            if(idx !== -1) {
                lang = i18n.language.substring(0, idx).toLowerCase();
            }
        }

        if(lang === 'zh') {
            lang = 'zhhant';
        } else {
            // Try to find again without the '-'
            option = this.options.find((option) => {
                return option.value === lang;
            });

            if(!option) {
                // fallback to english
                lang = 'en';
            }
        }

        return lang;
    }

    renderMenuItem(menuItem) {
        let t = this.props.t;
        let active = menuItem.path === this.props.path ? 'active' : '';

        if(menuItem.showOnlyWhenLoggedOut && this.props.user) {
            return null;
        }

        if(menuItem.showOnlyWhenLoggedIn && !this.props.user) {
            return null;
        }

        if(menuItem.permission && (!this.props.user || !this.props.user.permissions[menuItem.permission])) {
            return null;
        }

        if(menuItem.childItems) {
            let className = 'dropdown';

            if(menuItem.childItems.some(item => {
                return item.path === this.props.path;
            })) {
                className += ' active';
            }

            var childItems = menuItem.childItems.reduce((items, item) => {
                if(item.permission && (!this.props.user || !this.props.user.permissions[item.permission])) {
                    return items;
                }

                return items.concat(<li key={ item.title }><Link href={ item.path }>{ t(item.title) }</Link></li>);
            }, []);

            if(childItems.length === 0) {
                return null;
            }

            return (
                <li key={ menuItem.title } className={ className }>
                    <a href='#' className='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>
                        { menuItem.showProfilePicture && this.props.user ?
                            <Avatar username={ this.props.user.username } /> :
                            null }
                        { menuItem.showProfilePicture && this.props.user ? this.props.user.username : t(menuItem.title) }<span className='caret' />
                    </a>
                    <ul className='dropdown-menu' style={ { backgroundColor: '#000' } }>
                        { childItems }
                    </ul>
                </li>);
        }

        return <li key={ menuItem.title } className={ active }><Link href={ menuItem.path }>{ t(menuItem.title) }</Link></li>;
    }

    render() {
        return (
            <NavBar>
                <Container>
                    <LeftItems>
                        <Logo>KiP Tournaments</Logo>
                        <Button navigate={ this.props.navigate } path='/play'>Play</Button>
                        { this.props.user && <Button navigate={ this.props.navigate } path='/decks'>Decks</Button> }
                        <Button navigate={ this.props.navigate } path='/leaderboard' >Leaderboards</Button>
                    </LeftItems>
                    <RightItems>
                        { !this.props.user && <Button navigate={ this.props.navigate } path='/login'>Login</Button> }
                        { !this.props.user && <RegisterButton navigate={ this.props.navigate } path='/register'>Register</RegisterButton> }
                        { this.props.user && (
                            <User>
                                <Avatar username={ this.props.user.username } />
                                <Button navigate={ this.props.navigate } path='/profile' padding='0' margin='2px'>{ this.props.user.username }</Button>
                            </User>
                        ) }
                    </RightItems>
                </Container>
            </NavBar>
        );


        let t = this.props.t;

        let leftMenu = menus.filter(menu => {
            return menu.position === 'left';
        });
        let rightMenu = menus.filter(menu => {
            return menu.position === 'right';
        });

        leftMenu = leftMenu.filter(menu => {
            if(!this.props.path.includes('/play')) {
                return true;
            }

            return !this.props.currentGame;
        });

        let leftMenuToRender = leftMenu.map(this.renderMenuItem.bind(this));
        let rightMenuToRender = rightMenu.map(this.renderMenuItem.bind(this));

        let languageDropdown = (<li className='dropdown'>
            <a href='#' className='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>{ i18n.language }<span className='caret'/></a>
            <ul className='dropdown-menu'>
                { this.options.map(item => (<li key={ item.value }><a href='#' onClick={ () => this.onLanguageClick(item) }>{ item.name }</a></li>)) }
            </ul>
        </li>);

        let numGames = this.props.games ? <li><span>{ t('{{gameLength}} Games', { gameLength: this.props.games.length }) }</span></li> : null;

        let contextMenu = this.props.context && this.props.context.map(menuItem => {
            return (
                <li key={ menuItem.text }><a href='javascript:void(0)' onMouseOver={ this.onMenuItemMouseOver.bind(this, menuItem) }
                    onMouseOut={ this.onMenuItemMouseOut.bind(this) }
                    onClick={ menuItem.onClick ? event => {
                        event.preventDefault();
                        menuItem.onClick();
                    } : null }>{ t(menuItem.text, menuItem.values) }</a>{ (this.state.showPopup === menuItem) ? this.state.showPopup.popup : null }</li>
            );
        });

        let className = 'glyphicon glyphicon-signal';
        let toolTip = 'Lobby is';

        if(this.props.lobbySocketConnected) {
            className += ' text-success';
            toolTip += ' connected';
        } else if(this.props.lobbySocketConnecting) {
            className += ' text-primary';
            toolTip += ' connecting';
        } else {
            className += ' text-danger';
            toolTip += ' disconnected';
        }

        let lobbyStatus = (
            <li>
                <span className={ className } title={ t(toolTip) } />
            </li>);

        className = 'glyphicon glyphicon-signal';
        toolTip = 'Game server is';
        if(this.props.currentGame) {
            if(this.props.gameConnected) {
                className += ' text-success';
                toolTip += ' connected';
            } else if(this.props.gameConnecting) {
                className += ' text-primary';
                toolTip += ' connecting';
            } else {
                className += ' text-danger';
                toolTip += ' disconnected';
            }
        } else {
            toolTip += ' not needed at this time';
        }

        let gameStatus = (
            <li>
                <span className={ className } title={ t(toolTip) } />
            </li>);

        return (
            <nav className='navbar navbar-inverse navbar-fixed-top navbar-sm'>
                <div style={ {
                    padding: '0 0px 0 15px'
                } }>
                    <div className='navbar-header' style={ { marginRight: '10px', fontSize: '20px' } }>
                        <button className='navbar-toggle collapsed' type='button' data-toggle='collapse' data-target='#navbar' aria-expanded='false' aria-controls='navbar'>
                            <span className='sr-only'>Toggle Navigation</span>
                            <span className='icon-bar' />
                            <span className='icon-bar' />
                            <span className='icon-bar' />
                        </button>
                        <Link href='/' className='navbar-brand'>KiP Tournaments</Link>
                    </div>
                    <div id='navbar' className='collapse navbar-collapse'>
                        <ul className='nav navbar-nav' style={ { color: '#FFF !important' } }>
                            { leftMenuToRender }
                        </ul>
                        <ul className='nav navbar-nav navbar-right'>
                            { contextMenu }
                            { rightMenuToRender }
                        </ul>
                    </div>
                </div>
            </nav>);
    }
}

Component.displayName = 'Component';

function mapStateToProps(state) {
    return {
        context: state.navigation.context,
        currentGame: state.lobby.currentGame,
        gameConnected: state.games.connected,
        gameConnecting: state.games.connecting,
        games: state.lobby.games,
        lobbySocketConnected: state.lobby.connected,
        lobbySocketConnecting: state.lobby.connecting,
        path: state.navigation.path,
        user: state.account.user
    };
}

export default withTranslation()(connect(mapStateToProps, actions)(Component));
