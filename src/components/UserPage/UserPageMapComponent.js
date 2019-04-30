import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

function UserPageMapComponent(props) {
  console.log('Address: ', props.addressLatLong);
  if (!props.addressLatLong) {
    return <div></div>
  }
  return (
    <GoogleMap
      defaultZoom={12}
      defaultCenter={props.addressLatLong}
    >
      <Marker
        name={'Home Address'}
        position={props.addressLatLong} />
    </GoogleMap>
  )
}

export default withScriptjs(withGoogleMap(UserPageMapComponent));