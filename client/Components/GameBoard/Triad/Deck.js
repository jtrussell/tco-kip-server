import React from 'react';
import styled from 'styled-components';

const Deck = ({ uuid, image, banned }) => {
    return (
        <a
            href={ `https://www.decksofkeyforge.com/decks/${uuid}` }
            target='_blank'
            style={ {
                position: 'relative',
            } }
        >
            { banned && (
                <div
                    style={ {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1,
                    } }
                >
                    <span style={ {
                        backgroundColor: 'rgb(252, 127, 121)',
                        color: '#000',
                        fontSize: '20px',
                        padding: '5px 8px',
                    } }>
                        BANNED
                    </span>
                </div>
            ) }

            <img
                style={ {
                    height: '500px',
                    margin: '0 5px 5px 5px',
                    filter: banned ? 'brightness(0.4)' : '',
                } }
                src={ image }
            />
        </a>
    );
};

export default Deck;
