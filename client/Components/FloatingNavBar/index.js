import React from 'react';
import Mobile from './MobileNavBar';
import Desktop from './DesktopNavBar';

const Component = ({ isMobile }) => (
    <div>
        { isMobile
            ? <Mobile/>
            : <Desktop/>
        }
    </div>
);

export default Component;
