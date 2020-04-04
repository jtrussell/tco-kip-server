import React, { useState } from 'react';
import { connect } from 'react-redux';

import Link from '../Site/Link';
import * as actions from '../../actions';
import menus from '../../menus';

import User from './User';
import styled from 'styled-components';

const NavBar = styled.div`
    z-index: 1;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    padding-top: 20px;
    margin-bottom: 20px;
    color: #000;
    backgroundColor: #FFF;
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

const LogoContainer = styled.a`
    font-size: 30px;
    font-weight: 300;
    margin: 0 10px;
    margin-right: 20px;
    font-family: "Open Sans", "Arial", sans-serif;
    text-decoration: none;
    color: #000;

    &:hover {
        color: #000;
    }
`;

const Logo = styled.img`
    height: 40px;
    border-radius: 20px;
    margin-right: 10px;
    box-shadow: rgba(0, 0, 0, 0.4) 1px 1px 3px 0px;
`

const Text = styled.div`
    letter-spacing: 1.1px;
    font-family: "Open Sans", "Arial", sans-serif;
`;

const ButtonContainer = styled(Text)`
    padding: ${({ padding }) => padding || '5px'};
    margin: ${({ margin }) => margin || '0 10px'};
    cursor: pointer;
    font-size: 17px;

    &:hover {
        color: rgb(0, 0, 238);
        text-decoration: underline;
    }
`;

const Button = ({ navigate, path, children, padding, margin }) => {
    return (
        <ButtonContainer margin={margin} padding={padding} onClick={ () => navigate(path) }>
            { children }
        </ButtonContainer>
    );
};

const RegisterButtonContainer = styled.div`
    padding: 7px 10px;
    margin: 0 10px;
    letter-spacing: 1.1px;
    cursor: pointer;
    color: #FFF;
    background-color: #6464fa;
    border-radius: 3px;
`;

const RegisterButton = ({ navigate, path, children }) => {
    return (
        <RegisterButtonContainer onClick={ () => navigate(path) }>
            { children }
        </RegisterButtonContainer>
    );
};

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <NavBar>
                <Container>
                    <LeftItems>
                        <LogoContainer href='/'>
                            <Logo src='/img/logo.png'/>
                            KiP Tournaments
                        </LogoContainer>
                        <Button navigate={ this.props.navigate } path='/play'>Play</Button>
                        { this.props.user && <Button navigate={ this.props.navigate } path='/decks'>Decks</Button> }
                        <Button navigate={ this.props.navigate } path='/leaderboard' >Leaderboards</Button>
                    </LeftItems>
                    <RightItems>
                        { !this.props.user && <Button navigate={ this.props.navigate } path='/login'>Login</Button> }
                        { !this.props.user && <RegisterButton navigate={ this.props.navigate } path='/register'>Register</RegisterButton> }
                        { this.props.user && (
                            <User navigate={ this.props.navigate } username={this.props.user.username}/>
                        ) }
                    </RightItems>
                </Container>
            </NavBar>
        );
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

export default connect(mapStateToProps, actions)(Component);
