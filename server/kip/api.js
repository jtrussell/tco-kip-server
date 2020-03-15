const pg = require('pg');
const request = require('request');
const postgresDB = new pg.Pool({
    connectionString: process.env.POSTGRES_CONNECTION_STRING,
    ssl: process.env.NODE_ENV !== 'development'
});

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
};

module.exports = { setup };
