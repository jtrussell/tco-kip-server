import React from 'react';
import Cards from './Cards';
import xyDrag from './xyDrag';

class DeckTracker extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            minimized: false
        };
        this.containerRef = React.createRef();
        this.topBarRef = React.createRef();
    }

    componentDidMount() {
        xyDrag(this.containerRef.current, this.topBarRef.current);
    }

    render() {
        const {
            user,
            game
        } = this.props;

        return (
            <div
                style={ {
                    width: '200px',
                    height: 'fit-content',
                    position: 'fixed',
                    top: '10px',
                    right: '650px',
                    zIndex: 999,
                    backgroundColor: '#000'
                } }
                ref={ this.containerRef }
            >
                <div
                    style={ {
                        background: '#999',
                        display: 'flex',
                        flexDirection: 'row'
                    } }
                    ref={ this.topBarRef }
                >
                    <div style={ {
                        marginLeft: '5px',
                        height: '22px',
                        userSelect: 'none',
                        fontSize: '13px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        color: 'black',
                        paddingTop: '3px'
                    } }
                    >
                        Draw Pile
                    </div>
                    <div
                        style={ {
                            color: 'black',
                            position: 'absolute',
                            right: '5px',
                            top: '2px',
                            cursor: 'pointer',
                            userSelect: 'none'
                        } }
                        onClick={ () => this.setState({ minimized: !this.state.minimized }) }
                    >
                        { !this.state.minimized ? '▼' : '▲' }
                    </div>
                </div>
                { !this.state.minimized && <Cards game={ game } user={ user } /> }
            </div>
        );
    }
}

export default DeckTracker;
