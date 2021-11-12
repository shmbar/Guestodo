function addCommas(x) {
		var parts = Math.round(x).toString().split('.');
		return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

///////////////////////////////

function checkIfInArray(values){
	const arr = [3, 5.5];
	const sumOfY_axe = values.map(x=> x.value).reduce((a,b) => a + b, 0) //array is included in array
	return arr.indexOf(	sumOfY_axe	) !== -1
}

export const ExpCompare =(dtCrnt,dtCrntPrev,date, cur)=> {
            const obj = {
						labels: ['Jan', 'Feb','Mar','Apr','May','Jun', 'Jul', 'Aug', 'Sep','Oct','Nov','Dec'],
			 			datasets : [
							{
								label: date.year,
								backgroundColor: '#45afed',
								data: Object.values(dtCrnt)
							},
							{
								label: date.year-1,
								backgroundColor: '#999999',
								data: Object.values(dtCrntPrev)
							}
            				]    
					}
			
			const options = {
						plugins: {
							title: {
								display: true,
								text: `Expenses - K (${cur})`,
								font: {	size: 16}
							},
							legend: {
								position: 'bottom',
							},
							tooltip: {
							   	callbacks: {
									   label: function(context) {
										  return addCommas(	context.parsed.y.toString() )}}
								},
        				},
						maintainAspectRatio: false,
						scales: {
							y:{
								beginAtZero: true,
								ticks: {
										callback: function(value, index, values) {
											const YesNo = checkIfInArray(values)
											return YesNo ? 0 :  value/1000;    //addCommas(value/1000); //(value/1000).toFixed(1) //
										},
								},
								grid:{
									display: false
								}
							},
							x:{
								grid:{
									display: false
								}
							}
						},
    			};
			
		return {obj, options}
	
}			

//////////////////////////////////////////////////

export const RevenueCompare =(dtCrnt,dtPrev,dtCrnt1,dtPrev1,date, cur)=> {

	const obj = {
            labels: ['Jan', 'Feb','Mar','Apr','May','Jun', 'Jul', 'Aug', 'Sep','Oct','Nov','Dec'],
            datasets: [
                {	
					label: date.year + ' Rev',
				 	stack: 'Stack 0',
                    backgroundColor: '#45afed',
                    data: Object.values(dtCrnt)
                },
			 	{	
					label: date.year + ' Ex Rev'  ,
				 	stack: 'Stack 0',
                    backgroundColor: '#A0D5F6',
                    data: Object.values(dtCrnt1)
                },
                {	
                    label: date.year-1 + ' Rev',
					stack: 'Stack 1',
                    backgroundColor: '#999999',
                    data: Object.values(dtPrev)
                },
			 	{	
                    label: date.year-1 + ' Ex Rev',
					stack: 'Stack 1',
                    backgroundColor: '#D5D5D5',
                    data: Object.values(dtPrev1)
                }
            ]    
        	};

	const options = {
						plugins: {
							title: {
								display: true,
								text: `Revenue - K (${cur})`,
								font: {	size: 16}
							},
							legend: {
								position: 'bottom',
							},
							tooltip: {
							   	callbacks: {
									   label: function(context) {
										  return addCommas(	context.parsed.y.toString() )}}
								},
        				},
						maintainAspectRatio: false,
						scales: {
							y:{
								beginAtZero: true,
								ticks: {
										callback: function(value, index, values) {
											const YesNo = checkIfInArray(values)
											return YesNo ? 0 :  value/1000;    //addCommas(value/1000); //(value/1000).toFixed(1) //
										},
								},
								grid:{
									display: false
								}
							},
							x:{
								grid:{
									display: false
								}
							}
						},
    			};
		
	return {obj, options};
	
}

/////////////////////////////////////////////////////////////////////////////////////

export const PLCompare=(dtCrnt,dtPrev,date, cur)=>{
		
		const obj = {
					labels: ['Jan', 'Feb','Mar','Apr','May','Jun', 'Jul', 'Aug', 'Sep','Oct','Nov','Dec'],
					datasets: [
						{
							label: date.year,
							backgroundColor: '#45afed',
							data: Object.values(dtCrnt)
						},
						{
							label: date.year-1,
							backgroundColor: '#999999',
							data: Object.values(dtPrev)
						}
					]    
					};

		const options = {
						plugins: {
							title: {
								display: true,
								text: `P&L - K (${cur})`,
								font: {	size: 16}
							},
							legend: {
								position: 'bottom',
							},
							tooltip: {
							   	callbacks: {
									   label: function(context) {
										  return addCommas(	context.parsed.y.toString() )}}
								},
        				},
						maintainAspectRatio: false,
						scales: {
							y:{
								beginAtZero: true,
								ticks: {
										callback: function(value, index, values) {
											const YesNo = checkIfInArray(values)
											return YesNo ? 0 :  value/1000;    //addCommas(value/1000); //(value/1000).toFixed(1) //
										},
								},
								grid:{
									display: false
								}
							},
							x:{
								grid:{
									display: false
								}
							}
						},
    			};
	
	return {obj, options};
	
}

//////////////////////////////////////////////////////////////////////////

export const ExpenseGroup=(expensesTitles, ExpGroup, lblType, cur)=>{
	
	let exOwnerGraphLabels = ['Insurance','Taxes & Fees','Maintenance','S&M','G&A','Supplies','P&C Fees','Utilities','Management','Other'];
	let exCompanyGraphLabels = ['Insurance','Taxes & Fees','Maintenance','S&M','G&A','Supplies','P&C Fees','Utilities','Management', 'Rent', 'Other'];

	const obj = {
            labels: lblType===1 ? exOwnerGraphLabels : exCompanyGraphLabels,  //rent??
			labelsFull: expensesTitles,
            datasets: [
                {
                    label: 'Value',
                    backgroundColor: '#45afed',
                    data: Object.values(ExpGroup)
                },
            ]    
        };  
	
	const options = {
					plugins: {
						title: {
							display: true,
							text: `Expenses by Group - K (${cur})`,
							font: {	size: 16}
						},
						legend: {
							display: false,
						},
						tooltip: {
							callbacks: {
									title: function(context) {
									   return  expensesTitles[context[0].dataIndex]; //d.labels[t[0].index];
									},
									label: function(context) {
										   return addCommas(	context.parsed.y.toString() )
									},

							}
						},
					},
					maintainAspectRatio: false,
					scales: {
						y:{
							beginAtZero: true,
							ticks: {
									callback: function(value, index, values) {
										const YesNo = checkIfInArray(values)
										return YesNo ? 0 :  value/1000;    //addCommas(value/1000); //(value/1000).toFixed(1) //
									},
							},
							grid:{
								display: false
							}
						},
						x:{
							grid:{
								display: false
							}
						}
					},
    			};
	
	
	return {obj, options};
}

/////////////////////////////////////////////////////////////////////////////

export const PieChart =(arr, text)=>{
	  
	  const obj = {
            labels: Object.keys(arr),
            datasets: [{
                    data: Object.values(arr),
                    backgroundColor: [
                        "#4b77a9",
						"#5f255f",
						"#d21243",
						"#B27200",
						'#CA8475',
						'#41A302',
						'#083645',
						'#797081',
						'#501F2E',
						'#E5E2B4'
						
                    ],
					 hoverBackgroundColor: [
                         "#4b77a9",
						"#5f255f",
						"#d21243",
						"#B27200",
						'#CA8475',
						'#41A302',
						'#083645',
						'#797081',
						'#501F2E',
						'#E5E2B4'
                    ],
                }]    
            };
	
	
	const options = {
						plugins: {
							title: {
								display: true,
								text: text,
								font: {	size: 16},
							},
							legend: {
								position: 'left',
							},
							tooltip: {
							   	callbacks: {
									   label: function(context) {
										  return 	context.label + ': ' + addCommas(context.parsed.toString())
										},
        						},
							}
						},
						maintainAspectRatio: false,
			};
	
	return {obj, options};

}

export const OccupPrcnt = (dtCrnt,dtCrntPrev,date)=> {
	
	const obj = {
		   labels: ['Jan', 'Feb','Mar','Apr','May','Jun', 'Jul', 'Aug', 'Sep','Oct','Nov','Dec'],
		   datasets: [
			   {
				   label: date.year,
				   backgroundColor: '#45afed',
				   data: Object.values(dtCrnt)
			   },
			   {
				   label: date.year-1,
				   backgroundColor: '#999999',
				   data: Object.values(dtCrntPrev)
			   }
		   ]    
		   }; 
   
	
	const options = {
						plugins: {
							title: {
								display: true,
								text: `Properties Occupancy`,
								font: {	size: 16}
							},
							legend: {
								position: 'bottom',
							},
							tooltip: {
							   	callbacks: {
									   label: function(context) {
										  return 	context.parsed.y.toString() + '%' }}
								},
        				},
						maintainAspectRatio: false,
						scales: {
							y:{
								beginAtZero: true,
								ticks: {
										callback: function(value, index, values) {
											return value + '%' ;   
										},
								},
								max: 100,
								grid:{
									display: false
								}
							},
							x:{
								grid:{
									display: false
								}
							}
						},
    			};
   
   return {obj, options};
}
