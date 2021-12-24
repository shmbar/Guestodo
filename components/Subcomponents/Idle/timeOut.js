import React, {useState, useRef, useContext } from 'react'
import IdleTimer from 'react-idle-timer';
import  IdleTimeOutModal  from './Idlmodal'
import {LogoutFromSystem} from '../../../functions/functions';
import {RcContext} from '../../../contexts/useRcContext';
import {ExContext} from '../../../contexts/useExContext';
import {CfContext} from '../../../contexts/useCfContext';
import {VtContext} from '../../../contexts/useVtContext';
import {OiContext} from '../../../contexts/useOiContext';
import {SelectContext} from '../../../contexts/useSelectContext';
import {SettingsContext} from '../../../contexts/useSettingsContext'; 

const Layout=(props)=>{

	const  timeout = 1000 * 10 * 6 * 15; //15 min
	const [showModal, setShowModal] = useState(false);
 	const idleTimer = useRef(null);
	
	const {setRcDataPrp} = useContext(RcContext);
	const {setExDataPrp} = useContext(ExContext);
	const {setCfData} = useContext(CfContext);
	const {setVtData} = useContext(VtContext);
	const {setOtherInc} = useContext(OiContext);
	const {setValueOwner, setPropertySlct, setFundSlct, setPage} = useContext(SelectContext);
	const {setOwnerList, setPropertyList, setFundList, setCshFlowTableCompany} = useContext(SettingsContext);
	
    const onAction = (e) => {
	//	setIsTimedOut(false)
    }
   
    const onActive = (e) => {
	 // 	setIsTimedOut(false)
    }
   
    const onIdle = (e) => {
			setShowModal(true)
	//		setIsTimedOut(true);
    }

    const handleClose =()=> {
      setShowModal(false)
	  idleTimer.current.reset();	
    }

    const handleLogout = ()=> {
      setShowModal(false);
		
	  localStorage.clear();
	  LogoutFromSystem();
	  setRcDataPrp([]);
	  setExDataPrp({'exData': [], 'pmnts': []});
	  setCfData([]);
	  setVtData([]);
	  setOtherInc([]);
	  setPropertySlct(null);
	  setValueOwner(null); //set valueOwner to null
	  setFundSlct(null);
	  setPropertyList([]);
	  setOwnerList([]);
	  setFundList([]);
	  setCshFlowTableCompany([]);
	  setPage('DashboardOwner');
	//  props.history.push('/login');
    }

      return(
        <>
		 
		  <IdleTimer
            ref={ref => idleTimer.current = ref}
            element={document}
            onActive={onActive}
            onIdle={onIdle}
            onAction={onAction}
            debounce={250}
            timeout={timeout} />

            <div className="">
             {showModal &&   <IdleTimeOutModal 
								showModal={showModal} 
								handleClose={handleClose}
								handleLogout={handleLogout}
                			/>
				}	  
            </div>
		 
        </>
      )
 }

export default Layout;

/*

*/