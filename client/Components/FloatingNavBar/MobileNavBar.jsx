import React, { useState } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import styled from 'styled-components';
import colors from '../../colors';

const NavBar = styled.div`
    z-index: 1;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    padding: 10px;
    margin-bottom: 10px;
    color: ${colors.text};
    background-color: ${colors.background};
`;

const Container = styled.div`
    height: 40px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const MenuContainer = styled.div`
    z-index: 1;
    display: flex;
    flex-direction: column;
    text-align: center;
    padding-top: 20%;
    background-color: ${colors.background};
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
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

const BurgerLine = styled.div`
  width: 30px;
  height: 3px;
  background-color: ${colors.text};
  margin: 7px 0;
`;

const Burger = ({ onClick }) => (
  <div style={{ backgroundColor: colors.background, padding: '5px 7px' }} onClick={onClick}>
    <BurgerLine />
    <BurgerLine />
    <BurgerLine />
  </div>
);

const NavLink = styled.a`
  z-index: 2;
  cursor: pointer;
  margin: 0 15px;
  text-decoration: inherit;
  color: ${colors.url};
  font-size: 24px;
  margin-top: 30px;
  margin-bottom: 20px;
  font-weight: 300;
  letter-spacing: 1.1px;

  &:hover {
    text-decoration: underline;
    color: ${colors.url};
  }
`;

const Nav = ({ onClick }) => (
  <MenuContainer>
    <X onClick={onClick} />
    <NavLink href="/leaderboard">
      Leaderboards
    </NavLink>
    <NavLink href="/faq">
      FAQ
    </NavLink>
    <NavLink href="/decks">
      Decks
    </NavLink>
    <NavLink href="/foils">
      Foils
    </NavLink>
    <NavLink href="/play">
      Play
    </NavLink>
  </MenuContainer>
);

const X = ({ onClick }) => {
  const Container = styled.div`
    position: fixed;
    top: 10px;
    right: 15px;
    font-size: 36px;
    width: 30px;
    height: 30px;
    text-align: center;
    font-family: Arial, "Open Sans";
    z-index: 2;
    color: ${colors.text};
  `;

  return (
    <Container onClick={onClick}>
      X
    </Container>
  );
};

class Component extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
    };
  }

  handleOpenMenu() {
    this.setState({
      isOpen: true,
    });
  }

  handleCloseMenu() {
    this.setState({
      isOpen: false,
    });
  }

  render() {
    const { isOpen } = this.state;

    if (isOpen) {
      return (
        <Nav onClick={this.handleCloseMenu.bind(this)} />
      );
    }

    return (
        <NavBar>
            <Container>
                <LeftItems>
                    <LogoContainer href='/'>
                        <Logo src='/img/logo.png'/>
                        KiPT
                    </LogoContainer>
                </LeftItems>
                <RightItems>
                    <Burger onClick={this.handleOpenMenu.bind(this)} />
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
