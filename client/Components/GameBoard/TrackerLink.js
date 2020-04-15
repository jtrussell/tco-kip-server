import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    background-color: #aaa;
    position: fixed;
    top: 0;
    right: 50%;
    transform: translate(50%, 0);
    color: #000;
    font-size: 17px;
    display: flex;
    align-items: center;
    user-select: none;
`;

const Button = styled.a`
    width: 145px;
    text-align: center;
    padding: 2px;
    margin: 5px;
    cursor: pointer;
    color: #000;
    background-color: #87AAF2;
    border: 2px solid #000;
    text-decoration: none;
    user-select: none;

    &:hover {
        color: #000;
        text-decoration: none;
    }
`;

const Logo = styled.img`
    width: 40px;
    height: 40px;
    padding: 4px;
`;

const TrackerLink = ({ gameId }) => {
    const [stage, setStage] = useState(1);
    let text = 'View Game Log';

    if(stage < 12) {
        text = `Building game log${'.'.repeat(stage % 4)}`;
        setTimeout(() => {
            setStage(stage + 1);
        }, 500);

        return (
            <Container>
                <Logo src='/img/tracker-icon128.png'/>
                <div style={ { marginRight: '10px' } }>
                    { text }
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <Button target='_blank' href={ `https://www.thecrucibletracker.com/games/${gameId}` }>
                View Game Log
            </Button>
        </Container>
    );
};

export default TrackerLink;
