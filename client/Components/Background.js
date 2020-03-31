import React from 'react';

export default ({ color }) => (
    <div style={ {
        zIndex: -1,
        position: 'fixed',
        top: '0px',
        left: '0px',
        bottom: '0px',
        right: '0px',
        backgroundColor: color || 'rgb(246, 249, 253)'
    } }/>
);
