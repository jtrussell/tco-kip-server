let elementAt = 0;

const cardsToHighlight = [
  'Key Hammer',
  'The Evil Eye',
  'Shadow of Dis',
  'Interdimensional Graft',
  'Scrambler Storm',
  'Inky Gloom',
  'Into the Night',
  'Miasma',
  'Stealth Mode',
];

const update = () => {

  const cardLinks = Array.from(
    document.querySelectorAll('.chat .card-link')
  )

  cardLinks.slice(elementAt).forEach(el => {

    if (/plays/.test(el.parentNode.innerText) && cardsToHighlight.includes(el.innerText)) {
      el.style.backgroundColor = '#fc7f79';
      el.style.color = '#000';
      el.style.padding = '2px';
    }
  });

  elementAt = cardLinks.length;
}

module.exports = {
  update,
};
