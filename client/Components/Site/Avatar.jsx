import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Avatar extends React.Component {
    render() {
        let className = classNames('gravatar', {
            'pull-left': this.props.float
        });

        if(!this.props.username) {
            return null;
        }

        const icons = [
          `/img/house/brobnar.png`,
          `/img/house/dis.png`,
          `/img/house/logos.png`,
          `/img/house/mars.png`,
          `/img/house/saurian.png`,
          `/img/house/sanctum.png`,
          `/img/house/shadows.png`,
          `/img/house/staralliance.png`,
          `/img/house/untamed.png`,
        ];

        const index = this.props.username[0].toLowerCase().charCodeAt() % icons.length | 0;
        let icon = icons[index];

        if (this.props.username === 'KiP') {
            icon = '/img/armor.png';
        }

        return (<img className={ className } src={ icon } style={{ width: '24px' }} />);
    }
}

Avatar.displayName = 'Avatar';
Avatar.propTypes = {
    float: PropTypes.bool,
    username: PropTypes.string
};

export default Avatar;
