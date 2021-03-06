const dateFormat = require('dateformat');

function checkIfInArray(values){
	const arr = [3, 5.5];
	const sumOfY_axe = values.map(x=> x.value).reduce((a,b) => a + b, 0) //array is included in array
	return arr.indexOf(	sumOfY_axe	) !== -1
}

export const Exp = (data, date, cur, setCurrentData, setOpen, setShowCols) => {

	let MonthsExp = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].reduce((o, key) => ({ ...o, [key]: 0 }), {});

	for (let i = 0; i < data.length; i++) {
		let Mn = dateFormat(data[i].AccDate, 'm'); // month
		if (data[i].Transaction.substring(0, 2) === 'EX') {
			MonthsExp[Mn] = +MonthsExp[Mn] + +(+data[i].Expense).toFixed(2);
		}
	}
	const obj = {
		labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		datasets: [
			{
				label: date.year,
				backgroundColor: '#45afed',
				data: Object.values(MonthsExp)
			},
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
								display: false,
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
					onClick: function (event, legendItem, legend) {
						let k = legendItem[0];
						if (k != null) {
							const _index = legendItem[0].index
							let mon = this.data.labels[_index];
			
							let arrTmp = data.filter(x => dateFormat(x.AccDate, 'mmm') === mon).filter(y=> y.Transaction.substring(0, 2) === 'EX');
							setCurrentData(arrTmp)
							setShowCols('Expense')
							setOpen(true); 
						}
					},
		
	/*	animation: {
			duration: 1000,
			onComplete: function (e) {
				console.log(e.chart)
				let chartInstance = e.chart,
				ctx = chartInstance.ctx;

				ctx.font = "10px Verdana";
				ctx.textAlign = 'center';
				ctx.textBaseline = 'bottom';
				
				this.data.datasets.forEach(function (dataset, i) {
					console.log(chartInstance)
					/*
					var meta = chartInstance.controller.getDatasetMeta(i);
					meta.data.forEach(function (bar, index) {
						let data = addCommas(dataset.data[index]/1000);

						if (dataset.data[index] > 0) {
							ctx.fillText(data, bar._model.x, bar._model.y);
						} else if (dataset.data[index] < 0) {
							ctx.fillText(data, bar._model.x, bar._model.y + 15);
						} else if (dataset.data[index] === 0) {
							ctx.fillText('-', bar._model.x, bar._model.y);
						}
					});
					
					
				});
				
				
				
			}}*/
		
    			};
	
	/*
	const options = {

	
		hover: {
  			animationDuration:0,
		},
		animation: {
			duration: 1000,
			onComplete: function () {
				let chartInstance = this.chart,
				ctx = chartInstance.ctx;

				ctx.font = "10px Verdana";
				ctx.textAlign = 'center';
				ctx.textBaseline = 'bottom';

				this.data.datasets.forEach(function (dataset, i) {
					var meta = chartInstance.controller.getDatasetMeta(i);
					meta.data.forEach(function (bar, index) {
						let data = addCommas(dataset.data[index]/1000);

						if (dataset.data[index] > 0) {
							ctx.fillText(data, bar._model.x, bar._model.y);
						} else if (dataset.data[index] < 0) {
							ctx.fillText(data, bar._model.x, bar._model.y + 15);
						} else if (dataset.data[index] === 0) {
							ctx.fillText('-', bar._model.x, bar._model.y);
						}
					});
				});
			}
		}, 
		
	};
*/
	return { obj, options }
	
}



export const Rev = (data, date, cur, setCurrentData, setOpen, setShowCols) => {

	let MonthsRev = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].reduce((o, key) => ({ ...o, [key]: 0 }), {});
	for (let i = 0; i < data.length; i++) {
		let Mn = dateFormat(data[i].AccDate, 'm'); // month
		if (data[i].Transaction.substring(0, 2) === 'RC' || data[i].Transaction.substring(0, 2) === 'OI') {
			MonthsRev[Mn] = +MonthsRev[Mn] + +(+data[i].Income).toFixed(2);
		}
	}
	const obj = {
		labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		datasets: [
			{
				label: date.year,
				backgroundColor: '#45afed',
				data: Object.values(MonthsRev)
			},
		]
	}

	const options = {
					plugins: {
							title: {
								display: true,
								text: `Revenue & Extra Revenue - K (${cur})`,
								font: {	size: 16}
							},
							legend: {
								position: 'bottom',
								display: false,
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
					onClick: function (event, legendItem, legend) {

						
						let k = legendItem[0];
						if (k != null) {
						const _index = legendItem[0].index
						let mon = this.data.labels[_index];
						let arrTmp = data.filter(x => dateFormat(x.AccDate, 'mmm') === mon)
						.filter(y=> (y.Transaction.substring(0, 2) === 'RC' || y.Transaction.substring(0, 2) === 'OI'));
						setCurrentData(arrTmp)
						setShowCols('Income')
						setOpen(true);
			}

		}
	};

	return { obj, options }
	
}


export const PL = (data, date, cur, setCurrentData, setOpen, setShowCols) => {

	let MonthsPL = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].reduce((o, key) => ({ ...o, [key]: 0 }), {});
	for (let i = 0; i < data.length; i++) {
		let Mn = dateFormat(data[i].AccDate, 'm'); // month
			MonthsPL[Mn] = +MonthsPL[Mn] + +data[i].Income - +data[i].Expense;
	}
	
	
	const obj = {
		labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		datasets: [
			{
				label: date.year,
				backgroundColor: '#45afed',
				data: Object.values(MonthsPL)
			},
		]
	}

	const options = {

				plugins: {
						title: {
							display: true,
							text: `P&L - K (${cur})`,
							font: {	size: 16}
						},
						legend: {
							position: 'bottom',
							display: false,
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
		onClick: function (event, legendItem, legend) {

				let k = legendItem[0];
				if (k != null) {
					const _index = legendItem[0].index
					let mon = this.data.labels[_index];
					let arrTmp = data.filter(x => dateFormat(x.AccDate, 'mmm') === mon);
					setCurrentData(arrTmp)
					setShowCols('PL')
					setOpen(true);
			}

		}
	};

	return { obj, options }
	
}





function addCommas(x) {
	var parts = Math.round(x).toString().split('.');
	return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

///////////////////////////////

