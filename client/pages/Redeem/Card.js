import React from 'react';
import styled from 'styled-components';
import getCardImageURL from '../../getCardImageURL';
import Card from '../../Components/GameBoard/Card';

const FoilContainer = styled.div`
    margin: 0 20px 20px 20px;
    margin-top: 80px;
`;

export default ({ name, id, cards, size }) => {
    const imageUrl = getCardImageURL(name);
    const card = Object.assign({
        upgrades: [],
        facedown: false,
        foil: true,
    }, cards[id]);
    return (
        <FoilContainer>
            <Card
                cardBackUrl = { imageUrl }
                canDrag={ false }
                card={ card }
                disableMouseOver
                onClick={ () => {} }
                onMenuItemClick={ () => {} }
                onMouseOut={ () => {} }
                onMouseOver={ () => {} }
                size='giant'
                source='play area'
            />
        </FoilContainer>
    );
};
