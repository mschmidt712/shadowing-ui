import React from 'react';

export default function SearchDoctorComponent(props) {
  const distanceMeters = props.doctor.distance.distance.value;
  const distanceMiles = Math.round(distanceMeters / 1609.344);

  return (
    <div className="request">
      <div className="request-header">
        <div className="request-contact-info">
          <h3>{props.doctor.specialty} Physician</h3>
          <span>{props.doctor.specialty}</span>
        </div>
        <p className="request-date">{distanceMiles} Miles</p>
      </div>
    </div>
  )
}

