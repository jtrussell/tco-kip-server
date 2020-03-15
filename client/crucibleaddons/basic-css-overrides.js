setTimeout(() => {
  if (document.querySelector('#crucible-streamer-addons-css')) {
    document.querySelector('#crucible-streamer-addons-css').remove();
  }

  let playerHome = document.querySelectorAll('.player-home-row-container')[1];
  let playerStats = document.querySelectorAll('.player-stats')[1];
  const promptBottom = playerHome.getBoundingClientRect().height + playerStats.getBoundingClientRect().height + 5;

  const style = document.createElement('style');
  style.type = 'text/css';
  const cssOverrides = `
    .gray-scale-filter {
      filter: grayscale(1);
    }
    .can-play {
      animation: none !important;
    }
    .prompt-area {
      position: fixed;
      left: 0 !important;
      bottom: ${promptBottom}px !important;
    }
    .board-inner {
      margin-left: 200px;
    }
  `;
  const node = document.createTextNode(cssOverrides);
  style.appendChild(node);

  document.head.append(style);
  document.head.children[document.head.children.length - 1].setAttribute('id', 'crucible-streamer-addons-css');
}, 1000);
