import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
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
    align-items: center;
`;

const Title = styled.div`
    color: ${(props) => props.color || colors.text} !important;
    font-size: 25px;
    font-weight: 300;
    font-family: 'Open Sans';
    margin-bottom: 20px;
`;

const Input = styled.input`
    padding: 5px 8px;
    width: 400px;
    border: unset;
    font-size: 14px;
    border-radius: 2px;
    box-shadow: 2px 2px 5px 0px rgba(0,0,0,0.2);
    margin: 10px 0;
    color: #000;
`;

const Select = styled.select`
    height: 30px;
    width: 400px;
    font-size: 14px;
    margin: 10px 0;
    color: #000;
`;

const ButtonContainer = styled.div`
    padding: 7px 10px;
    margin: 10px 0;
    letter-spacing: 1.1px;
    cursor: pointer;
    color: ${colors.background};
    background-color: ${(props) => props.backgroundColor};
    border-radius: 3px;
`;

const Button = ({ onClick, children, disabled }) => {

    const _onClick = () => {
        if (disabled)
            return;
        onClick();
    };

    return (
        <ButtonContainer onClick={ _onClick } backgroundColor={ disabled ? colors.urlDisabled : colors.url }>
            { children }
        </ButtonContainer>
    );
};


class Tournaments extends React.Component {

    constructor(props) {
        super(props);
        this.challongeRef = React.createRef();
        this.gameTypeRef = React.createRef();
        this.passwordRef = React.createRef();

        this.state = {
            creating: false,
        };
    }

    async onCreate() {
        this.setState({ creating: true });

        const challongeId = this.challongeRef.current.value;
        const gameType = this.gameTypeRef.current.value;
        const password = this.passwordRef.current.value || '';

        if (!challongeId) {
            alert('Challonge ID cannot be empty');
            this.setState({ creating: false });
            return;
        }

        const tournament = await fetch(`/api/challonge/tournaments/${challongeId}`).then(response => response.json());
        const tables = tournament.matches
            .filter(({ match }) => match.state === 'open')
            .map(({ match }) => {
                const playerA = tournament.participants.find(({ participant }) => participant.id === match.player1_id);
                const playerB = tournament.participants.find(({ participant }) => participant.id === match.player2_id);
                    //label: `${playerA.participant.name} v. ${playerB.participant.name} (table ${match.suggested_play_order})`,
                return {
                    label: `Table ${match.suggested_play_order} - ${playerA.participant.name} v. ${playerB.participant.name}`,
                    table: match.suggested_play_order,
                    playerA: playerA.participant.name,
                    playerB: playerB.participant.name,
                }
            });

        const openMatches = tournament.matches.filter(({ match }) => match.state === 'open');
        const openMatch = openMatches[0];
        if (!openMatch) {
            alert('The tournament has no open matches');
            this.setState({ creating: false });
            return;
        }

        const round = openMatch.match.round;
        const confirmationMessage = `Create ${openMatches.length} tables for round ${round}?`;

        if (!confirm(confirmationMessage)) {
            this.setState({ creating: false });
            return;
        }

        tables.reverse().forEach((table, i) => {
            setTimeout(() => {
                this.props.socket.emit('newgame', {
                    tournamentId: challongeId,
                    name: table.label,
                    spectators: true,
                    showHand: false,
                    gameType,
                    gameFormat: 'normal',
                    adaptiveData: {
                        match: 1,
                        records: []
                    },
                    password,
                    quickJoin: false,
                    muteSpectators: false,
                    expansions: { cota: true, aoa: true, wc: true },
                    useChessClock: false,
                    gameTimeLimit: 35,
                });
            }, i * 10);
        });
    }

    render() {
        const {
            isMobile
        } = this.props;

        return (
            <Container>
                <Background />
                <div>
                    <div style={{
                        marginTop: '40px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                    }}>
                        <Title>
                            Create Tables
                        </Title>
                        <Input ref={ this.challongeRef } placeholder='Challonge ID'/>
                        <Select ref={ this.gameTypeRef }>
                            <option disabled value=''>Game Variant</option>
                            <option value='freeplay'>Free Play</option>
                            <option value='adaptive'>Adaptive</option>
                            <option value='adaptiveShort'>Adaptive Short</option>
                            <option value='chainbound'>Chainbound</option>
                        </Select>
                        <Input ref={ this.passwordRef } placeholder='Password'/>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            width: '100%',
                        }}>
                            <Button onClick={ this.onCreate.bind(this) } disabled={ this.state.creating }> { this.state.creating ? 'Creating' : 'Create' }</Button>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        games: state.lobby.games,
        socket: state.lobby.socket,
    };
}

export default connect(mapStateToProps, actions)(Tournaments);
