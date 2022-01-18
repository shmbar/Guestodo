import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	InputLabel,
	MenuItem,
	FormControl,
	Select,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	IconButton,
} from '@material-ui/core';

import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import DeleteIcon from '@material-ui/icons/Delete';


const useStyles = makeStyles((theme) => ({
	formControl: {
		width: 250,
	},
	apt: {
		marginLeft: '10px',
		fontFamily: '"Poppins", Sans-serif',
		fontSize: '17px',
	},
	prp: {
		fontSize: '15px',
		fontStyle: 'italic',
		fontFamily: '"Poppins", Sans-serif',
		pointerEvents: 'none',
	},
	table: {
		minWidth: 750,
		maxWidth: 850,
	},
	fnt: {
		fontFamily: '"Poppins", Sans-serif',
	},
}));

const ConnectAptsTable = (props) => {
	const classes = useStyles();

	return (
		<TableContainer component={Paper} style={{ width: 'fit-content', marginTop: '30px' }}>
			<Table className={classes.table} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell className={classes.fnt}>Tokeet Apartments</TableCell>
						<TableCell align="left" className={classes.fnt}>
							GuesTodo Apartments
						</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{props.assignApts.map((x, i) => (
						<TableRow key={x.TokeetApt}>
							<TableCell className={classes.fnt} style={{ paddingTop: '30px' }}>
								{x.TokeetApt}
							</TableCell>
							<TableCell align="left">
								<FormControl className={classes.formControl}>
									<InputLabel htmlFor="grouped-select" 
										className={classes.fnt}>
										Apartment
									</InputLabel>
									<Select
										id="grouped-select"
										value={x.GstdApt}
										onChange={(e) => props.handleChange(e, i)}
									>
										{props.arrApts.map((y, k) => {
											return (
												<MenuItem
													key={k}
													className={
														y.val === 'apt' ? classes.apt :
														classes.prp
													}
													value={y.name}
												>
													{y.name}
												</MenuItem>
											);
										})}
									</Select>
								</FormControl>
							</TableCell>
							<TableCell className={classes.fnt} style={{ paddingTop:
												   '30px' }}>
								<div style={{ display: 'inline-flex' }}>
									<Tooltip title="Connect between Tokeet and GuesTodo apartments">
										<span>
											<IconButton
												aria-label="Edit"
												onClick={() => props.importLine(i)}
												disabled={x.GstdApt === ''  || !x.connectIcn}
											>
												<CompareArrowsIcon />
											</IconButton>
										</span>
									</Tooltip>
									<Tooltip title="Clear">
										<span>
											<IconButton
												aria-label="Delete"
												onClick={() => props.clrLine(i)}
											>
												<DeleteIcon />
											</IconButton>
										</span>
									</Tooltip>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default ConnectAptsTable;