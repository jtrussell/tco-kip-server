const Card = require('../../Card.js');

class HelperBot extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'allow them to play one non-Logos card this turn',
            gameAction: ability.actions.forRemainderOfTurn({
                effect: ability.effects.canPlayNonHouse('logos')
            })
        });
    }
}

HelperBot.id = 'helper-bot';

module.exports = HelperBot;
