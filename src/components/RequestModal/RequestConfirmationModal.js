import React from 'react'

export default function RequestConfirmationModal(props) {
  return <div>
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={() => props.closeConfirmationModal(false)}>&times;</span>
        <div className="modal-text">
          <div className="form">
            <h1 className="app-title">Thank You!</h1>
            <h3 className="app-subtitle">You're request to shadow Dr. {props.selectedDoctor.name}, {props.selectedDoctor.degree} has been submitted!</h3>
            <div className="data-item">
              <p>You should receive a confirmation email shortly.</p>
            </div>
            <div className="data-item">
              <p>Dr. {props.selectedDoctor.name} will reach out to you to either accept for deny this request, and for further scheduling. Please note, if the request has not been responded to within 60 days it will be automatically deleted.</p>
            </div>
            <div className="data-item">
              <p>Thanks for using FindShadowing.com!</p>
            </div>
            <button className="primary" onClick={() => { props.closeConfirmationModal(false) }}>Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>;
}
