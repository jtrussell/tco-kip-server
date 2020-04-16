const pg = require('pg');
const request = require('request');
const postgresDB = new pg.Pool({
    connectionString: process.env.POSTGRES_CONNECTION_STRING,
    ssl: process.env.NODE_ENV !== 'development'
});
const monk = require('monk');
const ConfigService = require('../services/ConfigService');
const DeckService = require('../services/DeckService.js');
const { wrapAsync } = require('../util.js');
const configService = new ConfigService();
let db = monk(configService.getValue('dbPath'));
let deckService = new DeckService(db);

const setup = (server) => {
    server.get('/api/status', function (req, res) {
        res.send('Ok');
    });

    server.get('/api/leaderboards/chains', async function (req, res) {
        const client = await postgresDB.connect();
        const query = `
          SELECT uuid, chains, owner, name FROM player_decks ORDER BY chains DESC LIMIT 50
        `;
        const response = await client.query(query);
        client.release();
        res.json(response.rows);
    });

    server.get('/api/leaderboards/adaptive', async function (req, res) {
        const client = await postgresDB.connect();
        const query = `
          SELECT adaptive_wins, name FROM players ORDER BY adaptive_wins DESC LIMIT 50
        `;
        const response = await client.query(query);
        client.release();
        res.json(response.rows.filter(p => p.adaptive_wins > 0));
    });

    server.get('/api/users/:username/track', async function (req, res) {
        const client = await postgresDB.connect();

        // TODO move somewhere else
        await client.query(`
          INSERT INTO players VALUES (DEFAULT, 0, 0, 0, 0, 0, 0, $1) ON CONFLICT (name) DO NOTHING
        `, [req.params.username]);

        const query = `
          SELECT crucile_tracker_enabled FROM players WHERE name = $1
        `;
        const response = await client.query(query, [req.params.username]);
        client.release();

        if(!response.rows[0]) {
            res.json(false);
            return;
        }

        res.json(response.rows[0].crucile_tracker_enabled);
    });

    server.post('/api/users/:username/track', async function (req, res) {
        const client = await postgresDB.connect();
        const query = `
          UPDATE players SET crucile_tracker_enabled = $1 WHERE name = $2
        `;
        const bool = !!req.body.enabled;
        await client.query(query, [bool, req.params.username]);
        client.release();
        res.send('Ok');

        const url = `https://crucibletracker.herokuapp.com/api/users/${req.params.username}/track`;
        request.post(url, {
            json: true,
            body: {
                token: process.env.TRACKER_AUTH_TOKEN,
                enabled: bool
            }
        });
    });

    server.get('/api/users/:username/foils', wrapAsync(async function(req, res) {
        if(!req.params.username || req.params.username === '') {
            return res.status(404).send({ message: 'Player is undefined' });
        }

        const client = await postgresDB.connect();
        const hasFoilQuery = `
          SELECT
            foils.card_id,
            foils.deck_uuid
          FROM
            foils
            LEFT OUTER JOIN players ON (players.id = foils.player_id)
          WHERE
            players.name = $1
        `;
        const hasFoilResponse = await client.query(hasFoilQuery, [req.params.username]);
        client.release();
        res.json({ foils: hasFoilResponse.rows });
    }));

    server.post('/api/decks/:uuid/foils', wrapAsync(async function(req, res) {
        if(!req.params.uuid || req.params.uuid === '') {
            return res.status(404).send({ message: 'No such deck' });
        }

        if(!req.body.playerName || req.body.playerName === '') {
            return res.status(400).send({ message: 'Player is undefined' });
        }

        let deck = await deckService.getByUuid(req.params.uuid);

        if(!deck) {
            return res.status(404).send({ message: 'No such deck' });
        }

        const client = await postgresDB.connect();

        // lazy but effective for now
        await client.query(`
          INSERT INTO players VALUES (DEFAULT, 0, 0, 0, 0, 0, 0, $1) ON CONFLICT (name) DO NOTHING
        `, [req.body.playerName]);

        const hasFoilQuery = `
          SELECT
            foils.card_id,
            players.id
          FROM
            foils
            LEFT OUTER JOIN players ON (players.id = foils.player_id)
          WHERE
            players.name = $1
        `;
        const hasFoilResponse = await client.query(hasFoilQuery, [req.body.playerName]);

        if(hasFoilResponse.rows.length > 0) {
            res.status(400).send('Foil cards have already been redeemed for this user');
            client.release();
            return;
        }

        const playerIdQuery = `
          SELECT
            players.id
          FROM
              players
          WHERE
            players.name = $1
        `;
        const playedIdResponse = await client.query(playerIdQuery, [req.body.playerName]);

        req.body.cards.forEach(async ({ cardId }) => {
            const addFoilQuery = `
              INSERT INTO
                foils
              VALUES
                (DEFAULT, $1, $2, $3, 'linear-hue-0-125')
              ON CONFLICT
                (player_id, card_id, deck_uuid)
              DO NOTHING;
            `;
            await client.query(addFoilQuery, [playedIdResponse.rows[0].id, cardId, req.params.uuid]);
        });

        client.release();
        res.send('Ok');
    }));
};

module.exports = { setup };
