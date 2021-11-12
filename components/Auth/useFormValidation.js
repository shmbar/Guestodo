import {useState,useEffect} from 'react';


const useFormValidation=(initial, validate, authenticate)=>{
	const [values,setValues] = useState(initial);
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	
	
	useEffect(()=>{
		if(isSubmitting){
		
			if(window.location.pathname.toString().slice(-5)==='login'){
				delete errors.name
			}
			
			const noErrors = Object.keys(errors).length === 0;
			if(noErrors){
			
				authenticate();
				setIsSubmitting(false);
			}else{
				setIsSubmitting(false);
			}	
		}
	},[errors, isSubmitting,values, authenticate])
	
	const handleChange= e =>{
		setValues({...values, [e.target.name] : e.target.value	})	
	}
	
	const handleSubmit = e =>{
		e.preventDefault();
		const validationErrors = validate(values);
		setErrors(validationErrors);
		setIsSubmitting(true);
		
	}
	
	const handleClickShowPassword = () => {
    	setValues({ ...values, 'showPassword': !values.showPassword });
  	};

  	const handleMouseDownPassword = event => {
    	event.preventDefault();
  	};
	
	return {
		handleChange, handleSubmit, values, errors,isSubmitting, handleClickShowPassword,
		handleMouseDownPassword }
	
}

export default useFormValidation;