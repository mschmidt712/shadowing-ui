import React from 'react'
import './SignUpPageDoctor.css';

export default function Step2(props) {
  function capitalizeWord(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function validateForm() {
    props.setTouched('stepTwo');

    const availabilityDays = Object.keys(props.availability);
    let availabilityChecked = false;
    availabilityDays.forEach(day => {
      if (props.availability[day].checked) {
        availabilityChecked = true;
      }
    });

    if (!props.maxShiftsPerWeek) {
      alert('Maximum number of shifts per week is required!');
      return;
    } else if (!availabilityChecked) {
      alert('You must select at least one available day!');
      return;
    } else if (!props.shiftLengthMin || !props.shiftLengthMax) {
      alert('Minimum and maxiumum shift length preferences are required!');
      return;
    }

    return props.nextStep();
  }

  const availabilityDays = Object.keys(props.availability);
  const availability = availabilityDays.map((day, key) => {
    return <div className="form-input" key={key}>
      <div className="form-input availability">
        <input type="checkbox" id={day} name={day} checked={props.availability[day].checked} onChange={props.handleAvailabilityDays} className="checkbox" />
        <label htmlFor={day}>{capitalizeWord(day)}</label>
        {props.availability[day].checked && <div className="form-input">
          <input type="time" name={`${day}_start`} value={props.availability[day][0]} onChange={props.handleAvailabilityTimes} placeholder="Start" className="time-picker" />
          to
          <input type="time" name={`${day}_end`} value={props.availability[day][1]} onChange={props.handleAvailabilityTimes} placeholder="End" className="time-picker" />
        </div>}
      </div>
    </div>
  });

  return (
    <div className="form">
      <h4 className="app-subtitle">
        Next, let's set your availability.
        <br />
        We will limit your availability and requests based on your preferences.
      </h4>
      <div className="form-element">
        <label>What is the maximum shift per week you could respond to?</label>
        <div className="form-input">
          <input type="number" name="maxShiftsPerWeek" value={props.maxShiftsPerWeek} onChange={props.onInputChange} placeholder="2" className={props.touched} required />
        </div>
      </div>
      <div className="form-element">
        <label>Availability</label>
        {availability}
      </div>
      <div className="form-element">
        <label>Preferred Shift Length (hrs)</label>
        <div className="form-input">
          <input type="number" name="shiftLengthMin" value={props.shiftLengthMin} onChange={props.onInputChange} placeholder="Minimum" className={props.touched} required />
          <input type="number" name="shiftLengthMax" value={props.shiftLengthMax} onChange={props.onInputChange} placeholder="Maximum" className={props.touched} required />
        </div>
      </div>
      <div className="form-element">
        <label>Additional Comments</label>
        <div className="form-input">
          <textarea type="text" name="additionalComments" value={props.additionalComments} onChange={props.onInputChange} placeholder="Things such as parking options, dress code, food restrictions, etc." />
        </div>
      </div>
      <div className="form-element">
        <button onClick={props.previousStep} className="button primary">Previous</button>
        <button onClick={validateForm} className="button primary">Next</button>
      </div>
    </div>
  );
}