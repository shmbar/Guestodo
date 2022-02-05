import React from 'react';
import { Tooltip, Typography  } from '@material-ui/core';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import { withStyles } from '@material-ui/core/styles';

const Shape=({color,txt, cl})=>{
	
	const shape = {
		transform: 'scale(0.6) translate(4px, 0px) skew(-35deg, 0deg)',
		width: '50px', height:'30px',
		backgroundColor: cl ? color: 'none',
		border: '1px solid black',
		borderLeftWidth: !cl ? '8px': 'none',
		borderLeftColor: !cl ? color : 'none'
}
	
	return	(
			<div style={{display: 'inline-flex'}}>
				<div style={shape}></div>
				<span style={{fontSize: '20px', alignSelf:'center',
					paddingLeft: '10px'}}>=</span>
				<span style={{fontSize: '15px', alignSelf:'center',
					paddingLeft: '10px'}}>{txt}</span>
			</div>
		)
}

const HtmlTooltip = withStyles((theme) => ({
	tooltip: {
		backgroundColor: '#f5f5f9',
		color: 'rgba(0, 0, 0, 0.87)',
		maxWidth: 220,
		fontSize: theme.typography.pxToRem(12),
		border: '1px solid #dadde9',
	},
}))(Tooltip);

const TableTtl = (props) => {
	return (
		<h4 className="ttlClr">
			{props.ttl}
			<HtmlTooltip
				title={
					<React.Fragment>
						<Typography color="inherit">Definitions</Typography>
						<Shape color='yellow' txt='Tentative' cl={true}/>
						<Shape color='rgb(220, 228, 234)' txt='Confirmed' cl={true}/>
						<Shape color='rgb(242, 92, 99)' txt='Unpaid' cl={false}/>
						<Shape color='yellow' txt='Partially paid' cl={false}/>
						<Shape color='rgb(101, 225, 136)' txt='Fully paid' cl={false}/>
						<Typography color="inherit" style={{fontSize: '13px'}}>
							Canceled Reservations are not shown in Calendar</Typography>
					</React.Fragment>
				}
			>
				<ContactSupportIcon style={{marginLeft: '20px'}}/>
			</HtmlTooltip>
		</h4>
	);
};

export default TableTtl;