import React from 'react';
import styled from 'styled-components';
import Background from '../../Components/Background';
import Link from '../../Components/Link';
import colors from '../../colors';

import {
    Title,
    Header,
    Paragraph,
    Line,
    BulletPoints,
    BP,
} from './components';

const FAQText = styled.div`
    color: ${colors.text} !important;
    font-size: 25px;
    font-weight: 300;
    font-family: 'Open Sans';
`;

const FAQTextBlack = styled(FAQText)`
    color: #6f7d85 !important;
`;

const BlueText = styled.span`
    color: #44d0fc;
`;

const Content = styled.div`
    max-width: 860px;
    margin: 20px auto;
    padding-bottom: 70px;
`;

const Img = styled.img`
    user-select: none;
`;

class Article extends React.Component {
    render() {
        return (
            <div>
                <Background color='#1b2326'/>

                <Content>
                    <Header>
                        Our Plan after Shadow Worlds
                    </Header>
                    <Paragraph>
                        We want to thank everyone who participated in making Shadow Worlds a success for the community. It was an ambitious undertaking for our team and we wouldn't have been successful without everyone's encouragement, patience, and participation. Our desire to grow and connect the global online KeyForge community was a key goal of our team since its inception.
                    </Paragraph>
                    <Paragraph>
                        Now that Shadow Worlds is complete, our team has decided to take a step back from running tournaments and to shut down <Link newTab text='kiptournaments.com' url='https://kiptournaments.com'/> and <Link newTab text='thecrucibletracker.com' url='https://www.thecrucibletracker.com'/>. These actions will give us time to focus on other team goals and pursuits.
                    </Paragraph>
                    <Paragraph>
                        While we step back from these projects we do want to encourage the community to carry on with the momentum we created. We are happy to support the current and future innovators in online KeyForge as best we can. We encourage everyone to use our experiences as a reference point and to leverage our open source code.

                    </Paragraph>
                    <Paragraph>
                        These changes will cause disruption in the near term, for which we are sorry. We do look forward to seeing leaders in the community take our place in organizing and operating large scale events. We believe KeyForge has a bright future, due in no small part to the strength of its growing community.
                    </Paragraph>
                    <Paragraph>
                        Until next time,
                        <br/>
                        <br/>
                        Grant Titus
                        <br/>
                        Erich Taylor
                        <br/>
                        Jason Bargender
                        <br/>
                        Jared Kerstetter
                    </Paragraph>
                    <br/>
                    <br/>
                    <br/>
                    <Header>
                        Notable Numbers
                    </Header>
                    <Paragraph>
                        <BulletPoints>
                            <div>• We hosted <BlueText>13 tournaments</BlueText></div>
                            <div>• Our largest multi day event was the <BlueText>225 player</BlueText> Shadow Worlds tournament</div>
                            <div>• Our largest single day event was the <BlueText>128 player</BlueText> Archon Solo tournament</div>
                            <div>• Our longest event was the <BlueText>15 round</BlueText> True Survival tournament</div>
                            <div>• <BlueText>9 countries</BlueText> were represented amongst tournament winners</div>
                            <div>• We had <BlueText>722 accounts</BlueText> in our Discord</div>
                            <div>• The most in-game spectators we saw at once was <BlueText>46</BlueText></div>
                        </BulletPoints>
                    </Paragraph>
                    <br/>
                    <br/>
                    <br/>
                    <Paragraph>
                        <FAQTextBlack>
                            Did FFG or Asmodee force, ask, or advise you to shut down?
                        </FAQTextBlack>
                        <FAQText>
                            No
                        </FAQText>
                        <br/>
                        <FAQTextBlack>
                            When did KiP make the decision to shut down?
                        </FAQTextBlack>
                        <FAQText>
                            On April 28th we made the decision to end KiP Tournaments after Shadow Worlds. At the end of the day, running tournaments was not what we wanted to do long term.
                        </FAQText>
                        <br/>
                        <FAQTextBlack>
                            When are you shutting down KiP Tournaments?
                        </FAQTextBlack>
                        <FAQText>
                            May 12th
                        </FAQText>
                        <br/>
                        <FAQTextBlack>
                            When are you shutting down The Crucible Tracker?
                        </FAQTextBlack>
                        <FAQText>
                            May 17th
                        </FAQText>
                        <br/>
                        <FAQTextBlack>
                            What are you doing with The Crucible Tracker data?
                        </FAQTextBlack>
                        <FAQText>
                            I will be deleting it.
                        </FAQText>
                        <br/>
                        <FAQTextBlack>
                            Are you quitting KeyForge?
                        </FAQTextBlack>
                        <FAQText>
                            No, we love KeyForge and are sticking around.
                        </FAQText>
                        <br/>
                        <FAQTextBlack>
                            Will KiP's source code remain available?
                        </FAQTextBlack>
                        <FAQText>
                            Yes, our code will remain available on GitHub: <Link newTab text='server' url='https://github.com/granttitus/tco-kip-server'/> and <Link newTab text='game' url ='https://github.com/granttitus/tco-kip-gamenode'/> code
                        </FAQText>
                        <br/>
                        <FAQTextBlack>
                            How much money did you make?
                        </FAQTextBlack>
                        <FAQText>
                            I lost $1,623 in total running KiP and The Crucible Tracker. Regrettably, this will disappoint conspiracy theorists.
                        </FAQText>
                        <br/>
                        <FAQTextBlack>
                            Would you continue to run KiP or The Crucible Tracker if money was of no concern?
                        </FAQTextBlack>
                        <FAQText>
                            No
                        </FAQText>
                        <br/>
                    </Paragraph>
                    <br/>
                    <br/>
                    <Paragraph/>
                    <Paragraph>
                        <Img src='/img/twitch.png' style={ { width: '100%', marginTop: '10px' } }/>
                    </Paragraph>
                    <br/>
                    <Paragraph>
                        <Img src='/img/shadow-worlds-twitch.png' style={ { width: '100%', marginTop: '10px' } }/>
                    </Paragraph>
                    <br/>
                    <Paragraph>
                        <Img src='/img/community-tournaments-2.png' style={ { width: '100%', marginTop: '10px' } }/>
                    </Paragraph>
                    <br/>
                    <Paragraph>
                        <Img src='/img/community-tournaments.png' style={ { width: '100%', marginTop: '10px' } }/>
                    </Paragraph>
                    <br/>
                    <Paragraph>
                        <Img src='/img/kip-art.jpg' style={ { width: '100%', marginTop: '10px' } }/>
                    </Paragraph>
                    <Paragraph />
                </Content>
            </div>
        );
    }
}

export default Article;
