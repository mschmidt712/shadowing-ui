import React from 'react';
import ReactTooltip from 'react-tooltip';

export default function ChangePasswordModal(props) {
  function validateForm(oldPassword, newPassword, confirmPassword) {
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert('An old password, new password, and confirming the new password are all required to change your password!');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match. Please try again.');
      return;
    }

    props.changePassword(oldPassword, newPassword);
    props.toggleChangePasswordModal(false);
  }

  return <div>
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={() => props.toggleChangePasswordModal(false)}>&times;</span>
        <div className="modal-text">
          <div className="form">
            <h1 className="app-title">Change Password</h1>
            <label>
              Old Password
              <ReactTooltip />
            </label>
            <input type="password" name="oldPassword" value={props.oldPassword} onChange={props.onInputChange} />
            <label>
              New Password
              <i
                data-tip="Password must be at least 6 characters and contain upper and lower case letters."
                className="fas fa-info-circle icon">
              </i>
              <ReactTooltip />
            </label>
            <input type="password" name="newPassword" value={props.newPassword} onChange={props.onInputChange} />
            <label>
              Confirm New Password
              <ReactTooltip />
            </label>
            <input type="password" name="confirmNewPassword" value={props.confirmNewPassword} onChange={props.onInputChange} />
            <button className="primary" onClick={() => { validateForm(props.oldPassword, props.newPassword, props.confirmNewPassword) }}>Change Password</button>
          </div>
        </div>
      </div>
    </div>
  </div>;
}
