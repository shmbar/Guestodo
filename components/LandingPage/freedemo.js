import React, {useContext} from 'react';
import MMenu from './Menu/MainMenu'
import { makeStyles } from '@material-ui/core/styles';
import DForm from './demoform';
import Footer from './Footer/footer'
import { Container } from '@material-ui/core';
import {RcContext} from '../../contexts/useRcContext';
import SnackBar from '../Subcomponents/SnackBar';



const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: '#193E6D',
		marginTop: '80px',
		padding: '25px 0',
		[theme.breakpoints.down('md')]: {
      			marginTop: '70px',
    	},
	},
	container: {
		marginTop: '3em',
	},
	containerBlueUpperText: {
        color: '#193e6d',
    	fontFamily: '"Poppins", Sans-serif',
    	fontSize: '25px',
    	fontWeight: 600,
    	lineHeight: '50px',
    	letterSpacing: '0.2px',
		textAlign: 'left',
		[theme.breakpoints.down('md')]: {
      			lineHeight: '45px',
    	},
		[theme.breakpoints.down('sm')]: {
      			fontSize: '25px',
    	},
	}
}))

const Contact = (props) => {
	const classes = useStyles();
	const {setSnackbar, snackbar} = useContext(RcContext);
	
	return (
		<div >
			<MMenu />
			
			<SnackBar msg={snackbar.msg} snackbar={snackbar.open} setSnackbar={setSnackbar}
				variant={snackbar.variant}/>
			<div className={classes.root}>
				<Container maxWidth='lg'>
					<div className={classes.containerBlueUpperText} style={{ textAlign: 'center', fontWeight: 400, color: '#ffffff' }}>
						<p>Our product experts are ready to give you a comprehensive, walkthrough of GuesTodo software.</p>
						<p>When you’re ready, book a free demo and see how GuesTodo can satisfy your needs.</p>
					</div>
				</Container>
			</div>

			<Container maxWidth="lg" className={classes.container} style={{paddingBottom: '60px'}}>
				<DForm setSnackbar={setSnackbar}/>
			</Container>
			<Footer />
		</div>

	);
}

export default Contact;

