import React, { useState} from 'react';

import {ListItem, Typography} from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import {IconButton, ListItemIcon} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import EditItem from './EditItem';
//import {SettingsContext} from '../../../../contexts/useSettingsContext';
import { createTheme   } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";

import './styles.css';

const pmntsArr = ['Credit Card','PayPal','Cash','Money Transfer'];

const materialTheme = createTheme({
  overrides: { 
    MuiListItemSecondaryAction: {
  		root: {
			position: 'initial',
			transform: 'initial',
			display: 'inline-flex'
      },
    }, 
	}
});

const Item =(props)=>{

	const [isediting, setIsediting] = useState(false);
	//const {settingsShows} = useContext(SettingsContext);
	
	const dsbl = props.typelist==='pmnts' && pmntsArr.includes(props.item.item);
	
	return (
		<ThemeProvider theme={materialTheme}>
		<ListItem style={{paddingTop:'3px', paddingBottom: '3px'}}	 >
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
				{props.img && <ListItemIcon >
								<img src={props.img.img} alt={props.img.txt} width={props.img.width}/>
          			</ListItemIcon> }
				
					<ListItemText style={!props.item.show ? {textDecoration: 'line-through' }: null} >
						<Typography noWrap>
						{props.item.item}
						</Typography>
					</ListItemText>
					<ListItemSecondaryAction style={{display: 'contents'}}>
						<IconButton aria-label='Edit' onClick={() => setIsediting(!isediting)}
							disabled={!props.item.show || dsbl} >
							<EditIcon />
						</IconButton>
						<IconButton aria-label='Delete' onClick={() => props.removeItem(props.item.id)}
									disabled={!props.item.show || dsbl}>
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

	white-space: nowrap;
    overflow: hidden;
	text-overflow: ellipsis;
	
*/