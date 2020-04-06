import React from 'react';
import styled from 'styled-components';
import colors from '../colors';

const PrimaryAnchor = styled.a`
  font-size: ${(props) => props.fontSize || 'unset'};
  font-weight: ${(props) => props.fontWeight || 'initial'};
  color: ${(props) => props.color || colors.url};
  text-decoration: none;
  cursor: pointer;
  width:fit-content; 
  height:fit-content; 

  &:hover {
    text-decoration: underline;
    color: ${(props) => props.color || colors.url};
  }
`;

const SecondaryAnchor = styled.a`
  font-size: ${(props) => props.fontSize || '12px'};
  font-weight: ${(props) => props.fontWeight || 'initial'};
  color: #767676;
  color: ${colors.text2};
  text-decoration: none;
  cursor: pointer;
  width:fit-content; 
  height:fit-content; 

  &:hover {
    color: ${colors.url};
  }
`;

class Component extends React.Component {
    render() {
        const {
            text,
            url,
            type,
            fontSize,
            fontWeight,
            color,
            newTab
        } = this.props;

        if(type === 'secondary') {
            return (
                <SecondaryAnchor href={ url } fontSize={ fontSize } fontWeight={ fontWeight } target={ newTab ? '_blank' : undefined }>
                    { text }
                </SecondaryAnchor>
            );
        }

        return (
            <PrimaryAnchor color={ color } href={ url } fontSize={ fontSize } fontWeight={ fontWeight } target={ newTab ? '_blank' : undefined }>
                { text }
            </PrimaryAnchor>
        );
    }
}

export default Component;
