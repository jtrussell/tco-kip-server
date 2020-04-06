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

        if(!this.props.user.avatar && this.props.hideOnMissingAvatar) {
            return null;
        }

        let icon = this.props.user.avatar || defaultAvatar;

        if (this.props.user.username === 'KiP') {
            icon = '/img/armor.png';
        }

        return (
            <img className={ className } src={ icon } style={{ width: '30px', height: '30px', borderRadius: '15px', boxShadow: 'rgba(0,0,0,0.2) 2px 2px 5px 0px' }} />
        );
    }
}

Avatar.displayName = 'Avatar';

export default Avatar;
