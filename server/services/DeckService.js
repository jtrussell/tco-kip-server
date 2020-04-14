const logger = require('../log.js');
const util = require('../util.js');

const foilMap = {
    'stronglink-a61aa0d7-0a94-4abe-8f33-0695f5410845': {
        'restringuntus': 1
    },
    'JusticeBlinded-a61aa0d7-0a94-4abe-8f33-0695f5410845': {
        'restringuntus': 1
    },
    'JusticeBlinded-90a9d1a3-ea89-4147-ac8f-02de7e89bad9': {
        'hunting-witch': 1
    },
    'Leolinci96-025be087-60d0-46bc-b337-d23fa50df676': {
        'raiding-knight': 1
    },
    'stronglink-025be087-60d0-46bc-b337-d23fa50df676': {
        'raiding-knight': 1
    }
};

class DeckService {
    constructor(db) {
        this.decks = db.get('decks');
        this.games = db.get('games');
    }

    async checkForFoil(deck) {
        const foilMapId = `${deck.username}-${deck.uuid}`;

        if(foilMap[foilMapId]) {
            deck.cards = deck.cards.map(card => {
                const foil = !!foilMap[foilMapId][card.id];
                if(foil) {
                    card.foil = foil;
                }

                return card;
            });
        }

        return deck;
    }

    async getById(id) {
        let deck;

        try {
            deck = await this.decks.findOne({ _id: id });
            deck = await this.checkForFoil(deck);
            deck.usageCount = await this.decks.count({ name: deck.name });
        } catch(err) {
            logger.error('Unable to fetch deck', err);
            throw new Error('Unable to fetch deck ' + id);
        }

        return deck;
    }

    async getByIdentity(identity) {
        let deck;

        try {
            deck = await this.decks.findOne({ identity });
            deck = await this.checkForFoil(deck);
        } catch(err) {
            logger.error('Unable to fetch deck', err);
            throw new Error('Unable to fetch deck ' + id);
        }

        return deck;
    }

    async getSealedDeck(expansions) {
        let dbExpansions = [];

        if(expansions.aoa) {
            dbExpansions.push(435);
        }

        if(expansions.cota) {
            dbExpansions.push(341);
        }

        if(expansions.wc) {
            dbExpansions.push(452);
        }

        return await this.decks.aggregate([{ $match: { includeInSealed: true, expansion: { $in: dbExpansions } } }, { $sample: { size: 1 } }]);
    }

    getByUuid(uuid) {
        return this.decks.findOne({ uuid: uuid })
            .then(this.checkForFoil)
            .catch(err => {
                logger.error('Unable to fetch deck', err);
                throw new Error('Unable to fetch deck ' + uuid);
            });
    }

    async findByUserName(username) {
        let decks = await this.decks.find({ username: username, banned: false }, { sort: { lastUpdated: -1 } });

        for(let deck of decks) {
            deck = await this.checkForFoil(deck);
            deck.usageCount = await this.decks.count({ name: deck.name });
            // deck.wins = await this.games.count({ 'players.deck': deck.identity, winner: username });
            // deck.losses = await this.games.count({ 'players.deck': deck.identity, 'players.name': username, winner: { $nin: [null, username] } });
        }

        return decks;
    }

    async create(deck) {
        let deckResponse;

        try {
            let response = await util.httpRequest(`https://www.keyforgegame.com/api/decks/${deck.uuid}/?links=cards`);

            if(response[0] === '<') {
                logger.error('Deck failed to import', deck.uuid, response);

                return;
            }

            deckResponse = JSON.parse(response);
        } catch(error) {
            logger.error('Unable to import deck', deck.uuid, error);

            return;
        }

        if(!deckResponse || !deckResponse._linked || !deckResponse.data) {
            return;
        }

        let cards = deckResponse._linked.cards.map(card => {
            let id = card.card_title.toLowerCase().replace(/[,?.!"„“”]/gi, '').replace(/[ '’]/gi, '-');

            if(card.is_maverick) {
                return {
                    id: id,
                    count: 1,
                    maverick: card.house.replace(' ', '').toLowerCase()
                };
            }

            if(card.is_anomaly) {
                return {
                    id: id,
                    count: 1,
                    anomaly: card.house.replace(' ', '').toLowerCase()
                };
            }

            return {
                id: id,
                count: deckResponse.data._links.cards.filter(uuid => uuid === card.id).length
            };
        });
        let uuid = deckResponse.data.id;

        let illegalCard = cards.find(card => !card.id.split('').every(char => 'æabcdefghijklmnoöpqrstuvwxyz0123456789-[]'.includes(char)));
        if(!illegalCard) {
            return await this.decks.insert({
                expansion: deckResponse.data.expansion,
                username: deck.username,
                uuid: uuid,
                identity: deckResponse.data.name.toLowerCase().replace(/[,?.!"„“”]/gi, '').replace(/[ '’]/gi, '-'),
                cardback: '',
                name: deckResponse.data.name,
                banned: false,
                verified: false,
                includeInSealed: false,
                houses: deckResponse.data._links.houses.map(house => house.replace(' ', '').toLowerCase()),
                cards: cards,
                lastUpdated: new Date()
            });
        }

        logger.error(`DECK IMPORT ERROR: ${illegalCard.id.split('').map(char => char.charCodeAt(0))}`);
    }

    update(deck) {
        let properties = {
            verified: deck.verified,
            lastUpdated: new Date()
        };

        return this.decks.update({ _id: deck.id }, { '$set': properties });
    }

    delete(id) {
        return this.decks.remove({ _id: id });
    }

    async getFlaggedUnverifiedDecksForUser(username) {
        return await this.decks.find({ username: username, verified: false, flagged: true });
    }

    async verifyDecksForUser(username) {
        return await this.decks.update({ username: username, verified: false, flagged: true }, { $set: { verified: true } }, { multi: true });
    }
}

module.exports = DeckService;

