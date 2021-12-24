import React, {useState, useContext} from 'react';
import AddForm from './AddForm';
import NamesList from './NamesList';
import SnackBar from '../../../Subcomponents/SnackBar';
import {addDataSettings, delField, updateField} from '../../../../functions/functions.js';
import DelDialog from '../../../Subcomponents/DeleteDialog';
import {AuthContext} from '../../../../contexts/useAuthContext';

import {SettingsContext} from '../../../../contexts/useSettingsContext';
import {SelectContext} from '../../../../contexts/useSelectContext';
import { v4 as uuidv4 } from 'uuid';

const Lists =(props) => {

	const [snackbar, setSnackbar] = useState(false);
	const {settingsShows, updtShows, updtSettings, setOwnerList, settings,updtSettingsTwo, setSettingsShows} = useContext(SettingsContext);
	const {setValueOwner} = useContext(SelectContext);
	const [open, setOpen] = useState(false);
	const [id, setId] = useState('');
	const [activeOnly, setActiveOnly] = useState(true);
	const {uidCollection} = useContext(AuthContext);
	
	const handleChangeActive =()=> {
    	setActiveOnly(!activeOnly);
  };
	const addItem= async(newItem) =>{
		
		let tmp;
		let tmpId = uuidv4();
	
		if(props.list.length!==0){
			for(let row in props.list){
				if(props.list[row].item.toLowerCase()===newItem.toLowerCase() && props.list[row].show ){
					setSnackbar( {open: true, msg: `${newItem} already exists!`, variant: 'error'});
					return;
				}else if(props.list[row].item.toLowerCase()===newItem.toLowerCase() && !props.list[row].show ){
					tmp = props.list.map(x=> 
						x.item.toLowerCase()===newItem.toLowerCase() ?	{...x, 'show': true} : x )
					break;
				}else{
					tmp = [...props.list, {id: tmpId,item: newItem, show: true}];	
				}
			}
		}else{
			tmp = [{id:tmpId,item: newItem, show: true}];
		}	
		
		
	 	updtSettings(props.name,tmp);
	 	setSnackbar( {open: (await addDataSettings(uidCollection, 'settings', props.name, {[props.name]:tmp})),
		 						msg: `New ${props.snkbar} has been added!`, variant: 'success'});
	 	updtShows(uidCollection, tmpId, false);
		
		if(props.name==='owners'){
			let fundObj={'id':uuidv4(), 'IntCshFlBnce' :0,  'show' :true, item: newItem, Owner: tmpId};
			let newArr = [...settings.funds, fundObj]
			await addDataSettings(uidCollection, 'settings', 'funds', {'funds':newArr})
			updtSettingsTwo(props.name,tmp, 'funds',newArr)

			let tmp1 = {...settingsShows, [tmpId] : false, [fundObj.id] : false};
			setSettingsShows(tmp1)
		
			await updateField(uidCollection, 'settingsShows', 'shows', [fundObj.id], false)
		/* 	const owns =  tmp.filter(x=> x.show ).map(x=>x.item);
		 	setOwnerList(owns); */
		}
	
		//await updateField('settingsShows','shows', tmpId, false);
	};
	
	const removeItem = async(itemId) =>{
		setId(itemId)
		setOpen(true)
	};
	
	const handleDelete=()=>{
		let tmp;

			if(!settingsShows[id]){ //false means I can remove from the list
				tmp = props.list.filter(x=> x.id!==id);	
				let filteredItems = tmp.length===0 ? []: tmp;
				updtSettings(props.name,filteredItems);
				delField(uidCollection, 'settingsShows','shows', id);
			}else{ //there was a use of this settings
				tmp = props.list.map(x=> 
					 x.id===id ? {...x, 'show':false}: x);
				let filteredItems = tmp.length===0 ? []: tmp;
				updtSettings(props.name,filteredItems);
			}
			
			/* 	if(props.name==='owners'){
					const owns =  tmp.filter(x=> x.show ).map(x=>x.item);
					setOwnerList(owns);
					setValueOwner(null);
				} */
			
				async function Snack() {
					 setSnackbar( {open: (await addDataSettings(uidCollection, 'settings', props.name, {[props.name]:tmp})),
								msg: `${props.snkbar} has been deleted!`, variant: 'success'});
				}	
			Snack();
		setOpen(false)
	}
	
	const editItem = async(ItemId, value) =>{
	
		
		let exstIntheList=false;
 		
		for(let rw in props.list){
			if(props.list[rw].item.toLowerCase()===value.toLowerCase() && props.list[rw].id!==ItemId){
				exstIntheList=true;
			}
		}
		
		if(exstIntheList){
			setSnackbar( {open: true, msg: `${value} already exists!`, variant: 'error'}); 
			return;
		}else{
			const updateItems = props.list.map(itm =>
				   itm.id===ItemId? {...itm, 'item': value } : itm
				   );
			updtSettings(props.name,updateItems);
			setSnackbar( {open: (await addDataSettings(uidCollection, 'settings', props.name, {[props.name]:updateItems})),
							msg: `${props.snkbar} has been updated!`, variant: 'success'});
			
			if(props.name==='owners'){
				const owns =  updateItems.filter(x=> x.show ).map(x=>x.item);
		 		setOwnerList(owns);
				setValueOwner(null);
			}
		}
		
		
		
	};

	return(
			<>
				<SnackBar msg={snackbar.msg} snackbar={snackbar.open} setSnackbar={setSnackbar}
					variant={snackbar.variant}/>
				<DelDialog open={open} setOpen={setOpen} handleDelete={handleDelete}
					title='This item will be deleted!' 
					content='Please Confirm'/>
				<AddForm addItem={addItem} lbl={props.lbl} ttl={props.ttl}/>
				<NamesList 	list={!activeOnly ? props.list: props.list.filter(x=>x.show)}
							removeItem={removeItem}
							editItem={editItem}
							typelist={props.typelist}
							activeOnly={activeOnly}
							handleChangeActive={handleChangeActive}
					/>
			</>		
	)
};

export default Lists;

