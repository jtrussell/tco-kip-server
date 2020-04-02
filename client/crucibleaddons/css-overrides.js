const i18n = require('./i18n');

const start = () => {
    if(document.querySelector('#crucible-streamer-addons-css')) {
        document.querySelector('#crucible-streamer-addons-css').remove();
    }

    let cssOverrides = '';

    //const navElements = Array.from(document.querySelectorAll('.navbar-right li'));
    //let concedeIndex = -1;
    //let leaveIndex = -1;
    //navElements.forEach((el, i) => {
    //const matchLeaveGame = i18n['Leave Game'].find(t => el.innerText === t);
    //if(matchLeaveGame) {
    //return;
    //}

    //const matchConcede = i18n['Concede'].find(t => el.innerText === t);
    //if(matchConcede) {
    //return;
    //}

    //if(/spectators/.test(el.innerText)) {
    //return;
    //}

    //cssOverrides += `
    //.navbar-right li:nth-child(${i + 1}) {
    //display: none;
    //}
    //`;
    //});


    //.navbar-nav:nth-child(1) {
    //display: none;
    //}

    //.navbar-right li:nth-child(1) {
    //right: 110px;
    //width: 200px;
    //position: absolute;
    //top: 0px;
    //}

    const style = document.createElement('style');
    style.type = 'text/css';
    cssOverrides += `

    .main-window {
      user-select: none;
    }

    .navbar-header {
      display: none;
    }

    .navbar, #navbar {
      border: none;
      background: none;
    }

    .navbar-fixed-top {
      right: 0;
      left: unset;
      position: absolute;
    }

    .navbar-fixed-top .container {
      width: 300px;
    }

    .chat-status {
      position: fixed;
      top: 6px;
      right: 430px;
      z-index: 9999;
    }
    .chat-status .state {
      border: none;
    }

    .gamechat {
      overflow-y: hidden;
      position: fixed;
      right: 5px;
      width: 310px;
      top: 40px;
      height: 500px;
    }
    .gamechat input {
      font-size: 12px;
      height: 22px;
    }
    .gamechat .messages::-webkit-scrollbar {
      display: none;
    }
    .gamechat input {
      border-radius: 0;
    }




    .game-board {
      top: 0;
    }

    .stat-image.amber {
      transform: scale(1.8);
      margin: 10px;
    }

    .player-stats {
      border: none !important;
      background: none;
      height: 60px;
    }

    .state {
      border: none !important;
    }

    .play-area::-webkit-scrollbar {
      display: none;
    }
    .player-home-row {
      overflow: unset;
    }
    .player-home-row.our-side {
      margin-top: 0px;
      margin-bottom: 5px;
    }
    .player-home-row.our-side .player-home-row-container .overlay {
      transform: none;
    }
    .player-home-row.our-side .player-home-row-container {
      margin-left: 220px;
    }






    .wrapper {
      overflow-y: hidden;
    }

    .gray-scale-filter {
      filter: grayscale(1);
    }

    .can-play {
      animation: none !important;
    }

    .menu-pane-source {
      background: black;
    }

    .phase-indicator.main {
      background: rgb(255, 35, 1);
    }

    .board-middle {
      margin: 0;
    }

    .play-area {
      padding-left: 0px;
    }

    .play-area .player-board {
      justify-content: space-around;
      margin-left: 55px;
    }

    .messages {
      overflow-y: hidden;
    }

    .board-middle {
      margin-left: 5px;
      overflow: hidden;
    }

    .card.horizontal {
      margin: 0;
    }

    .card-large.vertical {
      width: 260px;
      height: 364px;
      right: 10px;
      top: 40px;
      transform: scale(1.1);
      transform-origin: right;
    }

    .player-board .card-wrapper {
      top: 0 !important;
    }

    .card-wrapper .menu {
      transform: scale(0.5);
      transform-origin: top left;
      height: 200px;
      overflow-y: scroll;
    }

    .card-large .card-name {
      display: none;
    }

    .card-large .card-alt {
      display: none;
    }

    .upgrade {
      margin-top: -106px !important;
    }

    .player-home-row:nth-child(1) {
      margin-top: -60px;
    }

    .player-home-row:nth-child(1) .hand {
      overflow: hidden;
    }

    .player-home-row:nth-child(1) .hand .card-wrapper {
      margin-top: 55px;
    }

    .player-home-row:nth-child(1) .card-pile {
      overflow: hidden;
    }

    .player-home-row:nth-child(1) .card-pile .card-wrapper {
      margin-top: 55px;
    }

    .player-home-row:nth-child(1) .discard .panel .card-wrapper {
      margin-top: 0px;
    }

    .player-home-row:nth-child(1) .keys img:nth-child(1) {
      margin-top: 60px;
    }

    .player-stats-row:nth-child(1) {
      position: absolute;
      top: 75px;
      left: 60px;
    }

    .player-stats-row:nth-child(1) .player-avatar {
      display: none;
    }

    .player-home-row:nth-child(1) .panel-header {
      top: unset;
      bottom: 0;
    }

    .player-board:nth-child(1) .card-row:nth-child(1) {
      width: fit-content;
      width: -webkit-fit-content;
      width: -moz-fit-content;
      transform-origin: left;
    }

    .player-board:nth-child(1) .card-row:nth-child(2) {
      width: fit-content;
      width: -webkit-fit-content;
      width: -moz-fit-content;
      transform-origin: left;
    }

    .player-board:nth-child(2) .card-row:nth-child(1) {
      width: fit-content;
      width: -webkit-fit-content;
      width: -moz-fit-content;
      transform-origin: left;
    }

    .player-board:nth-child(2) .card-row:nth-child(2) {
      width: fit-content;
      width: -webkit-fit-content;
      width: -moz-fit-content;
      transform-origin: left;
    }
    
    .card-row .card.large.vertical {
      height: 87px;
    }
  `;
    const node = document.createTextNode(cssOverrides);
    style.appendChild(node);

    setTimeout(() => {
        document.querySelector('.messages').style.overflowY = 'scroll';

        const keys = document.querySelectorAll('.player-avatar')[1];
        const prompt = document.querySelector('.prompt-area');
        keys.addEventListener('mouseover', () => {
            prompt.style.visibility = 'hidden';
        });
        keys.addEventListener('mouseout', () => {
            prompt.style.visibility = 'unset';
        });
    }, 1000);

    document.head.append(style);
    document.head.children[document.head.children.length - 1].setAttribute('id', 'crucible-streamer-addons-css');
};

module.exports = start;
