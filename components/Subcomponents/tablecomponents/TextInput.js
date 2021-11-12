import React from 'react';
import  {Input, Row, Col}  from 'antd';
import 'antd/dist/antd.css';  // or 'antd/dist/antd.less'

import './EmplModal.css';


const Text = (props)=>{   //inpt, handleChangeS, lbl/*, option*/
 //const { getFieldDecorator } = props.form;

    return(
    <div className='input_container'>  
        <Row type="flex" justifyContent="space-around" align="middle">
                  <Col span={12}><label className='float-right'>{props.lbl}</label></Col>
                  <Col span={12}><Input name={props.inpt} placeholder={props.lbl} 
                  className={`inpHght ${(props.vl==='' && props.r) ? 'redBorder' : 'inptBorder'}`} 
                    onChange={props.handleChange} value={props.vl} label={props.lbl} disabled={props.dis}/*style={{ width: 100 }}*/ 
                    />  
			</Col>
         </Row>
  
   </div>
   
    );
        };

export default Text ;




/*


  


 //no_padding form-row no_margin mt-1 mb-1
 
  
  
*/