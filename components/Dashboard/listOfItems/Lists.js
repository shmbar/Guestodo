import React, {useState,useEffect, useContext} from 'react';
import NamesList from './NamesList';
import SnackBar from '../../Subcomponents/SnackBar';
import {addDataSettings} from '../../../functions/functions.js';
import DelDialog from '../../Subcomponents/DeleteDialog';
import {AuthContext} from '../../../contexts/useAuthContext';

//import {SettingsContext} from '../../contexts/useSettingsContext';
import { v4 as uuidv4 } from 'uuid';

const Lists =(props) => {

	const [snackbar, setSnackbar] = useState(false);
	const [tasklist, setTaskList] = useState([]);
	//const {settingsShows, updtShows, updtSettings} = useContext(SettingsContext);
	const [open, setOpen] = useState(false);
	const [id, setId] = useState('');
	const [completedOnly, setCompeltedOnly] = useState(false);
	const {uidCollection} = useContext(AuthContext);
	
	useEffect(()=>{
		setTaskList(props.list)
	},[props.list])
	
	
	const handleChangeActive =()=> {
    	setCompeltedOnly(!completedOnly);
  };
	
	const handleComplete=async(item)=>{

		let newList = tasklist.map(x=> 
			x.id===item.id ? {...x, 'completed' : !x.completed} : x 
			);
		let txtMsg = newList.filter(x=> x.id===item.id)[0]['completed']===true? 'Task is completed!': 'Task is uncompleted!';
		setTaskList(newList);
		setSnackbar( {open: (await addDataSettings(uidCollection, 'tasks', 'tasks', {'tasks':newList})),
		 						msg: txtMsg, variant: 'success'});
	}
	
	const addItem= async(newItem) =>{
		
		let newTask = {id: uuidv4(), completed: false, item: 'Add new task'}
		const tasksArr = [newTask].concat(tasklist);
		setTaskList(tasksArr);
	 	setSnackbar( {open: (await addDataSettings(uidCollection,'tasks', 'tasks', {'tasks':tasksArr})),
		 						msg: 'New task has been added!', variant: 'success'});
	};
	
	const removeItem = async(itemId) =>{
		setId(itemId)
		setOpen(true)
	};
	
	const handleDelete=()=>{
	
				let tmp = tasklist.filter(x=> x.id!==id);	
				tmp = tmp.length===0 ? []: tmp;
				setTaskList(tmp);
		
				const Snack =async() =>{
					 setSnackbar( {open: (await addDataSettings(uidCollection, 'tasks', 'tasks', {'tasks':tmp})),
								msg: 'Task has been deleted!', variant: 'success'});
				}	
				Snack();
		setOpen(false)
	}
	
	const editItem = async(ItemId, value) =>{
	
		let exstIntheList=false;
 		
		for(let rw in tasklist){
			if(tasklist[rw].item.toLowerCase()===value.toLowerCase() && tasklist[rw].id!==ItemId){
				exstIntheList=true;
			}
		}
		
		if(exstIntheList){
			setSnackbar( {open: true, msg: `${value} already exists!`, variant: 'error'}); 
			return;
		}else{
			const updateItems = tasklist.map(itm =>
				   itm.id===ItemId? {...itm, 'item': value } : itm
				   );
			setTaskList(updateItems);
			setSnackbar( {open: (await addDataSettings(uidCollection, 'tasks', 'tasks', {'tasks':updateItems})),
							msg: 'Task has been updated!', variant: 'success'});
		}
		
	};

	return(
			<>
				<SnackBar msg={snackbar.msg} snackbar={snackbar.open} setSnackbar={setSnackbar}
					variant={snackbar.variant}/>
				<DelDialog open={open} setOpen={setOpen} handleDelete={handleDelete}
					title='This item will be deleted!' 
					content='Please Confirm'/>
				<NamesList 	list={completedOnly ? tasklist.filter(x=> x.completed): tasklist }
							removeItem={removeItem}
							editItem={editItem}
							completedOnly={completedOnly}
							handleChangeActive={handleChangeActive}
							handleComplete={handleComplete}
							addItem={addItem}
					/>
			</>		
	)
};

export default Lists;

