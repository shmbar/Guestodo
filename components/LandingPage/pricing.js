import React, {useState} from 'react';
import MMenu from './Menu/MainMenu'
import Footer from './Footer/footer'
import { makeStyles} from '@material-ui/core/styles';
import {Grid} from '@material-ui/core';
import {InputText} from 'primereact/inputtext';
import {InputTextarea} from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import Container from '@material-ui/core/Container';
import LocalPhoneOutlinedIcon from '@material-ui/icons/LocalPhoneOutlined';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import {Dropdown} from 'primereact/dropdown';
import bnr from './inner-banner-bg.jpg';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
	background:'white',
  },
banner:{	
	backgroundImage:  `url(${bnr})`, //'url(https://source.unsplash.com/random)', //  ,
   /* backgroundSize: 'cover',*/
	display: 'block',
	marginTop:'70px',
	height:'22em',
	backgroundAttachment: 'fixed',
	backgroundRepeat: 'no-repeat',
  },
  padding:	{
	  padding: theme.spacing(4),
  },
	container: {
		marginTop:'4em',
	}
	
}));

const Qprops = [
            {name: '1', code: 'one'},
            {name: '2', code: 'two'},
            {name: '3', code: 'three'},
            {name: '4', code: 'four'},
            {name: '5', code: 'five'},
			{name: '6', code: 'six'},
			{name: '7', code: 'seven'},
			{name: '8+', code: 'eigth'}
        ];


const Pricing = () => {
	const classes = useStyles();
	const [prp, setPrp] = useState(null);
	
	const onPrpChange = (e) => {
        setPrp(e.value);
    }
	
  	return (
		<div  /*p={props.smScreen ?1:7} */>
			<MMenu />
			<div className={classes.banner} />
			<Container maxWidth="md" className={classes.container}>
				<form className={classes.root} noValidate>
					<h2>Get a Quote</h2>
						<Grid container direction="row" justifyContent="flex-start" spacing={5} style={{paddingTop: '16px'}}>
							<Grid item xs={12} md={6}  >
								<span className="p-float-label">
									<InputText id="in" className='customInpt' /*value={this.state.value} onChange={(e) => this.setState({value: e.target.value})} */ />
									<label htmlFor="in">Full Name</label>
								</span>
							</Grid>
							<Grid item xs={12} md={6} >
								<span className="p-float-label">
									<InputText id="in" className='customInpt' /*value={this.state.value} onChange={(e) => this.setState({value: e.target.value})} */ />
									<label htmlFor="in">Email</label>
								</span>
							</Grid>
							<Grid item xs={12} md={6} >
								<span className="p-float-label">
								 	<Dropdown id="float-dropdown"  className='customInpt' options={Qprops} value={prp} onChange={onPrpChange}  optionLabel="name" style={{padding: '0.25em'}}/>
								 	<label htmlFor="float-dropdown">Number of Properties</label>
                        		</span>
							</Grid>
							<Grid item xs={12} md={6} >
								<span className="p-float-label">
									<InputText id="in" className='customInpt' /*value={this.state.value} onChange={(e) => this.setState({value: e.target.value})} */ />
									<label htmlFor="in">Phone Number</label>
								</span>
							</Grid>
							<Grid item xs={12} >
									<span className="p-float-label">
										<InputText id="in" className='customInpt' /*value={this.state.value} onChange={(e) => this.setState({value: e.target.value})} */ />
										<label htmlFor="in">Company Name</label>
									</span>
							</Grid>
							<Grid item xs={12}  >
									<div >
										<InputTextarea rows={5} cols={30} autoResize={true} placeholder="Comment" className='customInpt' ></InputTextarea>
									</div>
									<div >
										 <Button label="Get A Quote" />
									</div>

							</Grid>
						</Grid>	
				</form> 	
				<Grid container direction="row" justifyContent="flex-start" spacing={5} style={{paddingTop: '5rem'}}>
					<Grid item xs={12} sm={6} style={{textAlign: 'center', border: '1px solid #ccc'}}>
						<div style={{display:'flex', justifyContent: 'center'}}>
							<LocalPhoneOutlinedIcon fontSize='default' style={{marginRight: '20px'}} />
							<h5>Phone</h5>
						</div>
						<p>+972-03-1234567</p>
					</Grid>
					<Grid item xs={12} sm={6} style={{textAlign: 'center', borderTop: '1px solid #ccc',  borderRight: '1px solid #ccc',  borderBottom: '1px solid #ccc'}}>
						<div style={{display:'flex', justifyContent: 'center'}}>
							<EmailOutlinedIcon fontSize='default' style={{marginRight: '20px'}} />
							<h5>Email</h5>
						</div>
						<p>info@guestodo.com</p>
					</Grid>
				</Grid>
				
				
			</Container>
			
			
			
			<Footer />
	</div>

  	);
}

export default Pricing;

// 