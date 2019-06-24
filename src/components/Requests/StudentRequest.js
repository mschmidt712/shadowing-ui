import React from 'react';
import moment from 'moment';

export default function StudentRequest({ request, deleteRequest }) {
  const availability = Object.keys(request.scheduling).filter(day => {
    return request.scheduling[day];
  }).map(day => {
    const [start, end] = request.scheduling[day];
    return <div key={day}>{capitalizeWord(day)}: {convertTime(start)} to {convertTime(end)}</div>
  });

  return (<div className="request box-shadow">
    <div className="component-header">
      <div className="component-header-details">
        <i className="fa fa-user-md"></i>
        <div>
          <h3 className="request-data-header">Dr. {request.doctor.name}, {request.doctor.degree}</h3>
          <h5 className="app-subtitle">{request.doctor.specialty}</h5>
        </div>
      </div>
      <p className="component-header-right">{moment(request.createdDate).format('MM/DD/YYYY')}</p>
    </div>
    <p className="with-horizontal-line"></p>
    <div className="data-item column nested">
      <h5 className="request-data-header">Availability: </h5>
      {availability}
    </div>
    {request.status === 'pending' && <button className="secondary request-response-btn" onClick={() => { deleteRequest(request.uuid) }}>Delete Request</button>}
    {request.status !== 'pending' && <div className="data-item nested">
      <h5>Status:</h5>
      <span className={request.status}>{capitalizeWord(request.status)}</span>
    </div>}
  </div>);
}

function capitalizeWord(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function convertTime(time) {
  return moment(time, 'HH:mm:ss').format('h:mm A');
}