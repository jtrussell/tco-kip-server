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
    font-size: ${(props) => props.fontSize || '25px'};
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
    overflow: hidden;
    box-shadow: rgba(0, 0, 0, 0.2) 2px 2px 5px 0px;
    margin-top: 20px;
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

const FoilAd = styled.a`
    color: #000;
    background-color: #f7d65c;
    font-size: 18px;
    padding: 5px 8px;

    &:hover {
        color: #000;
        background-color: #ffe37a;
    }
`;

const upcomingTournaments = [{
    title: 'Shadow World\'s Last Chance Qualifier - Archon Short Adaptive',
    date: 'Saturday, April 25th',
    time: '12pm EST, 6pm CEST',
    url: 'https://kip.challonge.com/LCQShortAdaptive',
}, {
    title: 'Shadow World\'s Last Chance Qualifier - Solo Archon (Bo1)',
    date: 'Saturday, April 25th',
    time: '8pm EST, 2am CEST',
    url: 'https://kip.challonge.com/LCQSoloArchon',
}]

class Lobby extends React.Component {
    render() {
        const {
            isMobile
        } = this.props;

        return (
            <Container>
                <Background />
                {!isMobile && (<Image>
                    <a href='https://www.facebook.com/groups/kotevent/permalink/891154581314876'>
                        <img src='/img/kote4.png'/>
                    </a>
                </Image>
                )}
                <div style={{ width: '100%', marginTop: isMobile ? '10px' : '40px' }}>
                    <FoilAd href='/foil' className='foil'>
                        OPEN TWO RANDOM FOILS
                    </FoilAd>
                </div>
                <div style={{ width: '100%', marginTop: '0px' }}>
                    <Blurb>
                        <Title color='#6f7d85' fontSize="18px">
                            Upcoming Tournaments
                        </Title>
                    </Blurb>
                    {upcomingTournaments.map((tournament, i) => (
                        <div style={{ marginTop: i === 0 ? '' : '40px' }}>
                            <Title>
                                { tournament.date }
                            </Title>
                            <Text>
                                <Link text={ tournament.title } url={ tournament.url }/>
                                <EventTime>{ tournament.time }</EventTime>
                            </Text>
                        </div>
                    ))}
                    <div style={{ filter: 'brightness(0.5)' }} >
                        <Blurb>
                            <Title color='#6f7d85' fontSize="18px">
                                Past Tournaments
                            </Title>
                        </Blurb>
                        <div>
                            <Title>
                                Saturday and Sunday, April 18th to 19th
                            </Title>
                            <Text>
                                <Link text='$5 True Archon Survival (2 days)' url='https://challonge.com/truesurvival'/>
                                <EventTime>12pm EST, 6pm CEST</EventTime>
                            </Text>
                        </div>
                        <Blurb>
                            <Title>
                                Saturday, April 11th
                            </Title>
                            <Text>
                                <Link text='$5 Adaptive Short Best-of-1 Swiss (16 players)' url='https://challonge.com/ti4iwe5s'/>
                                <EventTime>12pm EST, 6pm CEST</EventTime>
                            </Text>
                        </Blurb>
                        <Blurb>
                            <Title>
                                Friday, April 10th
                            </Title>
                            <Text>
                                <Link text='$5 Adaptive Short Best-of-1 Swiss (16 players)' url='https://challonge.com/8qys6s84'/>
                                <EventTime>12pm EST, 6pm CEST</EventTime>
                            </Text>
                        </Blurb>
                        <Blurb>
                            <Title>
                                Sunday, April 5th
                            </Title>
                            <Text>
                                <Link text='Free Win-A-Box Archon Solo Bo1 Swiss (128 players)' url='https://challonge.com/l2ujd82z'/>
                                <EventTime>12pm EST, 6pm CEST</EventTime>
                            </Text>
                        </Blurb>
                    </div>
                </div>
                <br/>
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
            </Container>
        );
    }
}

const Wrapper = () => (
    <Lobby isMobile={ useMediaQuery({ maxWidth: 767 }) }/>
);

export default Wrapper;
