import React from 'react'

export default function Step3(props) {
  function validateForm() {
    props.setTouched('stepThree');

    if (!props.photoUpload) {
      alert('A photo of your badge is required!');
      return;
    }

    return props.createDoctor();
  }
  return (
    <div className="form">
      <h4 className="app-subtitle">
        Finally, we need to verify your account details.
      <br />
        Please upload an image to aid us in account verification. Some examples of items to upload are an image of your badge, a business card, or a physicians bio from your hospitals website.
      </h4>
      <div className="form-element">
        <label name="photoUpload">Badge Photo</label>
        <input name="photoUpload" type="file" accept="image/*" onChange={props.onPhotoInputChange} className={props.touched} required />
      </div>
      <div className="form-element">
        <button onClick={props.previousStep} className="button primary">Previous</button>
        <button className="button primary" onClick={validateForm}>Save</button>
      </div>
    </div>
  )
}
