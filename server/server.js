const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ConfigService = require('./services/ConfigService');
const passport = require('passport');
const logger = require('./log.js');
const api = require('./api');
const path = require('path');
const http = require('http');
const monk = require('monk');
const passportJwt = require('passport-jwt');

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const UserService = require('./services/UserService.js');
const version = require('../version.js');
const kip = require('./kip');

class Server {
    constructor(isDeveloping) {
        this.configService = new ConfigService();
        let db = monk(this.configService.getValue('dbPath'));
        db.then(() => {
            console.log('Connected to mongodb');
            kip.setup(db);
        });
        this.userService = new UserService(db);
        this.isDeveloping = isDeveloping;
        this.server = http.Server(app);
        this.app = app;
    }

    init(options, stateFn, stateFn2) {
        var opts = {};
        opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
        opts.secretOrKey = this.configService.getValue('secret');

        passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
            this.userService.getUserById(jwtPayload._id).then(user => {
                if(user) {
                    return done(null, user.getWireSafeDetails());
                }

                return done(null, false);
            }).catch(err => {
                return done(err, false);
            });
        }));
        app.use(passport.initialize());

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));

        api.init(app, options);

        app.use(express.static(__dirname + '/../public'));
        app.use(express.static(__dirname + '/../dist'));

        app.get('/state', stateFn);
        app.get('/dump', stateFn2);

        app.get('*', (req, res) => {
            res.status(200).sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
        });

        // Define error middleware last
        app.use(function(err, req, res, next) {
            logger.error(err);

            if(!res.headersSent && req.xhr) {
                return res.status(500).send({ success: false });
            }

            next(err);
        });

        return this.server;
    }

    run() {
        let port = process.env.PORT;

        this.server.listen(port, '0.0.0.0', function onStart(err) {
            if(err) {
                console.log(err);
                logger.error(err);
            }

            logger.info('Listening on port %s.', port);
        });
    }

    serializeUser(user, done) {
        if(user) {
            done(null, user._id);
        }
    }
}

module.exports = Server;
