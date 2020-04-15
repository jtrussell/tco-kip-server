import React from 'react';
import styled from 'styled-components';
import Link from './Link';
import colors from '../colors';

const Container = styled.div`
    margin-top: 40px;
    width: 100%;
    color: #000;
    background-color: ${colors.background3};
`;

const Content = styled.div`
    margin: 0 auto;
    padding: 20px 0;
    max-width: 1000px;
    font-size: 14px;
    color: #FFF;
    display: flex;
    justify-content: space-around;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
`;

const Footer = ({ navigate }) => {
    return (
        <Container>
            <Content>
                <Column>
                    <Link text='FAQ' url='/faq' color={ colors.background2 }/>
                    <div style={ { marginTop: '5px' } }>
                        <Link text='The Crucible Tracker' url='https://www.thecrucibletracker.com/' color={ colors.background2 }/>
                    </div>
                    <div style={ { marginTop: '5px' } }>
                        <Link text='KiP Discord' url='https://discord.gg/fauXD9q' color={ colors.background2 }/>
                    </div>
                </Column>
                <Column>
                    <Link text='Server Code' url='https://github.com/granttitus/tco-kip-server' color={ colors.background2 }/>
                    <div style={ { marginTop: '5px' } }>
                        <Link text='Game Code' url='https://github.com/granttitus/tco-kip-gamenode' color={ colors.background2 }/>
                    </div>
                    <div style={ { marginTop: '5px' } }>
                        <Link text='Keyteki' url='https://github.com/keyteki/keyteki' color={ colors.background2 }/>
                    </div>
                </Column>
            </Content>
        </Container>
    );
};

export default Footer;
