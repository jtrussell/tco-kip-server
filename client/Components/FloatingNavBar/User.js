import React, { useState } from 'react';

import Avatar from '../Site/Avatar';
import styled from 'styled-components';

const Text = styled.div`
    letter-spacing: 1.1px;
    font-family: "Open Sans", "Arial", sans-serif;
`;

const UserName = styled(Text)`
    margin: 0 2px;
`;

const Container = styled(Text)`
    padding: 5px;
    margin: 0 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    flex-direction: column;
    position: relative;
`;

const UserContainer = styled.div`
    display: flex;
    align-items: center;
`;

const Dropdown = styled.div`
    position: absolute;
    top: 32px;
    right: 0;   
    width: 100%;
`;

const DropdownItem = styled.div`
    padding: 8px;
    text-align: center;
    background-color: #EEE;

    &:hover {
        background-color: #DDD;
    }
`;

const User = ({ navigate, user }) => {
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
                    <DropdownItem onClick={ () => navigate('/profile') }>Profile</DropdownItem>
                    <DropdownItem onClick={ () => navigate('/logout') }>Logout</DropdownItem>
                </Dropdown>
            }
        </Container>
    );
};

export default User;
