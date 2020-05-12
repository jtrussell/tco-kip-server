import React from 'react';
import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';
import Background from '../Components/Background';
import Link from '../Components/Link';
import colors from '../colors';

const Container = styled.div`
    width: 100%;
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

const LargeImage = styled.img`
    width: 100%;
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
                    <div style={{ textAlign: 'center', marginTop: '0px' }}>
                        <Title>
                            Shadow Worlds 2020 - Day 2
                        </Title>
                        <Title>
                            <Link newTab text='Create Bracket Prediction' url='https://kip.challonge.com/ShadowWorlds2020Day2'/>
                        </Title>
                    </div>
                </div>
                <br/>
                <Image>
                    <a target='_blank' href='https://kip.challonge.com/ShadowWorlds2020Day2'>
                        <LargeImage src='https://crucible-tracker-card-images.s3.amazonaws.com/kip-art.jpg'/>
                    </a>
                </Image>
            </Container>
        );
    }
}

const Wrapper = () => (
    <Lobby isMobile={ useMediaQuery({ maxWidth: 767 }) }/>
);

export default Wrapper;
