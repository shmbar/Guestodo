import React, {useContext } from 'react';
import NumberFormat from 'react-number-format';
import {SettingsContext} from '../../contexts/useSettingsContext';

const NumberFormatCustom = (props) =>{
   const { inputRef, onChange, ...other } = props;
   const {settings} = useContext(SettingsContext);

	let tmp = settings.CompDtls==null ? '$' : settings.CompDtls.currency;
   
	return (
     <NumberFormat
       {...other}
       getInputRef={inputRef}
       onValueChange={(values) => {
         onChange({
           target: {
             name: props.name,
             value: values.value,
           },
         });
       }}
       decimalScale='2'
       thousandSeparator
       isNumericString
       allowNegative={false}
       prefix= {tmp + ' ' }
     />
   );
 }
 export default NumberFormatCustom;