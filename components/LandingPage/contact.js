import React, {useContext} from 'react';
import MMenu from './Menu/MainMenu'
import { makeStyles } from '@material-ui/core/styles';
import CForm from './contactform';
import Footer from './Footer/footer'
import { Container } from '@material-ui/core';
import {RcContext} from '../../contexts/useRcContext';
import SnackBar from '../Subcomponents/SnackBar';



const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: '#193E6D',
		marginTop: '80px',
		padding: '40px 0',
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
    	fontSize: '36px',
    	fontWeight: 600,
    	lineHeight: '55px',
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
						We'll be happy to discuss your concerns and answer all your questions
					</div>
				</Container>
			</div>

			<Container maxWidth="lg" className={classes.container} style={{paddingBottom: '60px'}}>
				<CForm setSnackbar={setSnackbar}/>
			</Container>
			<Footer />
		</div>

	);
}

export default Contact;

