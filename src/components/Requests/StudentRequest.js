import React from 'react';
import moment from 'moment';

export default function StudentRequest({ request, deleteRequest }) {
  const availability = Object.keys(request.scheduling).filter(day => {
    return request.scheduling[day];
  }).map(day => {
    const [start, end] = request.scheduling[day];
    return <div key={day}>{capitalizeWord(day)}: {convertTime(start)} to {convertTime(end)}</div>
  });
  return (<div className="request">
    <div className="request-header">
      <div className="request-contact-info">
        <h3 className="request-data-header">Dr. {request.doctor.name}, {request.doctor.degree}</h3>
        <span>{request.doctor.specialty}</span>
      </div>
      <p className="request-date">{moment(request.createdDate).format('MM/DD/YYYY')}</p>
    </div>
    <div className="data-item column">
      <h5 className="request-data-header">Availability: </h5>
      {availability}
    </div>
    <button className="secondary delete-request-btn" onClick={() => { deleteRequest(request.uuid) }}>Delete Request</button>
  </div>);
}

function capitalizeWord(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function convertTime(time) {
  return moment(time, 'HH:mm:ss').format('h:mm A');
}