const _ = require('underscore');

const allCards = require('../../cards');
const logger = require('../log.js');

class CardService {
    constructor(db) {
        this.cards = db.get('cards');
        this.packs = db.get('packs');
    }

    replaceCards(cards) {
        return this.cards.remove({})
            .then(() => this.cards.insert(cards));
    }

    replacePacks(cards) {
        return this.packs.remove({})
            .then(() => this.packs.insert(cards));
    }

    getAllCards(options) {
        let cards = {};

        _.each(allCards, card => {
            if(options && options.shortForm) {
                cards[card.id] = _.pick(card, 'id', 'name', 'type', 'house', 'rarity', 'number', 'image', 'amber', 'locale', 'traits');
            } else {
                cards[card.id] = card;
            }
        });

        return Promise.resolve(cards);
    }

    getAllPacks() {
        return this.packs.find({}).catch(err => {
            logger.info(err);
        });
    }
}

module.exports = CardService;
