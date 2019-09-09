import React from 'react';

export default function DoctorsPendingApproval(props) {
  return (
    <div>
      <h3 className="app-subtitle">Doctors Pending Approval</h3>
      {props.doctorsForApproval.length > 0 && props.doctorsForApproval}
      {props.doctorsForApproval.length === 0 && <div className="request box-shadow">
        <p className="app-subtitle">No unapproved doctors found.</p>
      </div>}
    </div>
  )
}
