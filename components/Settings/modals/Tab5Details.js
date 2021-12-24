import React, { useContext } from 'react';
import { SettingsContext } from '../../../contexts/useSettingsContext';
import {
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    FormControlLabel,
    Checkbox,
    Grid,
    TextField,
    InputAdornment,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Tooltip from '@material-ui/core/Tooltip';

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

const Tab5Details = (props) => {

    const { valueSettings, redValid, settings } = useContext(SettingsContext);
    const classes = useStyles();

    let deletetOwners =
        settings.owners !== undefined
            ? settings.owners.filter((x) => !x.show).map((x) => x.item)
            : [];

    let titlesMenu = props.roles.map((s, i) => {
        return (
            <MenuItem key={s} value={s}>
                {s}
            </MenuItem>
        );
    });

    let ownersArr =
        settings.owners !== undefined ? [...new Set(settings.owners.map((z) => z.item))] : [];
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

    const CustomToolTip = withStyles({
        tooltip: {
            fontSize: 13,
        },
    })(Tooltip);

    const GreenCheckbox1 = withStyles({
        root: {
            '&$checked': {
                color: green[600],
            },
            tooltip: {
                color: 'lightblue',
                backgroundColor: 'green',
            },
        },
        checked: {},
    })((props) => (
        <CustomToolTip title="Enable password update">
            <Checkbox {...props} />
        </CustomToolTip>
    ));

    const GreenCheckbox = withStyles({
        root: {
            '&$checked': {
                color: green[600],
            },
        },
        checked: {},
    })((props) => <Checkbox {...props} />);

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    return (
        <Grid container direction="column">
            <FormControl className={classes.formControl}>
                <InputLabel
                    htmlFor="role"
                    //	error={valueSettings.OwnerName === '' && redValid ? true : false}
                >
                    Role
                </InputLabel>
                <Select
                    value={valueSettings.role}
                    onChange={props.handleChange}
                    fullWidth
                    inputProps={{
                        name: 'role',
                    }}
                    error={valueSettings.role === '' && redValid ? true : false}
                >
                    {titlesMenu}
                </Select>
            </FormControl>

            {valueSettings.role === 'Property Owner' && (
                <FormControl className={classes.formControl} style={{ marginTop: 8 }}>
                    <InputLabel
                        htmlFor="OwnerName"
                        error={valueSettings.OwnerName === '' && redValid ? true : false}
                    >
                        Name
                    </InputLabel>
                    <Select
                        value={valueSettings.OwnerName}
                        onChange={props.handleChange}
                        fullWidth
                        inputProps={{
                            name: 'OwnerName',
                        }}
                        error={valueSettings.OwnerName === '' && redValid ? true : false}
                    >
                        {ownersMenu}
                    </Select>
                </FormControl>
            )}

            {valueSettings.role !== 'Property Owner'  && (
                <TextField
                    value={valueSettings.username}
                    onChange={props.handleChange}
                    name="username"
                    label="Name"
                    fullWidth
                    margin="dense"
                    disabled={valueSettings.role === 'Property Owner' || valueSettings.role===''}
                    error={valueSettings.username === '' && redValid ? true : false}
                />
            )}
            <TextField
                value={valueSettings.email}
                onChange={props.handleChange}
                name="email"
                label="Email"
                fullWidth
				disabled={valueSettings.role===''}
                margin="dense"
                error={valueSettings.email === '' && redValid ? true : false}
            />
            <Grid container direction="row" alignItems="center">
                <Grid item xs={10}>
                    <TextField
                        value={valueSettings.password}
                        onChange={props.handleChange}
                        name="password"
                        autoComplete="new-password"
                        label="Password"
						helperText={valueSettings.passYN ? '8 characters, one digit, one Uppercase letter' : ''}
                        margin="dense"
                        disabled={!valueSettings.passYN || valueSettings.role===''}
                        type="password"
                        fullWidth
                        error={valueSettings.passYN && valueSettings.password === '' && redValid ? true : false}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <LockOutlinedIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Grid
                        container
                        direction="column"
                        alignItems="center"
                        style={{ paddingTop: '15px' }}
                    >
                        <GreenCheckbox1
                            {...label}
                            checked={valueSettings.passYN}
                            onChange={props.handleChangeTrueFalse('passYN')}
                        />
                    </Grid>
                </Grid>
            </Grid>
			            <Grid container direction="row" alignItems="center">
                <Grid item xs={10}>
                    <TextField
                        value={valueSettings.password1}
                        onChange={props.handleChange}
                        name="password1"
                        autoComplete="new-password"
                        label="Password Confirmation"
                        disabled={!valueSettings.passYN || valueSettings.role===''}
                        type="password"
                        fullWidth
                        error={valueSettings.passYN && valueSettings.password1 === '' && redValid ? true : false}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <LockOutlinedIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
            </Grid>
		   
		   
		   

            <Grid container direction="row" style={{ paddingTop: '12px' }}>
                {(valueSettings.role !== 'Property Owner' && valueSettings.role !== 'House Stuff') && (
                    <Grid item>
                        <FormControlLabel
                            control={
                                <GreenCheckbox
                                    checked={valueSettings.admin}
                                    onChange={props.handleChangeTrueFalse('admin')}
                                    value="end"
									disabled={valueSettings.role===''}
                                />
                            }
                            label="Admin"
                            labelPlacement="end"
                        />
                    </Grid>
                )}
                <Grid item>
                    <FormControlLabel
                        value="end"
                        control={<Checkbox checked={true} value="Read" />}
                        //onChange={props.handleChangeTrueFalse('write')}
                        label="Read"
                        labelPlacement="end"
                        disabled={true}
                    />
                </Grid>
                <Grid item>
                    <FormControlLabel
                        control={
                            <GreenCheckbox
                                checked={valueSettings.write}
                                onChange={props.handleChangeTrueFalse('write')}
                                value="end"
								disabled={valueSettings.role===''}
                            />
                        }
                        label="Write"
                        labelPlacement="end"
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Tab5Details;