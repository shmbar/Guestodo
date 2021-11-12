import React, {useContext} from 'react';
import {Grid, ButtonGroup, Button, } from '@material-ui/core';
import {SelectContext} from '../../contexts/useSelectContext';


const YearSelect = (props) => {
	const {date, setDate} = useContext(SelectContext);

	const han = (val) =>{
		let newdTmp = val==='prev' ? +date.year - 1 : +date.year + 1;
		setDate({...date, 'year': newdTmp, 'run': true})
	}
	
  return (
		<Grid item>
				<ButtonGroup color="primary" aria-label="outlined primary button group" size="small">
				  <Button onClick={()=>han('prev')} >{'<'}</Button>
				  <Button >{date.year}</Button>
				  <Button onClick={()=>han('next')} >{'>'}</Button>
				</ButtonGroup>
		</Grid>
  );
}

export default YearSelect;
