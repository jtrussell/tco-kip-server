import React from 'react';

export default ({ chains, inline }) => (
    <div style={ {
        position: 'relative',
        display: inline ? 'inline-flex' : 'flex',
        alignItems: 'center',
        width: 'fit-content',
        padding: '0px 5px',
        height: '30px',
        marginLeft: '5px',
        backgroundColor: 'rgba(170, 170, 170, 0.3)'
    } }>
        <div style={ {
            fontSize: '25px',
            color: '#FFF',
            textShadow: '1px 1px black',
            display: 'flex',
            paddingBottom: '2px'
        } }>
            { chains }
        </div>
        <div style={ {
            marginLeft: '2px',
            display: 'flex'
        } }>
            <img style={ { width: '25px' } } src='/img/chains.png'/>
        </div>
    </div>
);
