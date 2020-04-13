import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { withTranslation } from 'react-i18next';

const Maverick = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 27px;
`;

const MaverickCorner = styled.img`
    position: absolute;
    top: 0;
    right: 0;
    width: 27px;
`;

class CardImage extends Component {
    constructor() {
        super();
        this.state = {
            src: '',
            err: ''
        };
    }

    componentDidMount() {
        this.updateImage();
    }

    componentDidUpdate(prevProps) {
        if((this.props.img !== prevProps.img) || (this.props.language !== prevProps.language)) {
            this.updateImage();
        }
    }

    updateImage() {
        let { img, maverick, anomaly, amber, i18n } = this.props;

        if(!this.props.img) {
            return;
        }

        let langToUse = this.props.language ? this.props.language : i18n.language;
        let imgPath = (langToUse === 'en') ? img : img.replace('/cards/', '/cards/' + langToUse + '/');
        this.setState({ src: imgPath });
    }

    render() {
        const maverickStyles = {};
        const maverickCornerStyles = {};
        if (this.props.className.includes('exhausted')) {
            maverickStyles.transform = 'rotate(90deg)';
            maverickStyles.top = '-1px';
            maverickStyles.right = '-2px';
            maverickStyles.left = 'initial';

            maverickCornerStyles.transform = 'rotate(90deg)';
            maverickCornerStyles.right = '-2px';
            maverickCornerStyles.bottom = '3px';
            maverickCornerStyles.left = 'initial';
            maverickCornerStyles.top = 'initial';
        }

        return (
            <Fragment>
                { this.props.foil && (
                    <img src={ this.state.src } alt={ this.props.alt } className={ this.props.className + ' foil' } style={{ zIndex: 1, clipPath: 'inset(0 0 47% 0)' }}/>
                )}
                <img src={ this.state.src } alt={ this.props.alt } className={ this.props.className } />
                {this.props.maverick && <Maverick style={maverickStyles} src={ `/img/maverick/maverick-${this.props.maverick}${this.props.amber > 0 ? '-amber' : ''}.png`}/>}
                {(this.props.maverick && !this.props.anomaly) && <MaverickCorner style={maverickCornerStyles} src={ `/img/maverick/maverick-corner.png`}/>}
                {this.props.anomaly && <Maverick style={maverickStyles} src={ `/img/maverick/maverick-${this.props.anomaly}${this.props.amber > 0 ? '-amber' : ''}.png`}/>}
                { this.state.err && <p>{ this.state.err } </p> }
            </Fragment>
        );
    }
}

CardImage.propTypes = {
    alt: PropTypes.string,
    amber: PropTypes.number,
    anomaly: PropTypes.string,
    className: PropTypes.string,
    i18n: PropTypes.object,
    img: PropTypes.string.isRequired,
    language: PropTypes.string,
    maverick: PropTypes.string
};

export default withTranslation()(CardImage);
