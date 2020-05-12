import React from 'react';
import classNames from 'classnames';
import { defaultAvatar } from './AvatarImages';

class Avatar extends React.Component {

    render() {
        let className = classNames('gravatar', {
            'pull-left': this.props.float
        });

        if(!this.props.user) {
            return null;
        }

        let icon = this.props.user.avatar || defaultAvatar;
        icon = `https://crucible-tracker-card-images.s3.amazonaws.com${icon}`;

        if (this.props.user.username === 'KiP' || this.props.user.username === 'KiP2') {
            icon = `https://crucible-tracker-card-images.s3.amazonaws.com/img/armor.png`;
        }

        if (this.props.user.username === 'Judge1' || this.props.user.username === 'Judge2') {
            icon = `https://crucible-tracker-card-images.s3.amazonaws.com/img/adaptive.png`;
        }

        return (
            <img className={ className } src={ icon } style={{ width: '30px', height: '30px', borderRadius: '15px', boxShadow: 'rgba(0,0,0,0.2) 2px 2px 5px 0px' }} />
        );
    }
}

Avatar.displayName = 'Avatar';

export default Avatar;
