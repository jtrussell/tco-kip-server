import React from 'react';
import styled from 'styled-components';
import Panel from '../../Components/Site/Panel';
import Background from '../../Components/Background';
import Link from '../../Components/Link';

const Container = styled.div`
    width: 100%;
    margin: 5px;
    padding: 0 5px;
    display: flex;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
`;

const Text = styled.div`
    color: #000;
    font-size: 20px;
`;

const ChainedDeck = ({ rank, name, uuid, chains, player }) => {
    return (
        <Container>
            <Text>
                <div style={ {
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    width: 'fit-content',
                    height: '30px',
                    marginRight: '3px',
                } }>
                    <div style={ {
                        fontSize: '25px',
                        color: '#000',
                        display: 'flex',
                        paddingBottom: '2px'
                    } }>
                        { chains }
                    </div>
                    <div style={ {
                        marginLeft: '2px',
                        display: 'flex'
                    } }>
                        <img style={ { width: '25px' } } src='/img/chains.png'/>
                    </div>
                </div>
                {` for `} 
                <Link inline newTab text={player} url={`https://www.thecrucibletracker.com/users/${player}`}/>
                {` with `} 
                <div style={{ marginLeft: '48px' }}>
                    <Link inline newTab type='secondary' fontSize='20px' text={name} url={`https://www.decksofkeyforge.com/decks/${uuid}`} />
                </div>
            </Text>
        </Container>
    );
};

const Header = styled.div`
    font-size: 30px; 
    color: #000;
    margin: 10px 0 10px 10px;
`;

class Leaderboard extends React.Component {
    constructor() {
        super();

        this.state = {
            chains: [],
            adaptive: [],
        };
    }

    componentDidMount() {
        Promise.all([
            fetch('/api/leaderboards/chains').then(response => response.json()),
            fetch('/api/leaderboards/adaptive').then(response => response.json()),
        ]).then(values => {
            this.setState({
                chains: values[0],
                adaptive: values[1]
            });
        });
    }

    render() {
        return (
            <div>
                <Background/>
                <div className='full-height' style={{
                    maxWidth: '1170px',
                    display: 'flex',
                    margin: '0px auto',
                    flexDirection: 'column',
                }}>
                    <div>
                        <Header>Chain Leaderboard</Header>
                        { this.state.chains.filter(d => d.chains > 0).map((deck, i) => <ChainedDeck rank={i + 1} name={ deck.name } uuid={deck.uuid} chains={ deck.chains } player={ deck.owner }/>) }
                    </div>
                    <div>
                        <Header>Adaptive Leaderboard</Header>
                        { this.state.adaptive.filter(r => r.adaptive_wins > 0).map((result, i) => (
                            <Container>
                                <Text>
                                    {`${i + 1}. `}
                                    <Link inline newTab text={result.name} url={`https://www.thecrucibletracker.com/users/${result.name}`}/>
                                    {` has ${result.adaptive_wins} win${result.adaptive_wins === 1 ? '' : 's'}`}
                                </Text>
                            </Container>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default Leaderboard;
