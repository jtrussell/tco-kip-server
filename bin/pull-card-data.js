const monk = require('monk');
const fs = require('fs');

let db = monk(process.env.KIP_DB_URL);

db.get('cards').find({})
    .then(result => {
        fs.writeFileSync('./cards.json', JSON.stringify(result));
    }).catch(err => {
        console.log(err);
    });
