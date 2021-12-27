import React, { useContext } from 'react';
import { Grid, TextField, Tooltip, Fab, Box, IconButton, InputAdornment, Paper, FormHelperText } from '@material-ui/core';
import { SettingsContext } from '../../../../contexts/useSettingsContext';
import { FormControl, Select, MenuItem, InputLabel } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';	
import {AuthContext} from '../../../../contexts/useAuthContext';
import { v4 as uuidv4 } from 'uuid';
import DeleteIcon from '@material-ui/icons/Delete';
import NumberFormatCustom from '../../../Subcomponents/NumberFormatCustom';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	formControl: {
		width: '100%',
		minWidth: 120,
	},
}));

const CustomToolTip = withStyles({
        tooltip: {
            fontSize: 13,
        },
})(Tooltip);

const Tab2Fees = (props) => {
	const { valueSettings, setValueSettings} = useContext(SettingsContext);
	const {write} = useContext(AuthContext);

	const classes = useStyles();
	
	const addFee= ()=>{
         let Arr=[...valueSettings.Fees, {FeeName:'', FeeType:'', FeeAmount: '', FeeModality: '', FeeDescription: '', 'id': uuidv4()}]	
		 setValueSettings({...valueSettings, 'Fees': Arr})
    };
	
	const delFee=(row)=>{
		let newArr=[];
		if(row!==0){  //not the first row
			newArr = valueSettings.Fees.filter((k,i)=>
				i!==row? k:null					   
		   )
		}else{
			if (valueSettings.Fees.length===1){
				let Tmp = {FeeName:'', FeeType:'', FeeAmount: '', FeeModality: '', FeeDescription: '', 'id': uuidv4()};
				newArr = valueSettings.Fees.map((k,i)=>	i!==row? k:Tmp);
			}else{
				newArr = valueSettings.Fees.filter((k,i)=>	i!==row? k:null	)
			}
		}
			
		setValueSettings({...valueSettings,'Fees':newArr });
	}
	
	
	const cmsnNum = (n)=>{ //Clean commas and validate numbers
		return (/^\d+$/.test( n ) && n.length<=2) ? n :  n.substring(0, n.length - 1);
	} ;
	
	const handleChange = (e, id) => {
	
			let rowNum=id;
			let newVal=[...valueSettings.Fees];
		
			
			if(e.target.name==='FeeAmount' && valueSettings.Fees[rowNum].FeeType==='Percent'){
				newVal[rowNum]={...newVal[rowNum],[e.target.name]:+cmsnNum(e.target.value) };
			}else if(e.target.name==='FeeType' && e.target.value!==valueSettings.Fees[rowNum].FeeAmount){
				newVal[rowNum]={...newVal[rowNum], 'FeeType':e.target.value, 'FeeAmount':'' };
			}else{
				newVal[rowNum]={...newVal[rowNum],[e.target.name]: e.target.value };
			}
		
			setValueSettings({...valueSettings,'Fees':newVal});
	}
	
	
	const YesNo = ['Percent', 'Flat'].map((s, i) => {
		return (
			<MenuItem key={i} value={s}>
				{s}
			</MenuItem>
		);
	});
	
	const Modality = ['Per Stay', 'Per Night', 'Per Person', 'Per Person/Per Night'].map((s, i) => {
		return (
			<MenuItem key={i} value={s}>
				{s}
			</MenuItem>
		);
	});
	
	const ModalityOnlyPerStay = ['Per Stay'].map((s, i) => {
		return (
			<MenuItem key={i} value={s}>
				{s}
			</MenuItem>
		);
	});

	const Fees = valueSettings.Fees.map((pmnt,i) =>{
			return <React.Fragment key={i}>
			<Paper style={{background: 'cornsilk', marginBottom: '20px', padding: '10px'}}>
				<Grid container spacing={3} >
				 	
					<Grid item xs={12} md={2}>
						<CustomToolTip title="Insert a fee name" >
							<TextField
								value={valueSettings.Fees[i].FeeName}
								onChange={e=> write && handleChange(e, i)}
								name="FeeName"
								label="Fee Name"
								fullWidth
								error={valueSettings.Fees[i].FeeName === '' && props.feesRedValid ? true : false}
							/>
						</CustomToolTip>
					</Grid>
					<Grid item xs={12} md={2}>
						<CustomToolTip title="Select type of fee" placement="top">
							<FormControl className={classes.formControl}>
								<InputLabel
									htmlFor="FeeType"
									error={(valueSettings.Fees[i].FeeType === '' || valueSettings.Fees[i].FeeType == null) &&	props.feesRedValid? true: false}
								>
									Fee Type
								</InputLabel>
								<Select
									value={valueSettings.Fees[i].FeeType}
									onChange={e=> write && handleChange(e, i)}
									fullWidth
									inputProps={{
										name: 'FeeType',
									}}
									error={(valueSettings.Fees[i].FeeType === '' || valueSettings.Fees[i].FeeType == null) &&	props.feesRedValid? true: false}
								>
									{YesNo}
								</Select>
							</FormControl>
						</CustomToolTip>
					</Grid>
					<Grid item xs={12} md={2}>
						<CustomToolTip title="Insert fee amount/percent">
							<TextField
								value={valueSettings.Fees[i].FeeAmount}
								onChange={e=> write && handleChange(e, i)}
								name="FeeAmount"
								disabled={!valueSettings.Fees[i].FeeType}
								label={valueSettings.Fees[i].FeeType==='Flat' ? 'Amount': 'Percent'}
								fullWidth
								InputProps={valueSettings.Fees[i].FeeType === 'Flat' ? {inputComponent: NumberFormatCustom}:
										   {endAdornment: <InputAdornment position="end" className={classes.Vat}>%</InputAdornment>}}
								error={valueSettings.Fees[i].FeeAmount === '' && props.feesRedValid ? true : false}
							/>
						</CustomToolTip>
					</Grid>
					<Grid item xs={12} md={4}>
							<FormControl className={classes.formControl}>
								<InputLabel
									htmlFor="Modality"
									error={(valueSettings.Fees[i].FeeModality === '' || valueSettings.Fees[i].FeeModality == null) &&	props.feesRedValid?
										true: false}
								>
									Modality
								</InputLabel>
								<Select
									value={valueSettings.Fees[i].FeeModality}
									onChange={e=> write && handleChange(e, i)}
									fullWidth
									inputProps={{
										name: 'FeeModality',
									}}
									error={(valueSettings.Fees[i].FeeModality === '' || valueSettings.Fees[i].FeeModality == null) &&	props.feesRedValid?
										true: false}
								>
									{valueSettings.Fees[i].FeeType!=='Percent' ?  Modality : ModalityOnlyPerStay}
								</Select>
								<FormHelperText style={{color: 'red'}}>
										{(valueSettings.Fees[i].FeeModality === 'Per Person' ||
										valueSettings.Fees[i].FeeModality ==='Per Person/Per Night') && 'Adults and Children'}
										</FormHelperText>
							</FormControl>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							value={valueSettings.Fees[i].FeeDescription}
							onChange={e=> write && handleChange(e, i)}
							name="FeeDescription"
							label="Description"
							fullWidth
						/>
					</Grid>
					{write && <Box display={{ xs: 'none', md: 'block'}} style={{paddingTop: '10px' }}>
					<Grid item md={1} >	
							<Tooltip title="Delete fee"><span>
								<IconButton aria-label='Delete' onClick={()=> delFee(i)}  >
									<DeleteIcon />
								</IconButton></span>
							</Tooltip>

					</Grid>
				</Box>	}		
				</Grid>
			</Paper>
			</React.Fragment>
	})
									 
	
	
	return (
		<div>
			
				{Fees}
			
			{write && <CustomToolTip title="Add new fee">
				<Fab color="primary" aria-label="add" size="small" onClick={addFee}>
							<AddIcon />
				</Fab>
			</CustomToolTip> }
		</div>
	);
};

export default Tab2Fees;



