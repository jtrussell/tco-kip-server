import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Panel = styled.div`
  margin-top: 50px;
  width: 600px;
  height: 400px;
  background-color: #FAFAFA;
`;

class About extends React.Component {
    render() {
        return (
            <div className='full-height'>
                <Panel>
                    <p>We'd like to extend a special Thanks to Jadiel, cryogen, and the entire TCO team for making this site possible.</p>
                </Panel>
            </div >
        );
    }
}

About.displayName = 'About';

export default About;
