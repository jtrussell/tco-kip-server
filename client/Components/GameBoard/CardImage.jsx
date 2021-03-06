import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { withTranslation } from 'react-i18next';

const Maverick = styled.img`
    z-index: 2;
    position: absolute;
    top: 0;
    left: 0;
    width: 31%;
`;

const MaverickCorner = styled.img`
    z-index: 3;
    position: absolute;
    top: 0;
    right: 0;
    width: 31%;
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
            maverickStyles.width = '23%';

            maverickCornerStyles.transform = 'rotate(90deg)';
            maverickCornerStyles.right = '-2px';
            maverickCornerStyles.bottom = '3px';
            maverickCornerStyles.left = 'initial';
            maverickCornerStyles.top = 'initial';
            maverickCornerStyles.width = '22%';
        }

        if (this.props.className.includes('target-card-image')) {
            maverickStyles.display = 'none';
            maverickCornerStyles.display = 'none';
        }

        let clipPath = 'polygon(0 0, 100% 0, 100% 44%, 88% 54%, 80% 55%, 60% 53%, 34% 53%, 18% 55%, 14% 53%, 12% 53%, 0% 46%)';
        if (this.props.type === 'artifact') {
            clipPath = 'polygon(0px 0px, 100% 0px, 100% 63%, 92% 62%, 82% 59%, 61% 59%, 40% 59%, 16% 59%, 5% 63%, 0px 62%, 0% 46%)';
        }

        return (
            <Fragment>
                { this.props.foil && (
                    <img src={ this.state.src } alt={ this.props.alt } className={ this.props.className + ' foil' } style={{ zIndex: 1, clipPath }}/>
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
