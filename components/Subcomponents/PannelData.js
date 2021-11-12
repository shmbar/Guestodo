import React, { useContext} from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import useWindowSize from '../../hooks/useWindowSize';
import {SettingsContext} from '../../contexts/useSettingsContext'; 

const PannelData=(props)=>{
	
	const scrSize = useWindowSize();
	const {settings} = useContext(SettingsContext);
	let  cur = settings.length===0 ? "Currency" : settings.CompDtls.currency ;

	const useStyles = makeStyles(theme => ({
		root: {
		  flexGrow: 1,
		},
		paper: {
		  padding: theme.spacing(1.5),
		  textAlign: 'left',
		  color: theme.palette.text.secondary,
		},
		setPapertoSmall:{
			padding:  scrSize==='xs' && '10px!important'
		} 
	  }));
	  const classes = useStyles();
	return(
		<Grid xs={12} sm={6} md={3}  item  style={{padding:'6px'}} >	
			<Paper className={classes.paper} style={{paddingBottom: '3px'}}  >
				<div style={{float:'right'}}>	
					<img src={props.img.img} alt={props.img.txt} width={props.img.width} />
				</div>
				<p>{props.ttl}</p>
				<h5 className='ttlClr1'>{cur } {props.num} </h5>

				<CardContent className='Crdcont'>
					<Typography noWrap variant="body2" color="textSecondary"
						style={{paddingTop: '5px'}}>
						{props.txt}
					</Typography>
				</CardContent>
			</Paper>	 
		</Grid>				 
		
	)
};

export default  PannelData;


/*
	
								
								
*/