import React from 'react';
//import Grid from '@material-ui/core/Grid';

const PaperRowOutput=({name,value,pad,st})=>{

	return(
		

				<div style={{width: '100%', display: 'inline-flex', paddingTop:`${pad}px`}}>
					
					<div style={{width: '60%'}}>
						<label>{name}</label>
					</div>
					<div style={{width: '40%',textAlign: 'right'}}>
						<label>{value}</label>	
					</div> 
				</div>		
	);
};
export default PaperRowOutput;

/*

	{/* <Grid container justifyContent="space-between"  style={{paddingTop:`${pad}px`}}>
				<label style={st && {fontWeight: 'bold'}} htmlFor="my-input">{name}</label>
				<label style={st && {fontWeight: 'bold'}} id="my-helper-text">{value}</label>
			</Grid> *}


*/