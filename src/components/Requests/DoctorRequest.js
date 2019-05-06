import React from 'react';
import moment from 'moment';

export default function DoctorRequest({ request, doctorName }) {
  let availabilityText = [];
  const availability = Object.keys(request.scheduling).filter(day => {
    return request.scheduling[day];
  }).map((day, availIndex) => {
    const [start, end] = request.scheduling[day];
    availabilityText.push(`${capitalizeWord(day)}: ${convertTime(start)} to ${convertTime(end)}`);
    return <div key={availIndex}>{capitalizeWord(day)}: {convertTime(start)} to {convertTime(end)}</div>
  });

  let hipaaCert = 'No';
  if (request.student.hipaaCert) {
    hipaaCert = 'Yes';
  }

  const acceptRequestBody = `Dear ${request.student.name},
  %0A%0A I am happy to inform you that your shadowing request has been approved! Let's set up a time to for shadowing based on the proposed availability of ${availabilityText.join(' & ')}. I look forward to meeting you and helping you on your path to becoming a physician!
  %0A%0A Thanks,
  %0A ${doctorName}`;
  const denyRequestBody = `Dear ${request.student.name},
  %0A%0A I am sorry to inform you that I will not be able to accomidate your shadowing request due to the number of requests received and a busy work schedule. I wish you the best in your future endevours.
  %0A%0A Thanks,
  %0A ${doctorName}`;

  return (<div className="request">
    <div className="request-header">
      <div className="request-contact-info">
        <h3 className="request-data-header">{request.student.name}</h3>
        <span>{request.student.email}</span>
        <span>{request.student.phoneNumber}</span>
      </div>
      <p className="request-date">{moment(request.createdDate).format('MM/DD/YYYY')}</p>
    </div>
    <div>
      <div className="data-item column">
        <h5 className="request-data-header">HIPAA Certified: </h5>
        {hipaaCert}
      </div>
      <div className="data-item column">
        <h5 className="request-data-header">Availability:</h5>
        {availability}
      </div>
      <div className="data-item request-response-btn">
        <a href={`mailto:${request.student.email}?subject=Shadowing Request Accepted&body=${acceptRequestBody}`} className="button no-decoration accept-request-btn">Accept Request</a>
        <a href={`mailto:${request.student.email}?subject=Shadowing Request Denied&body=${denyRequestBody}`} className="button no-decoration deny-request-btn">Deny Request</a>
      </div>
    </div>
  </div>);
}

function capitalizeWord(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function convertTime(time) {
  return moment(time, 'HH:mm:ss').format('h:mm A');
}