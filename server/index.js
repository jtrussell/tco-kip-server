const Server = require('./server.js');
const Lobby = require('./lobby.js');
const monk = require('monk');
const config = require('config');
const UserService = require('./services/UserService');
const ConfigService = require('./services/ConfigService');
const configService = new ConfigService();

function runServer() {
    let options = { configService: configService, db: monk(process.env.MONGODB_CONNECTION_STRING) };

    options.userService = new UserService(options.db, options.configService);

    let lobby;
    const stateFn = function (req, res) {
        const states = Object.values(lobby.games).map(game => game.getSaveState());
        res.json(states);
    };

    const stateFn2 = function (req, res) {
        res.json(lobby.debugDump());
    };

    let server = new Server(process.env.NODE_ENV !== 'production');
    let httpServer = server.init(options, stateFn, stateFn2);
    lobby = new Lobby(httpServer, options);

    server.run();
}

module.exports = runServer;
