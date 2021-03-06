export default (deck, cards) => {
    if(!cards || !deck.houses) {
        deck.status = {};
        deck.cards = [];
        return;
    }

    deck.cards = deck.cards.map(card => {
        let result = {
            count: card.count,
            foil: card.foil,
            card: Object.assign({}, cards[card.id]),
            id: card.id,
            maverick: card.maverick,
            anomaly: card.anomaly,
            house: card.card.house
        };

        result.card.image = card.id;
        if(card.maverick) {
            result.card.house = card.maverick;
        } else if(card.anomaly) {
            result.card.house = card.anomaly;
        }

        return result;
    });

    if(deck.cards.length < 36) {
        const newCards = [];
        deck.cards.forEach((card) => {
            for(let i = 0; i < card.count; i++) {
                newCards.push(card);
            }
        });
        deck.cards = newCards;
    }

    deck.status = {
        basicRules: true,
        flagged: !!deck.flagged,
        verified: !!deck.verified,
        usageLevel: deck.usageLevel,
        noUnreleasedCards: true,
        officialRole: true,
        extendedStatus: []
    };
    return deck;
};
