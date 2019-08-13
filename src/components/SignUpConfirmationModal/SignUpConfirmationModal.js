import React from 'react';

function SignUpConfirmation(props) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={() => props.handleConfirmationClose()}>&times;</span>
        <div className="modal-text">
          <h1>Thank You!</h1>
          <p>You're account has been created. You will receive an email shortly with more information on using FindShadowing.com!</p>
          <p>You can edit your account at anytime through your profile, which can be located by clicking the user button at the top right of the screen.</p>
        </div>
      </div>
    </div>
  );
}

export default SignUpConfirmation;