import React, { useContext } from 'react';
import { Grid, TextField, Tooltip, Fab, Paper, Box, IconButton, InputAdornment, FormHelperText} from '@material-ui/core';
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

const Tab2Taxes = (props) => {
	const { valueSettings,setValueSettings } = useContext(SettingsContext);
	const {write} = useContext(AuthContext);

	const classes = useStyles();

	
	const addTax= ()=>{
          let Arr=[...valueSettings.Taxes, {TaxName:'', TaxType:'', TaxAmount: '', TaxTypeDscrp: '', TaxModality: '', TaxDescription: '', 'id': uuidv4()}]	
		 setValueSettings({...valueSettings, 'Taxes': Arr})
    };
	
	
	const delTax=(row)=>{
	let newArr=[];
		if(row!==0){  //not the first row
			newArr = valueSettings.Taxes.filter((k,i)=>
				i!==row? k:null					   
		   )
		}else{
			if (valueSettings.Taxes.length===1){
				let Tmp = {TaxName:'', TaxType:'', TaxAmount: '', TaxTypeDscrp: '', TaxModality: '', TaxDescription: '', 'id': uuidv4()};
				newArr = valueSettings.Taxes.map((k,i)=>	i!==row? k:Tmp);
			}else{
				newArr = valueSettings.Taxes.filter((k,i)=>	i!==row? k:null	)
			}
		}
			
		setValueSettings({...valueSettings,'Taxes':newArr });
	
	}
	
	const cmsnNum = (n)=>{ //Clean commas and validate numbers
		return (/^\d+$/.test( n ) && n.length<=2) ? n :  n.substring(0, n.length - 1);
	} ;
	
	const handleChange = (e, id) => {
	
			let rowNum=id;
			let newVal=[...valueSettings.Taxes];
		
			
			if(e.target.name==='TaxAmount' && valueSettings.Taxes[rowNum].TaxType==='Percent'){
				newVal[rowNum]={...newVal[rowNum],[e.target.name]:cmsnNum(e.target.value) };
			}else if(e.target.name==='TaxType' && e.target.value!==valueSettings.Taxes[rowNum].TaxAmount){
				newVal[rowNum]={...newVal[rowNum], 'TaxType':e.target.value, 'TaxAmount':'' };
			}else{
				newVal[rowNum]={...newVal[rowNum],[e.target.name]: e.target.value };
			}
		
			setValueSettings({...valueSettings,'Taxes':newVal});
	}
	
	const YesNo = ['Percent', 'Flat'].map((s, i) => {
		return (
			<MenuItem key={i} value={s}>
				{s}
			</MenuItem>
		);
	});
	
	const TaxType = ['Hotel tax', 'Lodging Tax', 'Room Tax', 'Tourist Tax', 'Trasient Occupancy Tax', 'Tourism Assessment Fee', 'Other'].map((s, i) => {
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

	const Taxes = valueSettings.Taxes.map((pmnt,i) =>{
			return <React.Fragment key={i}>
				<Paper style={{background: 'cornsilk', marginBottom: '20px', padding: '10px'}}>
					<Grid container spacing={3}>
							<Grid item xs={12} md={2}>
								<CustomToolTip title="Insert a tax name">
									<TextField
										value={valueSettings.Taxes[i].TaxName}
										onChange={e=> write && handleChange(e, i)}
										name="TaxName"
										label="Tax Name"
										fullWidth
										error={valueSettings.Taxes[i].TaxName === '' && props.taxesRedValid ? true : false}
									/>
								</CustomToolTip>
							</Grid>
							<Grid item xs={12} md={2}>
								<CustomToolTip title="Select type" placement="top">
									<FormControl className={classes.formControl}>
										<InputLabel
											htmlFor="TaxType"
											error={(valueSettings.Taxes[i].TaxType === '' || valueSettings.Taxes[i].TaxType == null) &&	props.taxesRedValid? true: false}
										>
											Type
										</InputLabel>
										<Select
											value={valueSettings.Taxes[i].TaxType}
											onChange={e=> write && handleChange(e, i)}
											fullWidth
											inputProps={{
												name: 'TaxType',
											}}
											error={(valueSettings.Taxes[i].TaxType === '' || valueSettings.Taxes[i].TaxType == null) &&	props.taxesRedValid? true: false}
										>
											{YesNo}
										</Select>
									</FormControl>
								</CustomToolTip>
							</Grid>
							<Grid item xs={12} md={2}>
								<CustomToolTip title="Insert Tax amount/percent">
									<TextField
										value={valueSettings.Taxes[i].TaxAmount}
										onChange={e=> write && handleChange(e, i)}
										name="TaxAmount"
										disabled={!valueSettings.Taxes[i].TaxType}
										label={valueSettings.Taxes[i].TaxType==='Flat' ? 'Amount': 'Percent'}
										InputProps={valueSettings.Taxes[i].TaxType === 'Flat' ? {inputComponent: NumberFormatCustom}:
										   {endAdornment: <InputAdornment position="end" >%</InputAdornment>}}
										fullWidth
										error={valueSettings.Taxes[i].TaxAmount === '' && props.taxesRedValid ? true : false}
									/>
								</CustomToolTip>
							</Grid>
							<Grid item xs={12} md={3}>
								<CustomToolTip title="Select type of tax" placement="top">
									<FormControl className={classes.formControl}>
										<InputLabel
											htmlFor="TaxTypeDscrp"
											error={(valueSettings.Taxes[i].TaxTypeDscrp === '' || valueSettings.Taxes[i].TaxTypeDscrp == null) &&
												props.taxesRedValid? true: false}
										>
											Tax Type
										</InputLabel>
										<Select
											value={valueSettings.Taxes[i].TaxTypeDscrp}
											onChange={e=> write && handleChange(e, i)}
											fullWidth
											inputProps={{
												name: 'TaxTypeDscrp',
											}}
											error={(valueSettings.Taxes[i].TaxTypeDscrp === '' || valueSettings.Taxes[i].TaxTypeDscrp == null)
												   &&	props.taxesRedValid? true: false}
										>
											{TaxType}
										</Select>
									</FormControl>
								</CustomToolTip>
							</Grid>
							<Grid item xs={12} md={3}>
									<FormControl className={classes.formControl}>
										<InputLabel
											htmlFor="Modality"
											error={(valueSettings.Taxes[i].TaxModality === '' || valueSettings.Taxes[i].TaxModality == null)
												   &&	props.taxesRedValid? true: false}
										>
											Modality
										</InputLabel>
										<Select
											value={valueSettings.Taxes[i].TaxModality}
											onChange={e=> write && handleChange(e, i)}
											fullWidth
											inputProps={{
												name: 'TaxModality',
											}}
											error={(valueSettings.Taxes[i].TaxModality === '' || valueSettings.Taxes[i].TaxModality == null) &&
												props.taxesRedValid? true: false}
										>
											{valueSettings.Taxes[i].TaxType!=='Percent' ? Modality:ModalityOnlyPerStay}
										</Select>
										<FormHelperText style={{color: 'red'}}>
										{(valueSettings.Taxes[i].TaxModality === 'Per Person' ||
										valueSettings.Taxes[i].TaxModality ==='Per Person/Per Night') && 'Adults only'}
										</FormHelperText>
									</FormControl>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									value={valueSettings.Taxes[i].TaxDescription}
									onChange={e=> write && handleChange(e, i)}
									name="TaxDescription"
									label="Description"
									fullWidth
								/>
							</Grid>
						{write && <Box display={{ xs: 'none', md: 'block'}} style={{paddingTop: '10px' }}>
							<Grid item md={1} >	
									<Tooltip title="Delete fee"><span>
										<IconButton aria-label='Delete' onClick={()=> delTax(i)}  >
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
			{Taxes}
			<CustomToolTip title="Add new tax">
				<Fab color="primary" aria-label="add" size="small" onClick={addTax}>
							<AddIcon />
				</Fab>
			</CustomToolTip>
		</div>
	);
};

export default Tab2Taxes;



