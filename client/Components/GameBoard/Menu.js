import React, { useState } from 'react';
import Avatar from '../Site/Avatar';
import styled from 'styled-components';
import colors from '../../colors';

const Text = styled.div`
    letter-spacing: 1.1px;
    font-family: "Open Sans", "Arial", sans-serif;
`;

const UserName = styled(Text)`
    margin: 0 2px;
`;

const Container = styled(Text)`
    user-select: none;
    width: 100%;
    padding: 8px 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    flex-direction: column;
    position: relative;
    background-color: ${colors.background3};
    color: ${colors.text};
`;

const UserContainer = styled.div`
    display: flex;
    align-items: center;
`;

const Dropdown = styled.div`
    position: absolute;
    top: 43px;
    right: 0;   
    width: 100%;
`;

const DropdownItem = styled.div`
    padding: 8px;
    text-align: left;
    font-size: 13px;
    user-select: none;

    background-color: ${colors.background3};

    &:hover {
        background-color: ${colors.background2};
    }
`;

const User = ({ user, options }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);

    return (
        <Container onClick={ () => setDropdownVisible(!dropdownVisible) } onMouseLeave={ () => setDropdownVisible(false) }>
            <UserContainer>
                <Avatar user={ user } />
                <UserName>{ user.username }</UserName>
                <span className='caret'/>
            </UserContainer>
            { dropdownVisible &&
                <Dropdown>
                    { options.map(option => {
                        if(option.options) {
                            return (
                                <SubDropdown key={ option.text } onClick={ option.onClick } options={ option.options }>{ option.text }</SubDropdown>
                            );
                        }

                        return (
                            <DropdownItem key={ option.text } onClick={ option.onClick }>{ option.text }</DropdownItem>
                        );
                    }) }
                </Dropdown>
            }
        </Container>
    );
};

const InnerContainer = styled(Container)`
    height: 34px;
    align-items: flex-start;
    &:hover {
        background-color: ${colors.background2};
    }
`;

const InnerDropdown = styled.div`
    position: relative;
    margin-top: -28px;
    left: calc(-100% - 9px);   
    width: 100%;
`;

const InnerDropdownItem = styled(DropdownItem)`
    overflow: hidden;
    word-wrap: nowrap;
    font-size: 12px;
    padding: 5px 8px;

    background-color: ${colors.background2};

    &:hover {
        background-color: ${colors.background3};
    }
`;

const SubDropdown = ({ options, children }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);

    return (
        <InnerContainer onMouseEnter={ () => setDropdownVisible(true) } onMouseLeave={ () => setDropdownVisible(false) }>
            { children }
            { dropdownVisible &&
                <InnerDropdown>
                    { options.map(option => {
                        return (
                            <InnerDropdownItem key={ option }>{ option }</InnerDropdownItem>
                        );
                    }) }
                </InnerDropdown>
            }
        </InnerContainer>
    );
};

export default User;
