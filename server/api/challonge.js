const passport = require('passport');

const { httpRequest, wrapAsync } = require('../util.js');

module.exports.init = function(server) {
    server.get('/api/challonge/tournaments/:id', wrapAsync(async function(req, res) {
        const tournamentId = req.params.id;

        const participantsURL = `https://api.challonge.com/v1/tournaments/${tournamentId}/participants.json?api_key=${process.env.CHALLONGE_TOKEN}`;
        const participants = await httpRequest(participantsURL);

        const matchesURL = `https://api.challonge.com/v1/tournaments/${tournamentId}/matches.json?api_key=${process.env.CHALLONGE_TOKEN}`;
        const matches = await httpRequest(matchesURL);

        res.send({
            participants: JSON.parse(participants),
            matches: JSON.parse(matches)
        });
    }));
};
