import React from 'react';
import styled from 'styled-components';
import getCardImageURL from '../../getCardImageURL';
import Card from '../../Components/GameBoard/Card';

const FoilContainer = styled.div`
    margin: 5px;
`;

export default ({ name, id, cards }) => {
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
                size='x-large'
                source='play area'
            />
        </FoilContainer>
    );
};
