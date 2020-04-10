import React from 'react';
import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';
import Background from '../Components/Background';
import Link from '../Components/Link';
import colors from '../colors';

const Container = styled.div`
    max-width: 1000px;
    margin: 50px auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`;

const Blurb = styled.div`
    margin-top: 40px;
`;

const Title = styled.div`
    color: ${(props) => props.color || colors.text} !important;
    font-size: 25px;
    font-weight: 300;
    font-family: 'Open Sans';
`;

const Text = styled.div`
    color: ${colors.text} !important;
    font-size: 20px;
    font-weight: 200;
    font-family: 'Open Sans';
`;

const EventTime = styled.span`
    font-size: 14px;
    margin-left: 15px;
`;

const Image = styled.div`
    position: relative;
    height: 300px;
    overflow: hidden;
    box-shadow: rgba(0, 0, 0, 0.2) 2px 2px 5px 0px;
`;

const Overlay = styled.div`
    position: absolute;
    bottom: 30px;
    left: 0;
    right: 0;
    width: 100%;
    text-align: center;
    color: #FFF;
    padding: 5px;
    font-size: 20px;
`;

const LargeImage = styled.img`
    width: 1000px;
`;

const faq = [{
    question: 'What is KiP Tournaments?',
    answer: 'KiP Tournaments allows you to play KeyForge online. We use this site to host weekly tournaments large and small.',
}, {
    question: 'Are you affiliated with FFG?',
    answer: 'No',
}, {
    question: 'Can I play here if I don\'t participate in tournaments?',
    answer: 'Yes, you can play on this site at anytime.',
}, {
    question: 'Is your code open source?',
    answer: () => (
        <div>
            <span>Yes, you can find our code here: </span>
            <Link url='https://github.com/granttitus/tco-kip-server' text='server code'/>
            <span> and </span>
            <Link url='https://github.com/granttitus/tco-kip-gamenode' text='game code'/>
        </div>
    )
}, {
    question: 'Are you making money?',
    answer: 'No, we lose about $300 a month across KiP and the Crucible Tracker. In the event we turn a profit, that money would be reinvested into the community (e.g. to KeyForge artists, local game stores, better prize support, EU servers).',
}, {
    question: 'Why do this if you lose money?',
    answer: 'Our work is a labor of love and this site is a gift to the KeyForge community.',
}, {
    question: 'Where are your servers located?',
    answer: 'Our servers are on the east coast of the United States.',
}, {
    question: 'How can we contact you?',
    answer: () => (
        <div>
            <span>You can find us in the </span>
            <Link url='https://discord.gg/fauXD9q' text='KiP Discord'/>
            <span> or you can reach us at kiptournaments@gmail.com</span>
        </div>
    )
}];



class FAQ extends React.Component {
    render() {
        return (
            <Container>
                <Background />
                <div>
                    {faq.map(({ question, answer }) => (
                        <div key={question}>
                            <Blurb>
                                <Title color='#6f7d85'>
                                    { question }
                                </Title>
                            </Blurb>
                            <div>
                                <Title>
                                    { typeof answer === 'function' ? answer() : answer }
                                </Title>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        );
    }
}

export default FAQ;
