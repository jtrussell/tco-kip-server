module.exports = () => {
  const gameChat = document.querySelector('.gamechat');

  const formContainer = document.querySelector('.form.chat-form').parentNode;
  const dragEl = document.createElement('div');
  dragEl.style.width = '300px';
  dragEl.style.height = '10px';
  dragEl.style.margin = '0px auto';
  dragEl.style.cursor = 'pointer';
  dragEl.style.backgroundColor = 'gray';
  dragEl.style.backgroundImage = 'linear-gradient(transparent 50%, rgba(255,255,255,.5) 50%)';
  dragEl.style.backgroundSize = '5px 5px';
  formContainer.appendChild(dragEl);

  let dragging = false;

  dragEl.addEventListener('mousedown', (e) => {
    dragging = !dragging;
    dragEl.style.cursor = dragging ? 'grab' : 'pointer';
  });

  document.body.addEventListener('mouseup', (e) => {
    dragging = false;
  });

  document.body.addEventListener('mousemove', (e) => {
    dragEl.style.cursor = dragging ? 'grab' : 'pointer';
    if (dragging) {
      gameChat.style.height = e.clientY + 'px';
    }
  });
};
