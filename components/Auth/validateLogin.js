export default function validateLogin(values) {
    let errors = {};

    // Email Errors
    if (!values.email) {
        errors.email = 'Email required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }
    // Password Errors

    if (window.location.pathname.substring(1) === 'signup') {
		
			if (!values.password && values.password1 != null) {
				errors.password = 'Password required';
			} else if (!/^(?=.*\d)(?=.*[A-Z])[0-9a-zA-Z\d@$!%*#?&]{8,}$/.test(values.password)) {
				errors.password = 'Password must be at least 8 characters, one digit and one upper case letter';
			}

			 if (values.password1 != null && values.password !== values.password1) {
				errors.password1 = 'Passwords are not the same';
			}
    } else if(window.location.pathname.substring(1) === 'login'){
			if (!values.password) {
				errors.password = 'Password required';
			 }
	}
   

    // Name Errors
    if (!values.name) {
        errors.name = 'Name required';
    }

    return errors;
}