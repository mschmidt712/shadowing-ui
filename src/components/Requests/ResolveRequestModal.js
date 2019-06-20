import React from 'react'

export default function ResolveRequestModal(props) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={props.toggleResolveRequestModal}>&times;</span>
        <div className="modal-text center-modal">
          <h3>Would you like to mark this request as {props.status}?</h3>
          <p>Now that you have responded to the request from {props.request.student.name}, would you like to mark the request as {props.status} in your inbox? Once resolved, you will no longer be able to generate an email response.</p>
          <div className="data-item">
            <button className="primary" onClick={() => {
              props.changeRequestStatus(props.request, props.status);
              props.toggleResolveRequestModal();
            }}
            >Yes, Resolve Request</button>
            <button className="primary" onClick={props.toggleResolveRequestModal}>No, Keep Request</button>
          </div>
        </div>
      </div>
    </div>
  )
}
