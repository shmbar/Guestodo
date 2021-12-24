import React from 'react';

import { GoogleMap, LoadScript, Marker  } from '@react-google-maps/api';


const GMaps = (props) => {

	
	const mapStyles = {        
		height: "50vh",
		width: "100%",
		border: '1px solid #ccc'
	};
  
  	const defaultCenter = {
    	lat: 32.158929, lng: 34.806729
  	}
	
	
  	return (
			
				<LoadScript 
				   	googleMapsApiKey='AIzaSyCa2Y1dDOqupKkgmNarRYGLv5ETjo8RWi0'>
					<GoogleMap
						  mapContainerStyle={mapStyles}
						  zoom={18}
						  center={defaultCenter}
        			>
					<Marker key='Location 3' position={defaultCenter}/>
					</GoogleMap>
				</LoadScript>
  	);
}

export default GMaps;
