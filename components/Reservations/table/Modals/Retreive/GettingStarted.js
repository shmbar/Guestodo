import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {SelectContext} from '../../../../../contexts/useSelectContext';

const useStyles = makeStyles((theme) => ({
	mainGrid: {
		padding: theme.spacing(3),
	},
	gtgStarted: {
		fontFamily: '"Poppins", Sans-serif',
		fontSize: '24px',
        fontWeight: 600,
	},
	txt: {
		fontFamily: '"Poppins", Sans-serif',
		fontSize: '16px',
	  },
}));

const GettingStarted=(props)=>{
    const classes = useStyles();
	const {setPage} = useContext(SelectContext);

    return(
        <div className={classes.mainGrid}>
            <p className={classes.gtgStarted}>Getting Started</p>
            <p className={classes.txt}>Welcome to <b>Tokeet.com</b> connection wizard.</p>
            <p className={classes.txt}>This integration allows you to import Tokeet's rentals
			 information and will save you time and effort.</p>
			<p className={classes.txt}>You must have at least one property set in your settings.</p>
			{props.settings.properties.length===0 && 
				<p className={classes.txt}>Click here to set Properties <span style={{color: 'blue', cursor: 'pointer'}}
							onClick={()=>setPage('Properties')}>here </span> </p>
			}
            <p className={classes.txt}>Please follow the 3 steps connection.</p> 
			
			<p className={classes.txt}>Click <span style={{color: 'blue', cursor: 'pointer'}}
							onClick={()=>props.setValueTab(1)}>here </span> to move to Step 1</p>
	
        </div>
       
    )
}

export default GettingStarted;