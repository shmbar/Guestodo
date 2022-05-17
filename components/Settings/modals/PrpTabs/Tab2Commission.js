import React, { useContext } from 'react';
import {
	Grid,
	TextField,
	FormHelperText,
	FormControl,
	Checkbox,
	FormControlLabel,
	Typography,
	Paper,
} from '@material-ui/core';
import { SettingsContext } from '../../../../contexts/useSettingsContext';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { AuthContext } from '../../../../contexts/useAuthContext';

import clsx from 'clsx';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';

import InputAdornment from '@material-ui/core/InputAdornment';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	formControl: {
		width: '100%',
		minWidth: 120,
	},
	icon: {
		borderRadius: '50%',
		width: 16,
		height: 16,
		boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
		backgroundColor: '#f5f8fa',
		backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
		'$root.Mui-focusVisible &': {
			outline: '2px auto rgba(19,124,189,.6)',
			outlineOffset: 2,
		},
		'input:hover ~ &': {
			backgroundColor: '#ebf1f5',
		},
	},
	checkedIcon: {
		backgroundColor: '#43a047',
		backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
		'&:before': {
			display: 'block',
			width: 16,
			height: 16,
			backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
			content: '""',
		},
		'input:hover ~ &': {
			backgroundColor: '#106ba3',
		},
	},
	paper: {
		padding: '13px 10px 0px 7px',
	},
}));

const GreenCheckbox = withStyles({
	root: {
		'&$checked': {
			color: green[600],
		},
		padding: '5px',
	},
	checked: {},
})((props) => <Checkbox color="default" {...props} />);

