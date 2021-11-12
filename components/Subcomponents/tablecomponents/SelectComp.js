import React from 'react';

import 'antd/dist/antd.less';  // or 'antd/dist/antd.less'
import { Select, Row, Col } from 'antd';


  const Slct = (props)=>{   //inpt, handleChangeS, lbl/*, option*/
  const val = (props.vl==='' || props.vl ==null || props.vl.toString()==='-1')? undefined : props.vl;
  const shsrch = (props.inpt==='CustName' || props.inpt==='AffName') ? true:false;
  
    return(
        <div className='input_container'>  
          
                <Row type="flex" justifyContent="space-around" align="middle">
                    <Col span={12}><label className='float-right'>{props.lbl}</label></Col>
                    <Col span={12}>
                            <Select  
                                style={{ 'width': '100%', 'border': '1px solid red!important' }}
                                placeholder={props.lbl} name={props.inpt} 
                                onChange={props.handleChangeS(props.option, props.inpt)}
                                value={(val!=null && val!==undefined)? val:undefined}
                                showSearch={shsrch}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                allowClear={props.allClr}
                                className={(val===undefined && props.r) ? 'redBorderS' : 'inptBorderS'} 
                                        >
                                            {props.option}
                            </Select>
                    </Col>
                </Row>
        </div>
    );
        };

export default Slct ;



