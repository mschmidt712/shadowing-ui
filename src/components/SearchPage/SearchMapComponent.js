import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

function SearchMapComponent(props) {
  if (!props.addressLatLng) {
    return <div></div>
  }

  const homeMarker = <Marker
    name={'Home Address'}
    position={props.addressLatLng}
    options={{ icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }} />;
  const markers = props.doctors.map((doctor, index) => {
    return <Marker
      key={index}
      name={doctor.name}
      position={doctor.addressLatLng}
      options={{ icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }} />
  });

  return (
    <GoogleMap
      defaultZoom={9}
      defaultCenter={props.addressLatLng}
    >
      {markers}
      {homeMarker}
    </GoogleMap>
  )
}

export default withScriptjs(withGoogleMap(SearchMapComponent));