import React from 'react';
import PropTypes from 'prop-types';
import xyDrag from '../xyDrag';

class ChessClock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playersTimeLeft: {}
        };

        this.interval = setInterval(() => {
            const playerNames = Object.keys(this.state.playersTimeLeft);
            const state = {
                playersTimeLeft: {}
            };

            playerNames.forEach(name => {
                if(!this.props.activePlayer) {
                    console.log('no active player');
                    return;
                }

                if(this.props.activePlayer.name === name) {
                    state.playersTimeLeft[name] = this.state.playersTimeLeft[name] - 1000;
                    console.log(state.playersTimeLeft);
                    return;
                }

                state.playersTimeLeft[name] = this.state.playersTimeLeft[name];
            });

            this.setState(state);
        }, 1000);
        this.containerRef = React.createRef();
        this.handleRef = React.createRef();
    }

    componentDidMount() {
        xyDrag(this.containerRef.current, this.handleRef.current);
    }

    componentWillReceiveProps(props) {
        const state = {
            playersTimeLeft: {}
        };
        Object.values(props.players).forEach(player => {
            state.playersTimeLeft[player.name] = player.clock.timeLeft;
        });
        this.setState(state);
    }

    timeToString(milliseconds) {
        let seconds = milliseconds / 1000;
        let minutes = seconds / 60;

        if(milliseconds < 0) {
            return 'Times up';
        }

        if(minutes < 1) {
            seconds = seconds.toFixed(2);
            return `${seconds} seconds`;
        }

        minutes = minutes.toFixed(0);
        return `${minutes} minutes`;
    }

    render() {
        const {
            players
        } = this.props;

        const clocks = Object.keys(this.state.playersTimeLeft).map(name => {
            return {
                name,
                timeLeft: this.state.playersTimeLeft[name]
            };
        });

        return (
            <div style={ {
                position: 'fixed',
                top: '200px',
                left: '200px',
                width: '150px',
                zIndex: 40
            } } ref={ this.containerRef }
            >
                <div style={ {
                    height: '22px',
                    padding: '3px 0 0 5px',
                    width: '100%',
                    cursor: 'pointer',
                    backgroundColor: '#999',
                    color: '#000',
                    fontSize: '13px'
                } } ref={ this.handleRef }
                >Chess Clock</div>
                { clocks.map(clock => {
                    return (
                        <div style={ {
                            padding: '10px',
                            background: '#1C1C1C',
                            color: '#FFF'
                        } }>
                            <div style={ {
                            } }>
                                { clock.name }
                            </div>
                            <div style={ {
                            } }>
                                { this.timeToString(clock.timeLeft) }
                            </div>
                        </div>
                    );
                }) }
            </div>
        );
    }
}

ChessClock.displayName = 'ChessClock';

export default ChessClock;
