import React from 'react';
import styled from 'styled-components';
import Background from '../../Components/Background';
import Link from '../../Components/Link';
import {
    Title,
    Header,
    Paragraph,
    Line,
    BulletPoints,
    BP,
} from './components';

const Content = styled.div`
    max-width: 800px;
    margin: 40px auto 80px;
`;

class Article extends React.Component {

    render() {
        return (
            <div>
                <Background color='#FFF'/>

                <Content>
                    <Header>
                        In Reponse to TCO
                    </Header>
                    <Paragraph>
                        Hi, Grant here. You may know me as a competitive KeyForge player, as someone who provides commentary at KeyForge tournaments with my friend Erich, or, as is most likely the case, as the creator of The Crucible Tracker and The Crucible Addons. I made these tools because I enjoy programming, analyzing data, and exploring innovative ways to help grow the game I love. I’ve been happy with the general reception the Tracker and Addons have received. Feedback from the community has been greatly appreciated and has helped mold these projects into what they are today.
                    </Paragraph>
                    <Paragraph>
                        Over the last year I’ve come up with ideas as to how to make the online KeyForge experience better for the community (because for a lot of people, including me, that’s the primary - or only - way we can play KeyForge). I pitched ideas to TCO's developers while TCO was closed source and most were rejected - which is fine, because they have a right to run their site as they please. I offered to help them maintain their site and implement new sets to no avail. Without the ability to contribute directly, I did the next best thing, which was to contribute using browser extensions, which limited what I could do and was difficult to manage technically. All the while, the lead developer behind TCO was clear he did not like my work. Stuart publicly joked about deliberately breaking the Crucible Tracker and, in the TCO development channel (of which I am a part of), they mocked my work. It was clear that TCO and I were not a good fit either stylisticaly or vision-wise for the future of the platform.
                    </Paragraph>
                    <Paragraph>
    So I decided to try to do something new. With my friends, I formed a new team called Knowledge is Power (composed of myself, Erich, Jason and Jared). We love analyzing data and uncovering innovative approaches to studying and talking about KeyForge. We created KiP Tournaments as a place where we could bring our ideas about online play to life and as a place where we could give back to the KeyForge community.
                    </Paragraph>
                    <Paragraph>
                        So far, we’ve created a chainbound mode (where decks automatically get a chain added or subtracted based on if they won or lost a game, and start future matches with the number of chains they have earned on-site), and a fully-integrated archon adaptive mode (with code for chain bidding and automatic deck swapping). We hosted our first two tournaments for what we called Adapticon (a tournament with an archon adaptive variant) and had a ton of fun. We are working on a series of chainbound tournaments for the coming weekend (April 4-5) and are looking at hosting a true archon survival tournament to substitute the cancelled Vault Tour Alameda later in April. And, as we’ve previously publicized, we will be holding a substitute Shadow Worlds tournament, around the time of the originally scheduled, but cancelled/postponed, actual IRL KeyForge Worlds tournament in Minnesota.
                    </Paragraph>
                    <Paragraph>
                        It’s important to us that we have control over our own site because now we are free to implement new and different ideas quickly and efficiently. We will, however, make our code available to the public under an AGPL license so if other sites want to copy our ideas, they can. For us this project is a labor of love and innovation and not exclusivity.
                    </Paragraph>
                    <Paragraph>
                        You can find the code that powers KiP Tournaments here:
                        <BulletPoints>
                            <BP>• <Link newTab text='KiP Server' url='https://github.com/granttitus/tco-kip-server'/></BP>
                            <BP>• <Link newTab text='KiP Game Node' url='https://github.com/granttitus/tco-kip-gamenode'/></BP>
                        </BulletPoints>
                    </Paragraph>
                    <Paragraph>
                            We wanted to issue this statement so that people knew where we were coming from. Our intention is to grow, not fragment, the player base for KeyForge online play. Some people will like the direction we are going with our site, and some people won’t - and that’s completely OK! That’s how a community should work: people trying different things and seeing what works. We’re committed to innovation and we hope that people who haven’t been interested or had a desire to play online KeyForge will check out our site and give online KeyForge another chance. If you’re interested in finding out more, come check out the <Link text='KiP Discord' url='https://discord.gg/J7aqmGU' inline newTab/>

                    </Paragraph>
                    <Paragraph>
                        Until next time, happy forging, and see you around!
                    </Paragraph>
                    <Paragraph>
                        Best,
                        <br/>
                        Grant Titus
                    </Paragraph>
                </Content>
            </div>
        );
    }
}

export default Article;
