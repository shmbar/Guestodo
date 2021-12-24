import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import NavigationIcon from '@material-ui/icons/Navigation';

const useStyles = makeStyles((theme) => ({
  root: {
//	position: 'fixed',
  //  top: '4rem',
	  paddingLeft: 40,
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default function FloatingActionButtons(props) {
  const classes = useStyles();

	const goToPage=()=>{
		props.setPage(props.page)
	}
	
  return (
    <div className={classes.root}>
      <Fab variant="extended" color="secondary" style={{textTransform: 'capitalize'}} onClick={()=>goToPage()}>
        <NavigationIcon className={classes.extendedIcon} />
        	 {props.txt}
      </Fab>
    </div>
  );
}
