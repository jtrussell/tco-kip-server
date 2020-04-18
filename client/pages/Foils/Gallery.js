import React, { Fragment } from 'react';
import Link from '../../Components/Link';
import styled from 'styled-components';
import colors from '../../colors';
import FoilCard from './Card';

const Header = styled.div`
    margin: 20px 10px;
    display: flex;
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
`;

const Foils = styled.div`
    margin-top: 30px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
`;

class Gallery extends React.Component {
    render() {
        if(!this.props.cards || !Object.keys(this.props.cards)) {
            return null;
        }

        const foils = this.props.foils
            .sort((a, b) => {
                const cardA = this.props.cards[a.card_id];
                const cardB = this.props.cards[b.card_id];

                if(cardA.house < cardB.house) {
                    return -1;
                } else if(cardA.house > cardB.house) {
                    return 1;
                }

                return cardA.name.localeCompare(cardB.name);
            })
            .map((foil, i) => {
                return (
                    <FoilCard
                        key={ i + foil.card_id }
                        id={ foil.card_id }
                        name={ this.props.cards[foil.card_id].name }
                        cards={ this.props.cards }
                    />
                );
            });

        return (
            <div>
                <Header>
                    <div style={ {
                        fontSize: '30px',
                        color: '#FFF',
                    } }>
                        Your Foils
                    </div>
                    <div>
                        <button
                            style={ {
                                width: '144px',
                                backgroundSize: '144px 32px',
                            } }
                            className='btn btn-default foil'
                            onClick={ () => window.location.replace('/redeem') }
                        >
                            Redeem Foils
                        </button>
                        <button
                            style={ {
                                width: '144px',
                                marginLeft: '20px',
                                backgroundSize: '144px 32px',
                            } }
                            className='btn btn-primary'
                            onClick={ () => this.props.navigate('/faq-foils') }
                        >
                            FAQ
                        </button>
                    </div>
                </Header>
                <Foils>
                    { foils.length ? foils : <div style={ { marginTop: '20px' } }>There's nothing here...</div> }
                </Foils>
            </div>
        );
    }
}

export default Gallery;
