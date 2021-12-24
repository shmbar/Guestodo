import React from 'react';

import Tab2Dtls from './PrpTabs/Tab2Dtls'
import Tab2Fees from './PrpTabs/Tab2Fees'
import Tab2Vat from './PrpTabs/Tab2Vat'
import Tab2Taxes from './PrpTabs/Tab2Taxes'
import Tab2Commission from './PrpTabs/Tab2Commission'

const Tab2Details = (props) => {
	

	return (
		<div>
		
			{props.valueTab===0 && <Tab2Dtls handleChange={props.handleChange} handleChangeD={props.handleChangeD}/>	}
			{props.valueTab===1 && <Tab2Fees feesRedValid={props.feesRedValid}/>	}
			{props.valueTab===2 && <Tab2Vat />	}
			{props.valueTab===3 && <Tab2Taxes taxesRedValid={props.taxesRedValid}/>	}
			{props.valueTab===4 && <Tab2Commission />	}
			
		</div>
	);
};

export default Tab2Details;
