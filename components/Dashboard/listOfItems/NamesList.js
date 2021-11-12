import React from 'react';
import {List, ListSubheader,Grid, Fab, Divider, Paper} from '@material-ui/core';
import Item from './Item';
import CompletedFilter from './CompletedFilter';
import AddIcon from '@material-ui/icons/Add';

const NameList =(props)=>{
	
 	if(props.list!=null)
	return(
		<Paper>
			<List 
				 component="nav"
				  aria-labelledby="nested-list-subheader"
				  subheader={
					<ListSubheader component="div" id="nested-list-subheader" style={{fontSize: '20px', display:'flex'}} >
						Tasks
							
						<Grid container spacing={3} >
								<Grid item xs={12}  style={{display:'flex', justifyContent: 'flex-end'}}>
										<Fab color="primary" aria-label="add" size="small" style={{alignSelf: 'center', marginRight:'20px'}}/*className={classes.button} onClick={addOrder}*/>
	  										<AddIcon onClick={props.addItem}/>
										</Fab>
										<CompletedFilter completedOnly={props.completedOnly} handleChangeActive={props.handleChangeActive}/>
            					</Grid>
						</Grid>	
					</ListSubheader>
				  }
				>
				<Divider />
				{props.list.map((itm, i) => (
					<React.Fragment key={itm.id }>
						<Item   item={itm}
								removeItem={props.removeItem}
								editItem={props.editItem}
								handleComplete={props.handleComplete}
							/>
					{i < props.list.length-1 && <Divider />}
					</React.Fragment>	
				))}
			</List>	
		</Paper>
	);
	return null;
};

export default NameList;
