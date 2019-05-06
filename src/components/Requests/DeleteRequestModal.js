import React from 'react'

export default function DeleteRequestModal(props) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={props.toggleDeleteRequestModal}>&times;</span>
        <div className="modal-text center-modal">
          <h3>Would you like to delete this request?</h3>
          <p>Now that you have responded to the request to {props.request.student.name}, would you like to delete the request from your inbox?</p>
          <div className="data-item">
            <button className="primary" onClick={() => { props.deleteRequest(props.request.uuid) }}>Yes, Delete Request</button>
            <button className="primary" onClick={props.toggleDeleteRequestModal}>No, Keep Request</button>
          </div>
        </div>
      </div>
    </div>
  )
}
