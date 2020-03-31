import React from 'react';
import { useMediaQuery } from 'react-responsive';
import Mobile from './Mobile';
import Desktop from './Desktop';

const Component = (context) => (
    <div>
        { useMediaQuery({ maxWidth: 767 })
            ? <Mobile/>
            : <Desktop/> }
    </div>
);

export default Component;
