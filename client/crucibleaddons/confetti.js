const confetti = require('canvas-confetti');

const consumeEvent = (event, user) => {
  if (event.message
      && event.message.alert
      && event.message.alert.message
      && event.message.alert.message[0]
      && event.message.alert.message[0].name === user
      && event.message.alert.message[1]
      && / has won the game/.test(event.message.alert.message[1])
  ) {
    showConfetti();
    setTimeout(showConfetti, 200);
    setTimeout(showConfetti, 500);
  }
};

function r(min, max) {
  return Math.random() * (max - min) + min;
}

const showConfetti = () => {
  const confettiCanvas = document.createElement('canvas');
  confettiCanvas.style.pointerEvents = 'none';
  confettiCanvas.style.position = 'fixed';
  confettiCanvas.style.left = '0px';
  confettiCanvas.style.top = '0px';
  confettiCanvas.style.width = '100%';
  confettiCanvas.style.height = '100%';

  const shoot = confetti.create(confettiCanvas, { resize: true });
  document.body.appendChild(confettiCanvas);

  shoot({
    angle: r(55, 125),
    spread: r(50, 70),
    particleCount: r(50, 100),
    origin: {
      y: 0.8
    }
  });

  setTimeout(() => {
    confettiCanvas.remove();
  }, 5000);
}

module.exports = consumeEvent;
