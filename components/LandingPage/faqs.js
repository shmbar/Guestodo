import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Link } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        paddingTop: '80px',
    },
    heading: {
        fontSize: theme.typography.pxToRem(17),
		color: '#193e6d',
		fontWeight: '600',
	},
	accordion: {
     	boxShadow: 'none'
}
}));

const fqs = [
			{ttl: 'How much does a subscription cost?', txt:<> Our plans are based on the total number of listings (Apartments, rooms, villas …) you manage. You can find the pricing calculator <Link to='/pricing'>here.</Link> </>},
			{ttl: 'How long does the trial period last?', txt: 'Once you have registered your account, you have 30 days in which you can access all features of the service. We recommend that you use this period to best configure your account and maximize your income. At the end of the trial period, you have to decide and choose which plan works for you and then make the payment.'},
			{ttl: 'What are the payment methods GuesTodo accepts?', txt: <>We currently accept all major credit / debit cards and Paypal thanks to integration with our reseller <a href='https://payproglobal.com/'>Paypro.</a></>}, 
			{ttl: 'Who is the target market of GuesTodo App?', txt: 'Airbnb entrepreneurs, vacation rental property management firms and property owners.'},
			{ttl: 'Is GuesTodo compatible with any of the existing channel managers?',
			 	txt: <>At this moment, GuesTodo has API with <a href='https://www.tokeet.com'>Tokeet.com</a> and we are in the process of creating a link to ensure compatibility with other channel manager software.</>},
			{ttl: 'Can I access GuesTodo App on my smartphone?', txt: 'Yes! GuesTodo is accessible through your smartphone.'},
			{ttl: 'Is my GuesTodo data secured?',
			 txt: <>Yes! GuesTodo is serviced by the Google cloud to store its data, your business information is safe and secured. For more details, see our <Link to='/privacy'>Privacy Policy.</Link></>},
			{ttl: 'Can property owners acess GuesTodo App to track the progress of their managed properties?',  
			 txt: 'Absolutely yes! Contracted vacation property management firms can give the property owners access to their specific accounts. Secured personalized confidential login credentials will be provided.'},
			{ttl: 'Will I be able to view the financial reports in excel?', txt: 'Yes! GuesTodo is compatible with Excel software.'},
			{ttl: 'As a property manager, will I be able to view the financial reports of my business?', 
			 		txt: 'Yes! GuesTodo provides you with a user-friendly app to deliver comprehensive detailed information necessary for your business operations.'},
			{ttl: 'Can GuesTodo provide my accountant with the necessary information he needs to ease his bookkeeping tasks?', txt: 'Yes! GuesTodo App was created to help you navigate with ease the tedious task of bookkeeping. The one click automated bookkeeping advantage saves you time, money and effort.'},
			{ttl: 'Can I cancel my subscription?', txt: 'Yes! You can terminate the service anytime without prior notice.'},
	
	
]


const Faqs = () => {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <div className={classes.root} >
            
			{
				fqs.map((x,i)=>{
					
				return(
					<Accordion key={i} expanded={expanded === i} onChange={handleChange(i)} className={classes.accordion}>
							<AccordionSummary 
								expandIcon={<ExpandMoreIcon />}
								aria-controls="panel1bh-content"
								id="panel1bh-header"
							>
                    		<Typography className={classes.heading}>{x.ttl}</Typography>
                	</AccordionSummary>
                	<AccordionDetails>
							<Typography style={{color: '#193e6d'}}>
								{x.txt}
							</Typography>
                	</AccordionDetails>
           			 </Accordion>
				)	
				})
				
			}
			
        </div>
    );
};

export default Faqs;