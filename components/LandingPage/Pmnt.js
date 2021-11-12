import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));



export default function ContainedButtons() {
  	const classes = useStyles();

	let isOpenCheckoutPopUp = false;
  	let popUpButtonClose = null;
  	let popUp = null
  
	const initialCheckoutVisibility = () =>{
    	return isOpenCheckoutPopUp === true ? 'block' : 'none';
  	}
	
	
  const openCheckout =(event) =>{
    event.preventDefault();
	
    let checkoutUrl = "https://store.payproglobal.com/checkout?products[1][id]=69304&page-template=22222&currency=USD&exfo=742"
	  
    if(checkoutUrl){
      isOpenCheckoutPopUp = true;
      popUp = document.createElement("div");
      popUp.className = "ppg-checkout-modal";
      popUp.setAttribute('style', 'z-index: 99999; display: ' + initialCheckoutVisibility() +'; background-color: transparent; border: 0px none transparent; visibility: visible; margin: 0px; padding: 0px; -webkit-tap-highlight-color: transparent; position: fixed; left: 0px; top: 0px; width: 100%; height: 100%;'); 

      popUpButtonClose = document.createElement("button");
      popUpButtonClose.className = 'ppg-btn-close';
      popUpButtonClose.setAttribute('style', 'position:absolute; top:10px; right:10px; background:transparent; border:none; outline:none; color:#fff; font-size:30px;line-height: 1;')
      popUpButtonClose.innerHTML = 'ֳ+++';

      var popUpHeader = document.createElement("div");
      popUpHeader.className = "ppg-checkout-modal";
      popUpHeader.setAttribute('style', 'position:absolute; width: calc(100% - 20px);');
      popUpHeader.appendChild(popUpButtonClose);

      var popUpIframe = document.createElement('iframe');
      popUpIframe.className = 'ppg-frame';
      popUpIframe.frameborder = '0';
      popUpIframe.allowtransparency = 'true';
      popUpIframe.src = checkoutUrl;
      popUpIframe.loading = 'lazy';
      popUpIframe.setAttribute('style', 'width:100%; height:100%;border:0; overflow-x: hidden; overflow-y: auto;')

      popUp.appendChild(popUpHeader);
      popUp.appendChild(popUpIframe);

      var body = document.getElementsByTagName("body")[0];
      body.appendChild(popUp);
    }

    popUpButtonClose.addEventListener ("click", function() {
      isOpenCheckoutPopUp = false;
      popUp.remove();
    });
	
  }
	
  return (
    <div className={classes.root}>
      <Button variant="contained" color="primary"  onClick={event=>openCheckout(event)}>
        Click Here
      </Button>
     
    </div>
  );
}
