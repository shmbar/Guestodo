import React from 'react';
import TableFilter from './TableFilter';
import ColFilter from './ColumnsFilter';
import ExportData from './exportToExcel';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import Search from '@material-ui/icons/Search';
import Grid from '@material-ui/core/Grid';
import useWindowSize from '../../../hooks/useWindowSize';
import './headercss.css';

const useStyles = makeStyles(theme => ({
 inputFocused: {
	transition: theme.transitions.create("width"),
    [theme.breakpoints.up("md")]: {
      width: 200,
      "&:focus": {
        width: 200
      }
  },
 },
 container: {
    display: 'flex',
    flexWrap: 'wrap',
  },

}));



const Header = (props) =>{
   
	const classes = useStyles();
	const scrSize = useWindowSize();

    const {cols, tableData, showFilter, runFltr , resetFltr, onChange, searchValue,
    handleToggleCols, showSearch} = props;
	
    return(
        <Grid container spacing={3} >
			<Grid item xs={12} sm={9} style={{display:'flex'}} >
			 	<Grid container spacing={4} justifyContent='flex-start' className={classes.container} alignItems="flex-end">
					{showSearch && <Grid item xs={12} sm={4} md={2}>
						<Input
							className='searchInput'
							fullWidth
							value={searchValue}
							onChange={onChange}
							placeholder='Search...'
							endAdornment={<InputAdornment position="end">
								<Search style={{color: '#ccc'}} />
							</InputAdornment>}
							classes={{focused: classes.inputFocused}}
						  />
					</Grid> }
				</Grid>	
        	</Grid>
			<Grid item xs={12} sm={3} style={{display:'flex', justifyContent: 'flex-end'}}>
                {scrSize!=='xs' && <TableFilter runFltr={runFltr} showFilter={showFilter}
                          	resetFltr={resetFltr} /> }
                <ColFilter cols={cols} handleToggleCols={handleToggleCols}/>  
                <ExportData data={tableData} cols={cols}/>
            </Grid>
           
		</Grid>	
        );
};

export default  Header;

/*


*/