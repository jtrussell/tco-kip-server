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

const faq = [{
    question: 'Can I pay to foil cards?',
    answer: 'No',
}, {
    question: 'Will you use foil cards to make money?',
    answer: 'No',
}, {
    question: 'Why add foil cards?',
    answer: 'Foil cards add fun flavor to online gameplay. The pursuit of foil cards is meant to entertain and keep you excited about KeyForge.',
}, {
    question: 'How do I foil more cards?',
    answer: 'Foil cards will be earned by playing KeyForge on KiP. We are introducing a new leaderboard system that will, at the end of each month, allow you to unlock foil cards.',
}, {
    question: 'Can I disable foil cards?',
    answer: 'We plan to add a setting that allows you to disable foil effects in case you find them too distracting.',
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
