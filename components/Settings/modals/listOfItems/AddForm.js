import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import {TextField, List, ListSubheader, IconButton, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  	root: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper,
  	},
	nested: {
		paddingLeft: theme.spacing(2),
  	},
	subHdr:{
		fontSize: '25px',
		paddingTop: '8px',
		color: '#193e6d'
	},
 	fab: {
    	margin: theme.spacing(1),
		right: 0,
    	position: 'absolute',
    	top: '30px',
    	zIndex: 1
  	},
}));

	

const AddForm=(props)=>{
	const [value,setValue] = useState('');
	const [openForm,setOpenForm] = useState(false);
	
	
	const classes = useStyles();
	
	return(
		<Paper style={{margin: '0rem 0', marginBottom:'0.5rem', padding: '0 1rem'}}>
			{!openForm ? <List  subheader={  
				<ListSubheader component="div" id="nested-list-subheader" className={classes.subHdr}>
					{props.ttl}
				</ListSubheader> }	className={classes.root} >
				<Fab color="primary" aria-label="add" className={classes.fab} size="medium"
									onClick={(e)=>setOpenForm(true)}>
						<AddIcon />
				</Fab>
			</List>:
			<form
				onSubmit={e => {
					e.preventDefault();
					if(value==='')return;
					props.addItem(value);
					setValue('');
					setOpenForm(false)
				}}
				>
				<Grid container spacing={1} alignItems="flex-end">
				  	<Grid item sm={10}>
						<TextField 	onChange={(e) => setValue(e.target.value)}
							value={value} 
							margin='normal'
							label={props.lbl}
							fullWidth
						/>
				  	</Grid>
					<Grid item sm={1}>
						<IconButton edge="start" color="inherit"  aria-label="Close"
											onClick={(e)=>setOpenForm(false)}>
              				<CloseIcon style={{color:'gray'}} />
						</IconButton>
				  	</Grid>
        		</Grid>
			</form> 
			}
			
		</Paper>
	)

}

export default AddForm;

/*
		
*/