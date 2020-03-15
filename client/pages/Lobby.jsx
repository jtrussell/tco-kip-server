import React from 'react';
import PropTypes from 'prop-types';
import { useMediaQuery, } from 'react-responsive';
import styled from 'styled-components';
import Background from '../Components/Background';

const ContainerRow = styled.div`
    display: flex;
    flex-direction: row;
`;

const ContainerColumn = styled.div`
    display: flex;
    flex-direction: column;
`;

const Image = styled.div`
    position: relative;
    height: 600px;
    overflow: hidden;
    box-shadow: rgba(0, 0, 0, 0.2) 2px 2px 5px 0px;
`;

const Overlay = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    color: #FFF;
    font-size: 1.6em;
    padding: 15px;
    background-color: rgba(0, 0, 0, 0.8);
`;

const LargeImage = styled.img`
    width: 1200px;
    margin-left: -400px;
`;

const Blurb = styled.div`
    margin-top: 40px;
`;

const Title = styled.div`
    color: #000 !important;
    font-size: 2em;
    font-weight: 700;
    font-family: 'Open Sans';
`;

const Text = styled.div`
    color: #222 !important;
    font-size: 1.6em;
    font-weight: 200;
    font-family: 'Open Sans';
`;

const SecondaryNews = styled.div`
    position: relative;
    flex-grow: 1;
    padding: 5px;
`;

const TrackerLogo = styled.div`
    width: 42px;
    height: 42px;
    display: inline-block;
    margin-left: -5px;
`

const Challonge = styled.div`
    width: 100%;
    margin-top: 20px;
`;

const ChallongeBracket = styled.div`
    width: 100%;
    height: 600px;
`;

const ChallongeHeader = styled.div`
    background-color: #272a33;
    padding: 10px 15px 0 15px;
    font-size: 2em;
    color: #FFF;
`;

class Lobby extends React.Component {

    render() {
        const {
            isMobile,
        } = this.props;

        const MainContainer = isMobile ? ContainerColumn : ContainerRow;

        return (
            <ContainerColumn>
                <Background />
                <MainContainer>
                    <SecondaryNews>
                        <div>
                            <Title>
                                Online Tournaments
                            </Title>
                            <Text>
                                <a href="https://www.kipgaming.com" style={{ display: 'inline-block', color: 'rgb(0, 0, 238)' }}>
                                    KiP
                                </a>
                                {` uses this site to host KeyForge regular tournaments.`}
                            </Text>
                        </div>
                        <Blurb>
                            <Title>
                                Global Chainbound
                            </Title>
                            <Text>
                                {` Wins on this server award your deck chains. See how high you can climb on the chain leaderboard!`}
                            </Text>
                        </Blurb>
                        <Blurb>
                            <Title>
                                Our Discord
                            </Title>
                            <Text>
                                {`Join the `}
                                <a href="https://discord.gg/fauXD9q" style={{ display: 'inline-block', color: 'rgb(0, 0, 238)' }}>
                                    KiP Discord
                                </a>
                                {` to stay up to date with our latest news.`}
                            </Text>
                        </Blurb>
                        <Blurb>
                            <Title>
                                <div style={{ display: 'flex' }}>
                                    <TrackerLogo>
                                        <img src='/img/tracker-icon128.png' style={{ transformOrigin: 'top left', transform: 'scale(0.3)' }}/>
                                    </TrackerLogo>
                                    The Crucible Tracker
                                </div>
                            </Title>
                            <Text>
                                {` Our platform has a native integration with `}
                                <a href="https://www.thecrucibletracker.com" style={{ display: 'inline-block', color: 'rgb(0, 0, 238)' }}>
                                    {isMobile ? 'The' : 'The'} Crucible Tracker
                                </a>
                                {`. You can opt-out of tracking at any time by visiting your profile page on this site.`}
                            </Text>
                        </Blurb>
                    </SecondaryNews>
                    <Image>
                        <LargeImage src="/img/sanctum_bw_wallpaper.jpg"/>
                        <Overlay>
                            Shadow Worlds — May 2nd 
                        </Overlay>
                    </Image>
                </MainContainer>
                {!isMobile && <Challonge>
                        <ChallongeHeader>
                            Adapticon Win-A-Box 2 won by jfilipeg
                        </ChallongeHeader>
                        <ChallongeBracket>
                            <iframe
                                src="https://challonge.com/KiPAdaptive2/module"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="auto"
                                allowTransparency="true"
                            />
                        </ChallongeBracket>
                    </Challonge>
                }
            </ContainerColumn>
        );
    }
}

const Wrapper = () => (
  <Lobby isMobile={useMediaQuery({ maxWidth: 767, })}/>
);

export default Wrapper;
