import React from 'react';
import GridLoader from 'react-spinners/GridLoader';  // //https://www.react-spinners.com/
import { css } from '@emotion/core';

const Spinner = () => {

    const override = css`
	position: fixed;
	left: 50%;
    top: 50%;
    z-index: 10000;
    margin: -75px 0 0 -75px;
    display: block;
    border-color: red;
`;

    return(
        <div>
        <GridLoader
            css={override}
            sizeUnit={"px"}
            size={50}
            color={'#012c61'}
            loading={true}
      />
  </div> 
    )
}

export default Spinner;