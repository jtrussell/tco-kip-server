const fs = require('fs');
//const MM = require('./keyteki-json-data/packs/MM');
const cards = require('../cards');

cards.forEach(card => {
    Object.keys(card.locale).forEach(locale => {
        if(locale !== 'en') {
            delete card.locale[locale];
        }
    });
});

fs.writeFileSync('./clean-cards.json', JSON.stringify(cards));
console.log(cards[0]);
