import React, { useState } from 'react';
import styled from 'styled-components';

export const Title = styled.div`
  color: #FFF;
  font-size: 40px;
  font-family: "Open Sans","Arial",sans-serif;
  margin-top: 20px;
`;

export const Header = styled.div`
  color: #FFF;
  line-height: 1.58;
  font-size: 26px;
  font-family: "Open Sans","Arial",sans-serif;
  margin-bottom: 5px;
`;

export const Paragraph = styled.div`
  color: #FFF;
  font-family: "Open Sans","Arial",sans-serif;
  line-height: 1.58;
  font-size: 25px;
  font-weight: 300;
  margin: 0 0 30px 0;
`;

export const Line = styled.span`
  line-height: 1.58;
  font-weight: 300;
  font-family: "Open Sans","Arial",sans-serif;
  font-size: 25px;
`;

export const BulletPoints = styled.div`
`;

export const BP = styled.div`
  line-height: 1.58;
`;

export const CardRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
`;

export const Image = styled.img`
  width: ${(props) => props.width || '150px'};
  margin: 5px;
`;

export const N = styled.div`
  padding: 0px 10px;
  background: #fffaf0;
  position: absolute;
  top: 13px;
  border-radius: 25px;
  box-shadow: rgba(0, 0, 0, 1) 2px 2px 5px 0px;
  right: 1px;
  font-size: 30px;
`;

export const CardImage = (context) => {
    const [isHovering, setHover] = useState(false);

    const handleMouseOver = () => setHover(true);
    const handleMouseOut = () => setHover(false);

    return (
        <div
            style={ {
                display: 'inline-block',
                width: '160px',
                height: '230px'
            } }
            onMouseOver={ handleMouseOver }
            onMouseOut={ handleMouseOut }
        >
            {
                isHovering
                    ? (
                        <div style={ {
                            display: 'inline-block',
                            position: 'relative',
                            width: '160px',
                            height: '230px'
                        } }
                        >
                            <Image
                                src={ context.src }
                                // width="200px"
                            />
                            <div style={ {
                                position: 'absolute',
                                top: '-120px',
                                left: '-55px',
                                zIndex: 10,
                                padding: '5px 5px 0px 5px',
                                backgroundColor: '#fff',
                                border: '1px solid black',
                                borderRadius: '2px',
                                boxShadow: 'rgba(0, 0, 0, 0.2) 2px 2px 5px 0px'
                            } }
                            >
                                <Image
                                    src={ context.src }
                                    width='250px'
                                />
                            </div>
                        </div>
                    )
                    : (
                        <div style={ {
                            display: 'inline-block',
                            position: 'relative',
                            width: '160px',
                            height: '230px'
                        } }
                        >
                            { context.n > 0 && (
                                <N>
                                    { `${context.n}x` }
                                </N>
                            ) }
                            <Image src={ context.src } />
                        </div>
                    )
            }
        </div>
    );
};

export const Puzzle = ({ url }) => (
    <a href={ url }>
        <img src={ url } style={ { width: '100%' } } />
    </a>
);


export const TitlePreview = styled.div`
  font-size: 28px;
`;

export const Date = styled.div`
  line-height: 1.58;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 20px;
`;

export const ParagraphPreview = styled.div`
  line-height: 1.58;
  font-size: 16px;
`;