const Tab2Commission = (props) => {
	const { valueSettings, redValid, selectValueSettings, settings } = useContext(SettingsContext);
	const { write } = useContext(AuthContext);

	const classes = useStyles();

	/*const objCmsnType = [
		{ type: 'Base Charge Only', num: 0 },
		{ type: 'Base Charge Plus Extra Fee', num: 1 },
		{ type: 'Total Amount Paid By Guest', num: 2 },
		{ type: 'Payout plus Extra Fee', num: 3 },
	]; 

	const cmsnType = objCmsnType
		.map((x) => x.type)
		.map((s, i) => {
			return (
				<MenuItem key={i} value={s}>
					{s}
				</MenuItem>
			);
		});
	*/

	const cmsnNum = (n) => {
		//Clean commas and validate numbers
		return /^\d+$/.test(n) && n.length <= 3 ? n : n.substring(0, n.length - 1);
	};

	const handleChange = (e) => {
		let tmp = e.target.name === 'ManagCommission' ? cmsnNum(e.target.value) : e.target.value;
		let tmpObj = valueSettings.Commissions;

		if (
			e.target.name === 'inclVat' ||
			e.target.name === 'addVat' ||
			e.target.name === 'extraFee' ||
			e.target.name === 'channelSrvFee' 
		) {
			tmpObj = { ...tmpObj, [e.target.name]: e.target.checked };
			/*	} else if (e.target.name === 'CommissionType') {
			tmpObj = {
				...tmpObj,
				[e.target.name]: objCmsnType.filter((x) => x.type === tmp)[0]['num'],
			};*/
		} else{
			tmpObj = { ...tmpObj, [e.target.name]: tmp };
		}

		selectValueSettings({ ...valueSettings, Commissions: tmpObj });
	};

	function StyledRadio(props) {
		const classes = useStyles();

		return (
			<Radio
				className={classes.root}
				color="default"
				checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
				icon={<span className={classes.icon} />}
				{...props}
			/>
		);
	}

	return (
		<Grid container spacing={4}>
			<Grid item xs={12} md={3}>
				<TextField
					value={valueSettings.Commissions.ManagCommission}
					onChange={(e) => write && handleChange(e)}
					name="ManagCommission"
					label="Management Commission"
					fullWidth
					InputProps={{
						endAdornment: <InputAdornment position="end">%</InputAdornment>,
					}}
					error={
						valueSettings.Commissions.ManagCommission === '' && redValid ? true : false
					}
				/>
			</Grid>
			<Grid item xs={12} md={4} style={{ padding: '35px' }}>
				<Grid container direction="column" justifyContent="center" alignItems="flex-start">
					<Grid item>
						<Typography variant="subtitle1">Apply on:</Typography>
					</Grid>
					<Grid item>
						<FormControl>
							<FormControlLabel
								control={<GreenCheckbox checked={true} />}
								label="Base Charge"
								disabled={true}
								labelPlacement="end"
							/>
						</FormControl>
					</Grid>
					<Grid item>
						<FormControl>
							<FormControlLabel
								control={
									<GreenCheckbox checked={valueSettings.Commissions.extraFee} />
								}
								onChange={handleChange}
								name="extraFee"
								label="Extra Fee"
								labelPlacement="end"
							/>
						</FormControl>
					</Grid>
					<Grid item>
						<FormControl>
							<FormControlLabel
								control={
									<GreenCheckbox
										checked={valueSettings.Commissions.channelSrvFee}
									/>
								}
								onChange={handleChange}
								name="channelSrvFee"
								label="Channel Service Fee"
								labelPlacement="end"
							/>
						</FormControl>
					</Grid>
					<Grid item>
						<FormControl>
							<FormControlLabel
								control={<GreenCheckbox checked={valueSettings.Commissions.inclVat} />}
								onChange={handleChange}
								name="inclVat"
								label="VAT - Property"
								labelPlacement="end"
							/>
						</FormControl>
					</Grid>
					<Grid item>
						<Paper variant="outlined" className={classes.paper}>
							<FormControl component="fieldset">
								<FormLabel component="legend">Cleaning Fee</FormLabel>
								<RadioGroup 
									value={valueSettings.Commissions.clnFee===undefined ? 'noclnfee' :
									valueSettings.Commissions.clnFee}
									onChange={handleChange}>
									<FormControlLabel
										value="perc"
										control={<StyledRadio />}
										label="Cleaning Fee %"
										name ='clnFee'
									/>
									<FormControlLabel
										value="flat"
										control={<StyledRadio />}
										name ='clnFee'
										label={`Cleaning Fee: ${
											valueSettings.ClnFee
												? `${settings.CompDtls.currency} ${valueSettings.ClnFee}`
												: 'Set the amount in the next Tab'
										} `}
									/>
									<FormControlLabel
										value="noclnfee"
										control={<StyledRadio />}
										name ='clnFee'
										label="No Cleaning Fee"
									/>
								</RadioGroup>
							</FormControl>
						</Paper>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={12} md={4} style={{ padding: '35px' }}>
				<Grid item>
					<FormControl>
						<FormControlLabel
							control={<GreenCheckbox checked={valueSettings.Commissions.addVat} />}
							onChange={handleChange}
							name="addVat"
							label="VAT - Company"
							labelPlacement="end"
						/>
						 <FormHelperText>Charge VAT on the commission you collect </FormHelperText>
					</FormControl>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default Tab2Commission;

/*
	<Grid container direction="row" spacing={3}>
				<Grid item xs={12} md={6}>
					<TextField
							value={valueSettings.ExtraRevCommission}
							onChange={props.handleChange}
							name="ExtraRevCommission"
							label="Extra Revenue Commission"
							fullWidth
							InputProps={{
								endAdornment: <InputAdornment position="end">%</InputAdornment>,
							}}
					/>
				</Grid>
			</Grid> 
*/

/*
<Grid item xs={12} md={4}>
				<FormControl className={classes.formControl}>
					<InputLabel htmlFor="CommissionType">Commission Type (%)</InputLabel>
					<Select
						value={
							valueSettings.Commissions.CommissionType !== undefined
								? objCmsnType.filter(
										(x) => x.num === valueSettings.Commissions.CommissionType
								  )[0]['type']
								: null
						}
						onChange={(e) => write && handleChange(e)}
						fullWidth
						inputProps={{
							name: 'CommissionType',
						}}
					>
						{cmsnType}
					</Select>
				</FormControl>
			</Grid>

			<Grid item xs={12} md={2}>
				<FormControl className={classes.formControl}>
					<InputLabel htmlFor="inclVat">Include VAT</InputLabel>
					<Select
						value={
							valueSettings.Commissions.inclVat !== ''
								? valueSettings.Commissions.inclVat
									? 'Yes'
									: 'No'
								: ''
						}
						onChange={(e) => write && handleChange(e)}
						fullWidth
						inputProps={{
							name: 'inclVat',
						}}
					>
						{YesNo}
					</Select>
					<FormHelperText>
						<p>
							<b>Yes</b>: If you wish to charge the commission percentage from
							property reservation revenue amount including VAT.{' '}
						</p>
						<b>No</b>: If you wish to charge the commission percentage from property
						reservation revenue before vat or if the property’s region doesn't charge
						VAT by law.
					</FormHelperText>
				</FormControl>
			</Grid>
			<Grid item xs={12} md={2}>
				<FormControl className={classes.formControl}>
					<InputLabel htmlFor="addVat">Add VAT</InputLabel>
					<Select
						value={
							valueSettings.Commissions.addVat !== ''
								? valueSettings.Commissions.addVat
									? 'Yes'
									: 'No'
								: ''
						}
						onChange={(e) => write && handleChange(e)}
						fullWidth
						inputProps={{
							name: 'addVat',
						}}
					>
						{YesNo}
					</Select>
					<FormHelperText>
						<p>
							<b>Yes</b>: If you wish to charge VAT on the commission you collect from
							the property owner.
						</p>
						<b>No</b>: If property’s region doesn't charge VAT by law.
					</FormHelperText>
				</FormControl>
			</Grid>
			<Grid item xs={12} md={2}>
				<FormControl className={classes.formControl}>
					<InputLabel htmlFor="clnFee">Cleaning Fee</InputLabel>
					<Select
						value={
							valueSettings.Commissions.clnFee !== ''
								? valueSettings.Commissions.clnFee
									? 'Yes'
									: 'No'
								: ''
						}
						onChange={(e) => write && handleChange(e)}
						fullWidth
						inputProps={{
							name: 'clnFee',
						}}
					>
						{YesNo}
					</Select>
					<FormHelperText>
						<p>
							<b>Yes</b>: If you wish to charge property
						</p>
					</FormHelperText>
				</FormControl>
			</Grid>

*/