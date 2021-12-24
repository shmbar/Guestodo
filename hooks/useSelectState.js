import {useState} from 'react';

const useSelectState = () =>{

	const [valueOwner, setValueOwner] = useState(null);
	const [propertySlct, setPropertySlct] = useState(null);
	const [multiPropertySlct, setMultiPropertySlct] = useState([]);
	const [checkedCalendar,setCheckedCalendar] = useState({})
	const [fundSlct, setFundSlct] = useState(null);
	const [page, setPage] = useState( /* 'DashboardOwner' */  /* 'Reservations' */  );
	
	const [valuePL, setValuePL] = useState({From:new Date(), To:new Date()}); //for PL
	const [plData, setPlData] = useState([])  //for PL
	const [filteredData,setFilteredData] = useState({inc:'',exp:''})
	
	const [date, setDate] = useState({month: new Date().getMonth(), year: new Date().getFullYear()})
	
	return {
		valueOwner,
		handleChange:  (value) => {
				setValueOwner(value);
		 },
		setValueOwner,
		valuePL, //for PL
		setValuePL, //for PL
		plData,  //for PL
		setPlData,  //for PL
		filteredData,setFilteredData, //for PL
		
		propertySlct,
		setPropertySlct,
		checkedCalendar,setCheckedCalendar,
		multiPropertySlct, setMultiPropertySlct,
		fundSlct,
		setFundSlct,
		date, setDate, //dashboard
		page, setPage,
	};
};

export default useSelectState;