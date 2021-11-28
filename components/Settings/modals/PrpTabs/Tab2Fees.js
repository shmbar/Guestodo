import React, { useContext } from 'react';
import { Grid, TextField, Tooltip, Fab } from '@material-ui/core';
import { SettingsContext } from '../../../../contexts/useSettingsContext';
import { FormControl, Select, MenuItem, InputLabel } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';	

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
	const { valueSettings, redValid, } = useContext(SettingsContext);
	

	const classes = useStyles();

	
	const addFee= ()=>{
        //selectValueSettings(createEmptyObj());
    };
	
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
	
	return (
		<div>
			<Grid container spacing={3}>
				<Grid item xs={12} md={3}>
			  		<CustomToolTip title="Insert a fee name">
						<TextField
							value={valueSettings.PrpFee}
							onChange={props.handleChange}
							name="PrpFee"
							label="Fee Name"
							fullWidth
							error={valueSettings.PrpFee === '' && redValid ? true : false}
						/>
					</CustomToolTip>
				</Grid>
				<Grid item xs={12} md={3}>
					<CustomToolTip title="Select type of fee">
						<FormControl className={classes.formControl}>
							<InputLabel
								htmlFor="FeeType"
								error={(valueSettings.FeeType === '' || valueSettings.FeeType == null) &&	redValid? true: false}
							>
								Fee Type
							</InputLabel>
							<Select
								value={valueSettings.FeeType}
								onChange={props.handleChange}
								fullWidth
								inputProps={{
									name: 'FeeType',
								}}
								error={(valueSettings.FeeType === '' || valueSettings.FeeType == null) &&	redValid? true: false}
							>
								{YesNo}
							</Select>
						</FormControl>
					</CustomToolTip>
				</Grid>
				<Grid item xs={12} md={3}>
					<CustomToolTip title="Insert fee amount/percent">
						<TextField
							value={valueSettings.FeeAmount}
							onChange={props.handleChange}
							name="FeeAmount"
							label={`Amount ${valueSettings.FeeType==='Percent' ? '(%)' : '($)'}`}
							fullWidth
							error={valueSettings.FeeAmount === '' && redValid ? true : false}
						/>
					</CustomToolTip>
				</Grid>
				<Grid item xs={12} md={3}>
						<FormControl className={classes.formControl}>
							<InputLabel
								htmlFor="Modality"
								error={(valueSettings.FeeModality === '' || valueSettings.FeeModality == null) &&	redValid? true: false}
							>
								Modality
							</InputLabel>
							<Select
								value={valueSettings.FeeModality}
								onChange={props.handleChange}
								fullWidth
								inputProps={{
									name: 'Modality',
								}}
								error={(valueSettings.FeeModality === '' || valueSettings.FeeModality == null) &&	redValid? true: false}
							>
								{Modality}
							</Select>
						</FormControl>
				</Grid>
				<Grid item xs={12} md={6}>
					<TextField
						value={valueSettings.FeeDescription}
						onChange={props.handleChange}
						name="Description"
						label="Description"
						fullWidth
						error={valueSettings.FeeDescription === '' && redValid ? true : false}
					/>
				</Grid>
			
			
		</Grid>
			<CustomToolTip title="Add new fee">
				<Fab color="primary" aria-label="add" style={{marginTop: '30px'}} size="small" onClick={addFee}>
							<AddIcon />
				</Fab>
			</CustomToolTip>
		</div>
	);
};

export default Tab2Fees;



