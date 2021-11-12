import React, { useContext } from 'react';
import { Grid, Divider, TextField } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { SettingsContext } from '../../../contexts/useSettingsContext';
import InputAdornment from '@material-ui/core/InputAdornment';
import { FormControl, Select, MenuItem, InputLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { SelectContext } from '../../../contexts/useSelectContext';
import { idToItem } from '../../../functions/functions.js';
import Tooltip from '@material-ui/core/Tooltip';

const dateFormat = require('dateformat');
function nextDay(date) {
	let nextD = new Date(dateFormat(date, 'dd-mmm-yyyy'));
	return nextD.setDate(nextD.getDate() + 1);
}

function lastDay(date) {
	let lastD = new Date(dateFormat(date, 'dd-mmm-yyyy'));
	return lastD.setDate(lastD.getDate() - 1);
}

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

const Tab2Details = (props) => {
	const { valueSettings, redValid, settings, settingsShows } = useContext(SettingsContext);
	const { valueOwner } = useContext(SelectContext);

	const classes = useStyles();

	let deletetOwners =
		settings.owners != null ? settings.owners.filter((x) => !x.show).map((x) => x.item) : [];

	let ownersArr = !props.runFromOrders
		? settings.owners != null
			? [
					...new Set(
						settings.owners
							.filter((y) => y.show || y.id === valueSettings.Owner)
							.map((z) => z.item)
					),
			  ]
			: []
		: [valueOwner.owner];
	let ownersMenu = ownersArr.map((s, i) => {
		return (
			<MenuItem
				key={s}
				value={s}
				disabled={deletetOwners.includes(s)}
				className={deletetOwners.includes(s) ? 'dltItem' : null}
			>
				{s}
			</MenuItem>
		);
	});

	let deletedFund =
		settings.funds != null ? settings.funds.filter((x) => !x.show).map((x) => x.Fund) : [];

	let fundsArr =
		settings.funds != null
			? [
					...new Set(
						settings.funds
							.filter(
								(z) =>
									(z.Owner === valueSettings.Owner && z.show) ||
									(z.item === valueSettings.Fund && !z.show)
							)
							.map((x) => x.item)
					),
			  ]
			: [];
	let fundsArrMenu = fundsArr.map((s, i) => {
		return (
			<MenuItem
				key={i}
				value={s}
				disabled={deletedFund.includes(s)}
				className={deletedFund.includes(s) ? 'dltItem' : null}
			>
				{s}
			</MenuItem>
		);
	});

	const YesNo = ['Yes', 'No'].map((s, i) => {
		return (
			<MenuItem key={i} value={s}>
				{s}
			</MenuItem>
		);
	});

	return (
		<div>
			<Grid container spacing={3}>
				<Grid item xs={12} md={7}>
					<FormControl className={classes.formControl}>
						<InputLabel
							htmlFor="Owner"
							error={valueSettings.Owner === '' && redValid ? true : false}
						>
							Owner Name
						</InputLabel>
						<Select
							value={idToItem(settings.owners, valueSettings.Owner, 'item')}
							onChange={props.handleChange}
							fullWidth
							inputProps={{
								name: 'Owner',
							}}
							error={valueSettings.Owner === '' && redValid ? true : false}
						>
							{ownersMenu}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} md={5}>
					<TextField
						value={valueSettings.PrpName}
						onChange={props.handleChange}
						name="PrpName"
						label="Property Name"
						fullWidth
						error={valueSettings.PrpName === '' && redValid ? true : false}
					/>
				</Grid>
				<Grid item xs={12} md={4}>
					<Tooltip title={valueSettings.Owner === '' ? 'Select owner first' : ''} arrow>
						<FormControl className={classes.formControl}>
							<InputLabel
								htmlFor="Fund"
								error={valueSettings.Fund === '' && redValid ? true : false}
							>
								Fund
							</InputLabel>
							<Select
								value={idToItem(settings.funds, valueSettings.Fund, 'item')}
								onChange={props.handleChange}
								fullWidth
								disabled={valueSettings.Owner === ''}
								inputProps={{
									name: 'Fund',
								}}
								error={valueSettings.Fund === '' && redValid ? true : false}
							>
								{fundsArrMenu}
							</Select>
						</FormControl>
					</Tooltip>
				</Grid>
				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<Grid item xs={12} md={4}>
						<KeyboardDatePicker
							autoOk
							disableToolbar
							okLabel={false}
							clearable
							label="Start Date"
							value={valueSettings.StartDate}
							onChange={(date) => props.handleChangeD('StartDate', date)}
							maxDate={
								valueSettings.EndDate === null
									? '2999-12-12'
									: lastDay(valueSettings.EndDate)
							}
							initialFocusedDate={
								new Date(dateFormat(valueSettings.StartDate, 'yyyy-mm-dd'))
							}
							format="dd-MMM-yyyy"
							fullWidth
							InputProps={{
								readOnly: true,
							}}
							error={valueSettings.StartDate === null && redValid ? true : false}
						/>
					</Grid>
				</MuiPickersUtilsProvider>
				{settingsShows[valueSettings.id] && (
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<Grid item xs={12} md={4}>
							<KeyboardDatePicker
								autoOk
								disableToolbar
								okLabel={false}
								clearable
								format="dd-MMM-yyyy"
								label="End Date"
								value={valueSettings.EndDate}
								onChange={(date) => props.handleChangeD('EndDate', date)}
								minDate={
									valueSettings.StartDate !== null &&
									nextDay(valueSettings.StartDate)
								}
								initialFocusedDate={
									new Date(dateFormat(valueSettings.StartDate, 'yyyy-mm-dd'))
								}
								fullWidth
								InputProps={{
									readOnly: true,
								}}
								//		error={valueSettings.EndDate===null && redValid ? true: false}
							/>
						</Grid>
					</MuiPickersUtilsProvider>
				)}
			</Grid>

			<Grid item xs={12} style={{ paddingBottom: '12px' }}>
				<Divider style={{ marginBottom: '10px' }} />
				Management Commission Settings
			</Grid>

			
			<Grid container direction="row" spacing={3}>
				<Grid item xs={12} md={6}>
						<TextField
							value={valueSettings.ManagCommission}
							onChange={props.handleChange}
							name="ManagCommission"
							label="Reservation Commission"
							fullWidth
							InputProps={{
								endAdornment: <InputAdornment position="end">%</InputAdornment>,
							}}
							error={valueSettings.ManagCommission === '' && redValid ? true : false}
						/>
				</Grid>
				<Grid item xs={12} md={3}>
						<FormControl className={classes.formControl}>
							<InputLabel
								htmlFor="inclVat"
								error={
									(valueSettings.inclVat === '' ||
										valueSettings.inclVat == null) &&
									redValid
										? true
										: false
								}
							>
								Include Vat
							</InputLabel>
							<Select
								value={valueSettings.inclVat}
								onChange={props.handleChange}
								fullWidth
								inputProps={{
									name: 'inclVat',
								}}
								error={
									(valueSettings.inclVat === '' ||
										valueSettings.inclVat == null) &&
									redValid
										? true
										: false
								}
							>
								{YesNo}
							</Select>
						</FormControl>
				</Grid>
				<Grid item xs={12} md={3}>
						<FormControl className={classes.formControl}>
							<InputLabel
								htmlFor="addVat"
								error={
									(valueSettings.addVat === '' || valueSettings.addVat == null) &&
									redValid
										? true
										: false
								}
							>
								Add Vat
							</InputLabel>
							<Select
								value={valueSettings.addVat}
								onChange={props.handleChange}
								fullWidth
								inputProps={{
									name: 'addVat',
								}}
								error={
									(valueSettings.addVat === '' || valueSettings.addVat == null) &&
									redValid
										? true
										: false
								}
							>
								{YesNo}
							</Select>
						</FormControl>
				</Grid>
			</Grid>
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
		</div>
	);
};

export default Tab2Details;