import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { Constants } from '../constants';
import AlertPanel from '../Components/Site/AlertPanel';
import Input from '../Components/Form/Input';
import Checkbox from '../Components/Form/Checkbox';
import CardSizeOption from '../Components/Profile/CardSizeOption';
import GameBackgroundOption from '../Components/Profile/GameBackgroundOption';
import { avatars } from '../Components/Site/AvatarImages';
import * as actions from '../actions';
import { withTranslation, Trans } from 'react-i18next';
import kip from '../kip';
import Background from '../Components/Background';
import colors from '../colors';

const Avatar = styled.div`
    width: 40px;
    height: 40px;
    margin: 10px;
    padding: 10px;
    cursor: pointer;
`;

const AvatarImg = styled.img`
    width: 30px;
    height: 30px;
    border-radius: 15px;
    margin: -5px;
    box-shadow: rgba(0, 0, 0, 0.3) 1px 1px 5px 0
`;

const Panel = ({ title, children }) => (
    <div style={{
        padding: '30px',
        margin: '20px',
        color: colors.text,
        fontWeight: 'normal',
    }}>
        <div style={{
            fontSize: '26px',
            fontWeight: '300',
        }}>{title}</div>
        {children}
    </div>
);

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.handleSelectBackground = this.handleSelectBackground.bind(this);
        this.handleSelectCardSize = this.handleSelectCardSize.bind(this);
        this.onUpdateAvatarClick = this.onUpdateAvatarClick.bind(this);

        let localBackgroundUrl = '';
        try {
            localBackgroundUrl = localStorage.getItem('localBackgroundUrl');
        } catch (e) {
            console.log(e);
        }

        this.state = {
            email: '',
            newPassword: '',
            newPasswordAgain: '',
            localBackgroundUrl,
            validation: {},
            optionSettings: {},
            crucibleTrackerEnabled: false,
        };
    }

    componentDidMount() {
        this.updateProfile(this.props);

        if(!this.props.user) {
            return;
        }

        kip
            .isCrucibleTrackerEnabledForAccount(this.props.user.username)
            .then(bool => {
                this.setState({ crucibleTrackerEnabled: bool });
            });

    }

    componentWillReceiveProps(props) {
        if(!props.user) {
            return;
        }

        kip
            .isCrucibleTrackerEnabledForAccount(props.user.username)
            .then(bool => {
                this.setState({ crucibleTrackerEnabled: bool });
            });

        // If we haven't previously got any user details, then the api probably just returned now, so set the initial user details
        if(!this.state.promptedActionWindows) {
            this.updateProfile(props);
        }

        if(props.profileSaved) {
            this.setState({
                successMessage: 'Profile saved successfully.  Please note settings changed here may only apply at the start of your next game.'
            });

            this.updateProfile(props);

            setTimeout(() => {
                this.setState({ successMessage: undefined });
                kip
                    .isCrucibleTrackerEnabledForAccount(props.user.username)
                    .then(bool => {
                        this.setState({ crucibleTrackerEnabled: bool });
                    });
            }, 5000);
        }
    }

    translate(label) {
        let labelLocalized = this.props.t(label);
        return labelLocalized[0].toUpperCase() + labelLocalized.slice(1);
    }

    updateProfile(props) {
        if(!props.user) {
            return;
        }

        this.setState({
            email: props.user.email,
            selectedBackground: props.user.settings.background,
            selectedCardSize: props.user.settings.cardSize,
            optionSettings: props.user.settings.optionSettings,
            avatar: props.user.avatar,
        });
    }

    onChange(field, event) {
        let newState = {};

        newState[field] = event.target.value;
        this.setState(newState);

        if (field === 'localBackgroundUrl' ) {
            try {
                localStorage.setItem('localBackgroundUrl', event.target.value);
            } catch (e) {
                console.log(e);
            }
        }
    }

    onToggle(field, event) {
        let newState = {};

        newState[field] = event.target.checked;
        this.setState(newState);
    }

    onOptionSettingToggle(field, event) {
        let newState = {};

        newState.optionSettings = this.state.optionSettings;
        newState.optionSettings[field] = event.target.checked;

        this.setState(newState);
    }

    onSaveClick(event) {
        event.preventDefault();

        this.setState({ errorMessage: undefined, successMessage: undefined });

        this.verifyEmail();
        this.verifyPassword(true);

        document.getElementsByClassName('wrapper')[0].scrollTop = 0;

        if(Object.values(this.state.validation).some(message => {
            return message && message !== '';
        })) {
            this.setState({ errorMessage: 'There was an error in one or more fields, please see below, correct the error and try again' });
            return;
        }

        kip.setCrucibleTrackerEnabledForAccount(this.props.user.username, this.state.crucibleTrackerEnabled);

        this.props.saveProfile(this.props.user.username, {
            email: this.state.email,
            password: this.state.newPassword,
            avatar: this.state.avatar,
            settings: {
                background: this.state.selectedBackground,
                cardSize: this.state.selectedCardSize,
                optionSettings: this.state.optionSettings
            }
        });
    }

    verifyPassword(isSubmitting) {
        let validation = this.state.validation;

        delete validation['password'];

        if(!this.state.newPassword && !this.state.newPasswordAgain) {
            return;
        }

        if(this.state.newPassword.length < 6) {
            validation['password'] = 'The password you specify must be at least 6 characters long';
        }

        if(isSubmitting && !this.state.newPasswordAgain) {
            validation['password'] = 'Please enter your password again';
        }

        if(this.state.newPassword && this.state.newPasswordAgain && this.state.newPassword !== this.state.newPasswordAgain) {
            validation['password'] = 'The passwords you have specified do not match';
        }

        this.setState({ validation: validation });
    }

    verifyEmail() {
        let validation = this.state.validation;

        delete validation['email'];

        if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(this.state.email)) {
            validation['email'] = 'Please enter a valid email address';
        }

        this.setState({ validation: validation });
    }

    handleSelectBackground(background) {
        this.setState({ selectedBackground: background });
    }

    handleSelectCardSize(size) {
        this.setState({ selectedCardSize: size });
    }

    onUpdateAvatarClick(event) {
        event.preventDefault();

        this.props.updateAvatar(this.props.user.username);
    }

    render() {
        let t = this.props.t;

        if(!this.props.user) {
            return <div style={{ margin: '40px auto', maxWidth: '800px' }}>
                <AlertPanel type='error' message={ t('You must be logged in to update your profile') } />
            </div>;
        }

        let successBar;
        if(this.props.profileSaved) {
            setTimeout(() => {
                this.props.clearProfileStatus();
            }, 5000);
            successBar = <AlertPanel type='success' message={ t('Profile saved successfully.  Please note settings changed here may only apply at the start of your next game.') } />;
        }

        let errorBar = this.props.apiSuccess === false ? <AlertPanel type='error' message={ t(this.props.apiMessage) } /> : null;

        let backgrounds = [
            { name: 'none', label: this.translate('none'), imageUrl: 'img/bgs/blank.png' }
        ];

        for(let i = 0; i < Constants.Houses.length; ++i) {
            backgrounds.push({ name: Constants.HousesNames[i], label: this.translate(Constants.Houses[i]), imageUrl: `img/bgs/${Constants.Houses[i]}.png` });
        }

        let cardSizes = [
            { name: 'small', label: this.translate('small') },
            { name: 'normal', label: this.translate('normal') },
            { name: 'large', label: this.translate('large') },
            { name: 'x-large', label: this.translate('extra-large') }
        ];

        return (
            <div style={{ maxWidth: '1000px', margin: '60px auto 30px' }}>
                <Background/>
                <div className='about-container'>
                    { errorBar }
                    { successBar }
                    <div className='col-sm-offset-10 col-sm-2'>
                        <button className='btn btn-primary' type='button' disabled={ this.props.apiLoading } onClick={ this.onSaveClick.bind(this) }>
                            <Trans>Save Changes</Trans>{ this.props.apiLoading ? <span className='spinner button-spinner' /> : null }
                        </button>
                    </div>
                    <form className='form form-horizontal'>
                        <Panel title={ t('Profile') }>
                            <Input name='email' label={ t('Email Address') } labelClass='col-sm-4' fieldClass='col-sm-8' placeholder={ t('Enter email address') }
                                type='text' onChange={ this.onChange.bind(this, 'email') } value={ this.state.email }
                                onBlur={ this.verifyEmail.bind(this) } validationMessage={ this.state.validation['email'] } />
                            <Input name='newPassword' label={ t('New Password') } labelClass='col-sm-4' fieldClass='col-sm-8' placeholder={ t('Enter new password') }
                                type='password' onChange={ this.onChange.bind(this, 'newPassword') } value={ this.state.newPassword }
                                onBlur={ this.verifyPassword.bind(this, false) } validationMessage={ this.state.validation['password'] } />
                            <Input name='newPasswordAgain' label={ t('New Password (again)') } labelClass='col-sm-4' fieldClass='col-sm-8' placeholder={ t('Enter new password (again)') }
                                type='password' onChange={ this.onChange.bind(this, 'newPasswordAgain') } value={ this.state.newPasswordAgain }
                                onBlur={ this.verifyPassword.bind(this, false) } validationMessage={ this.state.validation['password1'] } />
                            <div style={{ float: 'right', marginRight: '20px' }}>
                                <Checkbox name='crucibleTrackerEnabled' label='Track games using The Crucible Tracker'
                                    onChange={ e => this.setState({ crucibleTrackerEnabled: e.target.checked }) } checked={ this.state.crucibleTrackerEnabled }/>
                            </div>
                        </Panel>
                        <div>
                            <Panel title='Avatar'>
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {
                                        avatars.map(avatarUrl => (
                                            <Avatar
                                                onClick={() => this.setState({ avatar: avatarUrl })}
                                                style={avatarUrl == this.state.avatar ? { background: '#555' } : {}}
                                            >
                                                <AvatarImg style={avatarUrl.includes('house') ? { boxShadow: 'none' } : {}} src={avatarUrl} />
                                            </Avatar>
                                        ))
                                    }
                                </div>
                            </Panel>
                        </div>
                        <div>
                            <Panel title={ t('Game Board Background') }>
                                <div style={{ display: 'flex', overflowX: 'scroll', padding: '10px 0' }}>
                                    {
                                        backgrounds.map(background => (
                                            <GameBackgroundOption
                                                imageUrl={ background.imageUrl }
                                                key={ background.name }
                                                label={ background.label }
                                                name={ background.name }
                                                onSelect={ this.handleSelectBackground }
                                                selected={ this.state.selectedBackground === background.name } />
                                        ))
                                    }
                                </div>
                                <br/>
                                <br/>
                                <Input name='localBackgroundUrl' label='Background Image' labelClass='col-sm-4' fieldClass='col-sm-8' placeholder='URL to background image'
                                    type='text' onChange={ this.onChange.bind(this, 'localBackgroundUrl') } value={ this.state.localBackgroundUrl }
                                    onBlur={ () => {} } />
                                    {(this.state && this.state.localBackgroundUrl && this.state.localBackgroundUrl.length) && <div style={{ float: 'right'}}>Clear the text box to remove your custom background</div>}
                            </Panel>
                        </div>
                        <div>
                            <Panel title={ t('Card Image Size') }>
                                <div className='row'>
                                    <div className='col-xs-12'>
                                        {
                                            cardSizes.map(cardSize => (
                                                <CardSizeOption
                                                    key={ cardSize.name }
                                                    label={ cardSize.label }
                                                    name={ cardSize.name }
                                                    onSelect={ this.handleSelectCardSize }
                                                    selected={ this.state.selectedCardSize === cardSize.name } />
                                            ))
                                        }
                                    </div>
                                </div>
                            </Panel>
                        </div>
                        <div>
                            <Panel title={ t('Game Settings') }>
                                <Checkbox
                                    name='optionSettings.orderForcedAbilities'
                                    noGroup
                                    label={ t('Prompt to order simultaneous abilities') }
                                    fieldClass='col-sm-6'
                                    onChange={ this.onOptionSettingToggle.bind(this, 'orderForcedAbilities') }
                                    checked={ this.state.optionSettings.orderForcedAbilities } />
                                <Checkbox
                                    name='optionSettings.confirmOneClick'
                                    noGroup
                                    label={ t('Show a prompt when initating 1-click abilities') }
                                    fieldClass='col-sm-6'
                                    onChange={ this.onOptionSettingToggle.bind(this, 'confirmOneClick') }
                                    checked={ this.state.optionSettings.confirmOneClick } />
                            </Panel>
                        </div>
                    </form>
                </div>
            </div>);
    }
}

Profile.displayName = 'Profile';
Profile.propTypes = {
    apiLoading: PropTypes.bool,
    apiMessage: PropTypes.string,
    apiSuccess: PropTypes.bool,
    clearProfileStatus: PropTypes.func,
    i18n: PropTypes.object,
    profileSaved: PropTypes.bool,
    refreshUser: PropTypes.func,
    saveProfile: PropTypes.func,
    socket: PropTypes.object,
    t: PropTypes.func,
    updateAvatar: PropTypes.func,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        apiLoading: state.api.SAVE_PROFILE ? state.api.SAVE_PROFILE.loading : undefined,
        apiMessage: state.api.SAVE_PROFILE ? state.api.SAVE_PROFILE.message : undefined,
        apiSuccess: state.api.SAVE_PROFILE ? state.api.SAVE_PROFILE.success : undefined,
        profileSaved: state.user.profileSaved,
        socket: state.lobby.socket,
        user: state.account.user
    };
}

export default withTranslation()(connect(mapStateToProps, actions)(Profile));
