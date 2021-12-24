import React from "react";
import "./Switcher.scss";



const ToggleSwitch = ({onChange}) => {
 
  const optionLabels= ["Table", "Calendar"];
  
  return (
    <div className={"toggle-switch"}>
      <input  type="checkbox" className="toggle-switch-checkbox" id='Calendar'  onChange={onChange} />
          <label  className="toggle-switch-label"  htmlFor='Calendar' >
              <span   className={"toggle-switch-inner"} data-yes={optionLabels[0]}  data-no={optionLabels[1]} />
              <span   className={"toggle-switch-switch" } />
          </label>
    </div>
  );
};





export default ToggleSwitch;
