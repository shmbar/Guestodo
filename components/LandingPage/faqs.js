import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
			{ttl: 'How much does a subscription cost?', txt: 'As for now, the usage is free of charge.'},
			{ttl: 'Who is the target market of GuesTodo App?', txt: 'Airbnb entrepreneurs, vacation rental property management firms and property owners.'},
			{ttl: 'Is GuesTodo compatible with any of the existing channel managers?',
			 	txt: 'GuesTodo is in the process of creating a link to ensure compatibility with other channel manager software.'},
			{ttl: 'Can I access GuesTodo App on my smartphone?', txt: 'Yes! GuesTodo is accessible through your smartphone.'},
			{ttl: 'Is my GuesTodo data secured?', txt: 'Yes! GuesTodo is serviced by the Google cloud to store its data, your business information is safe and secured.'},
			{ttl: 'Can property owners acess GuesTodo App to track the progress of their managed properties?',  
			 txt: 'Absolutely yes! Contracted vacation property management firms can give the property owners access to their specific accounts. Secured personalized confidential login credentials will be provided.'},
			{ttl: 'Will I be able to view the financial reports in excel?', txt: 'Yes! GuesTodo is compatible with Excel software.'},
			{ttl: 'As a property manager, will I be able to view the financial reports of my business?', 
			 		txt: 'Yes! GuesTodo provides you with a user-friendly app to deliver comprehensive detailed information necessary for your business operations.'},
			{ttl: 'Can GuesTodo provide my accountant with the necessary information he needs to ease his bookkeeping tasks?', txt: 'Yes! GuesTodo App was created to help you navigate with ease the tedious task of bookkeeping. The one click automated bookkeeping advantage saves you time, money and effort.'},
	
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