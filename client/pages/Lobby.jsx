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

const TrackerLogo = styled.div`
    width: 42px;
    height: 42px;
    display: inline-block;
    margin-left: -5px;
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

class Lobby extends React.Component {
    render() {
        const {
            isMobile
        } = this.props;

        return (
            <Container>
                <Background />
                <Image>
                    <LargeImage src='/img/sanctum_bw_wallpaper.jpg'/>
                    <Overlay>
                        <span style={{
                            backgroundColor: 'rgba(0,0,0)',
                            padding: '12px 14px',
                        }}>
                            Shadow Worlds — Early May
                        </span>
                    </Overlay>
                </Image>
                <div>
                    <div style={{
                        marginTop: '40px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                    }}>
                        <Title>
                            Online KeyForge Tournaments
                        </Title>
                        <Text>
                            <Link newTab url='https://discord.gg/fauXD9q' text='KiP Discord'/>
                        </Text>
                    </div>
                    <Blurb>
                        <Title color='#6f7d85'>
                            Upcoming
                        </Title>
                    </Blurb>
                    <div>
                        <Title>
                            Sunday, April 10th
                        </Title>
                        <Text>
                            <Link text='$5 Adaptive Short Best-of-1 Swiss (16 players)' url='https://challonge.com/8qys6s84'/>
                            <EventTime>12pm EST, 6pm CEST</EventTime>
                        </Text>
                    </div>
                    <Blurb>
                        <Title>
                            Sunday, April 11th
                        </Title>
                        <Text>
                            <Link text='$5 Adaptive Short Best-of-1 Swiss (16 players)' url='https://challonge.com/ti4iwe5s'/>
                            <EventTime>12pm EST, 6pm CEST</EventTime>
                        </Text>
                    </Blurb>
                    <Blurb>
                        <Title color='#6f7d85'>
                            Past Events
                        </Title>
                    </Blurb>
                    <div>
                        <Title>
                            Sunday, April 5th
                        </Title>
                        <Text>
                            <Link text='Free Win-A-Box Archon Solo Bo1 Swiss (128 players)' url='https://challonge.com/l2ujd82z'/>
                            <EventTime>12pm EST, 6pm CEST</EventTime>
                        </Text>
                    </div>
                    <Blurb>
                        <Title>
                            Saturday, April 4th
                        </Title>
                        <Text>
                            <Link text='$5 Archon Solo Bo1 Swiss (16 players)' url='https://challonge.com/ig2xxxr5'/>
                            <EventTime>12pm EST, 6pm CEST</EventTime>
                        </Text>
                        <Text>
                            <Link text='$5 Archon Solo Bo1 Swiss (16 players)' url='https://challonge.com/odbjswmw'/>
                            <EventTime>8PM EST, 2AM CEST</EventTime>
                        </Text>
                    </Blurb>
                    <Blurb>
                        <Title>
                            Friday, April 3rd
                        </Title>
                        <Text>
                            <Link text='$5 Archon Solo Bo1 Swiss (16 players)' url='https://challonge.com/8fs4vmt9'/>
                            <EventTime>12pm EST, 6pm CEST</EventTime>
                        </Text>
                        <Text>
                            <Link text='$5 Archon Solo Bo1 Swiss (16 players)' url='https://challonge.com/3rv1y1s0'/>
                            <EventTime>8PM EST, 2AM CEST</EventTime>
                        </Text>
                    </Blurb>
                </div>
            </Container>
        );
    }
}

//<Blurb>
//<Title>
//Our Discord
//</Title>
//<Text>
//</Text>
//</Blurb>
//<Blurb>
//<Title>
//<div style={{ display: 'flex' }}>
//<TrackerLogo>
//<img src='/img/tracker-icon128.png' style={{ transformOrigin: 'top left', transform: 'scale(0.3)' }}/>
//</TrackerLogo>
//The Crucible Tracker
//</div>
//</Title>
//<Text>
//{` Our platform has a native integration with `}
//<a href="https://www.thecrucibletracker.com" style={{ display: 'inline-block', color: 'rgb(0, 0, 238)' }}>
//{isMobile ? 'The' : 'The'} Crucible Tracker
//</a>
//{`. You can opt-out of tracking at any time by visiting your profile page on this site.`}
//</Text>
//</Blurb>

const Wrapper = () => (
    <Lobby isMobile={ useMediaQuery({ maxWidth: 767 }) }/>
);

export default Wrapper;
