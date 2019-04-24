import React from 'react';

function SignUpConfirmation(props) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={() => props.handleConfirmationClose()}>&times;</span>
        <div className="modal-text">
          <h1>Thank You!</h1>
          <p>You're account has been created.</p>
        </div>
      </div>
    </div>
  );
}

export default SignUpConfirmation;