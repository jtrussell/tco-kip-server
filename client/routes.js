/* eslint react/display-name: 0 react/no-multi-comp: 0 */

import React from 'react';
import FAQ from './pages/FAQ';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Lobby from './pages/Lobby';
import Decks from './pages/Decks';
import ImportDeck from './Components/Decks/ImportDeck';
import Security from './pages/Security.jsx';
import Activation from './pages/Activation';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserAdmin from './pages/UserAdmin';
import Profile from './pages/Profile';
import NewsAdmin from './pages/NewsAdmin';
import MotdAdmin from './pages/MotdAdmin';
import GameLobby from './Components/Games/GameLobby';
import GameBoard from './Components/GameBoard/GameBoard.jsx';
import BlockList from './pages/BlockList';
import NodesAdmin from './pages/NodesAdmin';
import Privacy from './pages/Privacy';
import Community from './pages/Community';
import BanlistAdmin from './pages/BanlistAdmin';
import Leaderboard from './pages/Leaderboard';
import TCOArticle from './pages/TCOArticle';
import Tournaments from './pages/Tournaments';
import Foils from './pages/Foils';

const routes = [
    { path: '/', action: () => <Lobby key='lobby' /> },
    { path: '/faq', action: () => <FAQ /> },
    { path: '/foil', action: () => <Foils/> },
    { path: '/foils', action: () => <Foils/> },
    { path: '/tournaments', action: () => <Tournaments/>, permission: 'isTO' },
    //{ path: '/tournaments', action: () => <Tournaments/> },
    { path: '/tco', action: () => <TCOArticle/> },
    { path: '/leaderboard', action: () => <Leaderboard/> },
    { path: '/leaderboards', action: () => <Leaderboard/> },
    { path: '/activation', action: context => <Activation key='activation' id={ context.params.id } token={ context.params.token } /> },
    { path: '/decks', action: () => <Decks key='decks' /> },
    { path: '/decks/import', action: () => <ImportDeck key='importDecks' /> },
    { path: '/forgot', action: () => <ForgotPassword key='forgotpassword' /> },
    { path: '/login', action: () => <Login key='login' /> },
    { path: '/logout', action: () => <Logout key='logout' /> },
    { path: '/play', action: context => (context.currentGame && context.currentGame.started) ? <GameBoard key='gameboard' /> : <GameLobby key='gamelobby' /> },
    { path: '/profile', action: () => <Profile key='profile' /> },
    { path: '/register', action: () => <Register key='register' /> },
    { path: '/reset-password', action: context => <ResetPassword key='resetpassword' id={ context.params.id } token={ context.params.token } /> },
    { path: '/security', action: () => <Security key='security' /> }
];

export default routes;
