import React, { useContext}  from 'react';
import {Paper, Tooltip} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { createTheme   } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import {SettingsContext} from '../../../contexts/useSettingsContext'; 

const materialTheme = createTheme({
  overrides: { 
    MuiTooltip: {
  		popper: {
			top: '-85px!important'
      },
    }, 
	}
});


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1.5),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },
}));

const PannelData=(props)=>{
	const classes = useStyles();
	const {settings} = useContext(SettingsContext);
	let  cur = settings.length===0 ? "Currency" : settings.CompDtls.currency ;


	const HtmlTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
	display: props.prc==='' ? 'none': 'block',
  },
}))(Tooltip);
	
	
	return(
		<ThemeProvider theme={materialTheme}>
		 <HtmlTooltip 
        	title={
			 <React.Fragment>
				<Typography color="primary">{props.prc}</Typography>
			  </React.Fragment>
        	}
      	>
		
		<Grid item xs={12} sm={6} md={3} style={{padding:'6px'}} >	
			
			<Paper className={classes.paper} style={{paddingBottom: '3px'}}  >	
				<div style={{float:'right'}}>	
					<img src={props.img.img} alt={props.img.txt} width={props.img.width} />
				</div>
				<p>{props.ttl}</p>
				<h5 style={{color: '#45afed'}}>{cur } {props.num}</h5>

				<CardContent className='Crdcont'>
					<Typography noWrap variant="body2" color="textSecondary"
						style={{paddingTop: '5px'}}>
						{props.txt}
					</Typography>
				</CardContent>
				
			</Paper>				 
		</Grid>			
		</HtmlTooltip>	
		</ThemeProvider>
	)
};

export default  PannelData;


/*
	
								
								
*/