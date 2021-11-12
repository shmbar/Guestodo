import React, { useState } from 'react';
import {Checkbox, FormControlLabel} from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {IconButton} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import EditItem from './EditItem';
import { createTheme   } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { green } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import './styles.css';

const materialTheme = createTheme({
  overrides: { 
    MuiListItemSecondaryAction: {
  		root: {
			position: 'initial',
			transform: 'initial',
			display: 'inline-flex'
      },
    }, 
	MuiListItemText: {
		root:{
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			textOverflow: 'ellipsis'
		}
	}
	}
});

	const GreenCheckbox = withStyles({
		  root: {
			'&$checked': {
			  color: green[600],
			},
		  },
		  checked: {},
	})(props => <Checkbox color="default" {...props} />);
	   
const Item =(props)=>{

	const [isediting, setIsediting] = useState(false);
	
	return (
		<ThemeProvider theme={materialTheme}>
		<ListItem style={{paddingTop:'0px', paddingBottom: '0px'}}>
			{isediting ? (
				<EditItem 	
							id={props.item.id} 
							item={props.item.item}
							isediting={isediting}
							setIsediting={setIsediting}
							editItem={props.editItem}
					/>
			):(
				<>
			  	<Tooltip title={!props.item.completed ? "Click to complete" : ''} leaveTouchDelay={0}>
						<FormControlLabel style={{padding:'5px', marginBottom: '0px'}}
								control={
									  <GreenCheckbox
										checked={props.item.completed}
										onChange={()=> props.handleComplete(props.item)}
									  />
									}
						/>
				</Tooltip>
				<ListItemText style={props.item.completed ? {textDecoration: 'line-through' }: null} 
						  primary={props.item.item}	/>
					<ListItemSecondaryAction >
						<IconButton aria-label='Edit' onClick={() => setIsediting(!isediting)}
							disabled={props.item.completed }>
							<EditIcon />
						</IconButton>
						<IconButton aria-label='Delete' onClick={() => props.removeItem(props.item.id)}>
							<DeleteIcon />
						</IconButton>
					</ListItemSecondaryAction>
				</>
				
				
				
			)}
		</ListItem>
		</ThemeProvider>	
	)
};

export default Item;

/*

		{props.item.item}
					</ListItemText>

	<img src={s.img} alt={s.txt} width={s.width} style={{color: 'gray'}}/>
*/