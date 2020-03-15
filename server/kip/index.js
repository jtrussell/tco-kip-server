const DeckService = require('../services/DeckService');
const pg = require('pg');
const api = require('./api');
const logger = require('../log');

const postgresDB = new pg.Pool({
    connectionString: process.env.POSTGRES_CONNECTION_STRING,
    ssl: process.env.NODE_ENV !== 'development'
});

let mongoDB;
let deckService;
const gamesRecorded = {};

const setup = async (_mongoDB) => {
    mongoDB = _mongoDB;
    deckService = new DeckService(mongoDB);
};

const recordGame = async (game) => {
    if(gamesRecorded[game.gameId]) {
        logger.info('[kip] Ignoring already recorded game ', game.gameId);
        return;
    }

    if(game.gameType === 'adaptive') {
        logger.info(JSON.stringify(game.adaptiveData));
        await recordAdaptiveGame(game);
    }

    if(game.gameType === 'chainbound') {
        await recordChainboundGame(game);
    }
};

const recordAdaptiveGame = async (game) => {
    const {
        adaptiveData
    } = game;
    if(!adaptiveData) {
        logger.error('[kip] adaptive data missing');
    }

    if(adaptiveData.records.length === 1) {
        return;
    }

    if(adaptiveData.records.length === 2 && adaptiveData.records[0] !== adaptiveData.records[1]) {
        return;
    }

    let winnerName;
    if(adaptiveData.records.length === 2) {
        winnerName = adaptiveData.records[0];
    }

    if(adaptiveData.records.length === 3) {
        winnerName = adaptiveData.records[2];
    }

    const winner = game.players.find(player => player.name === winnerName);
    const loser = game.players.find(player => player.name !== winnerName);

    if(!loser || !winner) {
        logger.info('[kip] Skipping adaptive record because player is null', winnerName, game.players);
        return;
    }

    const winnerDeck = await deckService.getByIdentity(winner.deck);
    const loserDeck = await deckService.getByIdentity(loser.deck);

    if(!loserDeck || !winnerDeck) {
        logger.info('[kip] Skipping chains because deck is null', game.players);
        return;
    }

    gamesRecorded[game.gameId] = true;

    const client = await postgresDB.connect();
    await client.query(`
      INSERT INTO players VALUES (DEFAULT, 1, 0, 0, 0, 0, 0, $1) ON CONFLICT (name)
      DO UPDATE SET adaptive_wins = players.adaptive_wins + 1
    `, [game.winner]);

    await client.query(`
      INSERT INTO players VALUES (DEFAULT, 0, 1, 0, 0, 0, 0, $1) ON CONFLICT (name)
      DO UPDATE SET adaptive_losses = players.adaptive_losses + 1
    `, [loser.name]);
    client.release();
};

const recordChainboundGame = async (game) => {
    const winner = game.players.find(player => player.name === game.winner);
    const loser = game.players.find(player => player.name !== game.winner);

    if(!loser || !winner) {
        logger.info('[kip] Skipping chains because player is null', game.players);
        return;
    }

    const winnerDeck = await deckService.getByIdentity(winner.deck);
    const loserDeck = await deckService.getByIdentity(loser.deck);

    if(!loserDeck || !winnerDeck) {
        logger.info('[kip] Skipping chains because deck is null', game.players);
        return;
    }

    gamesRecorded[game.gameId] = true;

    const client = await postgresDB.connect();

    await client.query(`
      INSERT INTO player_decks VALUES (DEFAULT, $1, $2, 1, $3) ON CONFLICT ON CONSTRAINT player_decks_uuid_owner_constraint
      DO UPDATE SET chains = player_decks.chains + 1
    `, [winnerDeck.uuid, game.winner, winnerDeck.name]);

    try {
        await client.query(`
          INSERT INTO player_decks VALUES (DEFAULT, $1, $2, 0, $3) ON CONFLICT ON CONSTRAINT player_decks_uuid_owner_constraint
          DO UPDATE SET chains = player_decks.chains - 1
        `, [loserDeck.uuid, loser.name, loserDeck.name]);
    } catch(e) {

    }

    await client.query(`
      INSERT INTO players VALUES (DEFAULT, 0, 0, 1, 0, 0, 0, $1) ON CONFLICT (name)
      DO UPDATE SET chainbound_wins = players.chainbound_wins + 1
    `, [game.winner]);

    await client.query(`
      INSERT INTO players VALUES (DEFAULT, 0, 0, 0, 1, 0, 0, $1) ON CONFLICT (name)
      DO UPDATE SET chainbound_losses = players.chainbound_losses + 1
    `, [loser.name]);

    client.release();
};

const getChainsForDeckUUID = async (id, owner) => {
    const client = await postgresDB.connect();
    const query = `
      SELECT chains FROM player_decks WHERE uuid = $1 AND owner = $2
    `;
    const response = await client.query(query, [id, owner]);
    client.release();
    return response.rows[0] ? response.rows[0].chains : 0;
};

module.exports = {
    recordGame,
    setup,
    setupAPI: api.setup,
    getChainsForDeckUUID
};
