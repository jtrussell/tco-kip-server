import React, { useState } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import User from './User';
import styled from 'styled-components';
import colors from '../../colors';

const NavBar = styled.div`
    z-index: 100;
    position: fixed;
    top: 0;
    width: calc(100% - 30px);
    margin-left: 15px;
    padding-top: 20px;
    margin-bottom: 20px;
    color: ${colors.text};
    background-color: ${colors.background};
`;

const Container = styled.div`
    max-width: 1020px;
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
    margin: 0 10px 0 0;
    margin-right: 20px;
    font-family: "Open Sans", "Arial", sans-serif;
    text-decoration: none;
    color: ${colors.text};

    &:hover {
        color: ${colors.text};
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
        color: ${colors.url};
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
    color: ${colors.background};
    background-color: ${colors.url};
    border-radius: 3px;
`;

const RegisterButton = ({ navigate, path, children }) => {
    return (
        <RegisterButtonContainer onClick={ () => navigate(path) }>
            { children }
        </RegisterButtonContainer>
    );
};

                        //<Button navigate={ this.props.navigate } path='/foil'>Foils</Button>
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
                            KiPT
                        </LogoContainer>
                        <Button navigate={ this.props.navigate } path='/play'>Play</Button>
                        { this.props.user && <Button navigate={ this.props.navigate } path='/decks'>Decks</Button> }
                        { this.props.user && <Button navigate={ this.props.navigate } path='/foils'>Foils</Button> }
                    </LeftItems>
                    <RightItems>
                        { !this.props.user && <Button navigate={ this.props.navigate } path='/login'>Login</Button> }
                        { !this.props.user && <RegisterButton navigate={ this.props.navigate } path='/register'>Register</RegisterButton> }
                        { this.props.user && (
                            <User navigate={ this.props.navigate } user={this.props.user}/>
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
