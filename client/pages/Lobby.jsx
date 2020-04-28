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

const upcomingTournaments = [{
    title: 'Shadow Worlds 2020 - Day 1',
    date: 'Saturday, May 2nd',
    time: '11:00am EDT',
    url: 'https://kip.challonge.com/ShadowWorlds2020',
}]
                    //<Blurb>
                        //<Title color='#6f7d85' fontSize="18px">
                            //Upcoming Tournaments
                        //</Title>
                    //</Blurb>
                    //{upcomingTournaments.map((tournament, i) => (
                        //<div style={{ marginTop: i === 0 ? '' : '40px' }}>
                            //<Title>
                                //{ tournament.date }
                            //</Title>
                            //<Text>
                                //<Link newTab text={ tournament.title } url={ tournament.url }/>
                                //<EventTime>{ tournament.time }</EventTime>
                            //</Text>
                        //</div>
                    //))}

class Lobby extends React.Component {
    render() {
        const {
            isMobile
        } = this.props;

        return (
            <Container>
                <Background />
                <div style={{ width: '100%', marginTop: '0px' }}>
                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <Title>
                            Shadow Worlds 2020 - Day 1
                        </Title>
                        <Title>
                            <Link newTab text='Sign Up Here' url='https://kip.challonge.com/ShadowWorlds2020'/>
                        </Title>
                    </div>
                    <div style={{ filter: 'brightness(0.5)', display: 'none' }} >
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
                                <Link newTab text='True Archon Survival (2 days)' url='https://challonge.com/truesurvival'/>
                                <EventTime>12pm EST, 6pm CEST</EventTime>
                            </Text>
                        </div>
                        <Blurb>
                            <Title>
                                Saturday, April 11th
                            </Title>
                            <Text>
                                <Link newTab text='Adaptive Short Best-of-1 Swiss (16 players)' url='https://challonge.com/ti4iwe5s'/>
                                <EventTime>12pm EST, 6pm CEST</EventTime>
                            </Text>
                        </Blurb>
                        <Blurb>
                            <Title>
                                Friday, April 10th
                            </Title>
                            <Text>
                                <Link newTab text='Adaptive Short Best-of-1 Swiss (16 players)' url='https://challonge.com/8qys6s84'/>
                                <EventTime>12pm EST, 6pm CEST</EventTime>
                            </Text>
                        </Blurb>
                        <Blurb>
                            <Title>
                                Sunday, April 5th
                            </Title>
                            <Text>
                                <Link newTab text='Win-A-Box Archon Solo Bo1 Swiss (128 players)' url='https://challonge.com/l2ujd82z'/>
                                <EventTime>12pm EST, 6pm CEST</EventTime>
                            </Text>
                        </Blurb>
                    </div>
                </div>
                <br/>
                <Image>
                    <a target='_blank' href='https://kip.challonge.com/ShadowWorlds2020'>
                        <LargeImage src='/img/sanctum_bw_wallpaper.jpg'/>
                    </a>
                    <Overlay>
                        <span style={{
                            backgroundColor: 'rgba(0,0,0)',
                            padding: '12px 14px',
                        }}>
                            Shadow Worlds
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
