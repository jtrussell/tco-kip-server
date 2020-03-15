const config = require('config');
const logger = require('../log.js');

class ConfigService {
    getValue(key) {
        if(key === 'dbPath' && process.env.MONGODB_CONNECTION_STRING) {
            return process.env.MONGODB_CONNECTION_STRING;
        }

        if(key === 'secret' && process.env.SECRET) {
            return process.env.SECRET;
        }

        if(key === 'hmacSecret' && process.env.HMAC_SECRET) {
            return process.env.HMAC_SECRET;
        }

        if(!config[key]) {
            logger.warn(`Asked for config value '${key}', but it was not configured`);
        }

        return config[key];
    }

    getValueForSection(section, key) {
        if(key === 'dbPath' && process.env.MONGODB_CONNECTION_STRING) {
            return process.env.MONGODB_CONNECTION_STRING;
        }

        if(key === 'secret' && process.env.SECRET) {
            return process.env.SECRET;
        }

        if(key === 'hmacSecret' && process.env.HMAC_SECRET) {
            return process.env.HMAC_SECRET;
        }

        if(!config[section]) {
            logger.warn(`Asked for config section '${section}', but it was not configured`);
        }

        if(!config[section][key]) {
            logger.warn(`Asked for config value '${key}' from section '${section}', but it was not configured`);
        }

        return config[section][key];
    }
}

module.exports = ConfigService;
