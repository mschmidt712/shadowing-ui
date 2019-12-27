import React from 'react';

export default function DoctorsPendingApproval(props) {
  return (
    <div>
      <h3 className="app-subtitle">Medical Professionals Pending Approval</h3>
      {props.doctorsForApproval.length > 0 && props.doctorsForApproval}
      {props.doctorsForApproval.length === 0 && <div className="request box-shadow">
        <p className="app-subtitle">No unapproved professionals found.</p>
      </div>}
    </div>
  )
}
