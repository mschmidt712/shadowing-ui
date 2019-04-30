import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps';

function Home() {
  return (
    <div className="main">
      <GoogleMap defaultZoom={4} defaultCenter={{ lat: 39.8283, lng: -98.5795 }}></GoogleMap>
    </div>
  );
}

export default withScriptjs(withGoogleMap(Home));