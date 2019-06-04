import React from 'react'

import { medicalSpecialties } from '../SignUpPageDoctor/medicalSpecialtiesConstant';

export default function SearchFilters(props) {
  const specialties = medicalSpecialties.map((val, index) => {
    return <option value={val} key={index}>{val}</option>
  });

  const daysOfTheWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const availability = daysOfTheWeek.map(day => {
    return <div className="form-input availability" key={day}>
      <input type="checkbox" id={day} name={day} checked={props.availability ? props.availability[day] : false} onChange={props.onAvailabilityChange} className="checkbox" />
      <label htmlFor={day}>{capitalizeWord(day)}</label>
    </div>
  });

  return (
    <div>
      <div className="component-header">
        <div className="component-header-details">
          <h3>Filters</h3>
        </div>
        <p className="component-header-right">
          <button className="icon icon-secondary small" onClick={props.toggleFilters}>
            <i className="fas fa-angle-double-left"></i>
          </button>
        </p>
      </div>
      <div className="data-item column">
        <label htmlFor="distance"><h5>Zip Code:</h5></label>
        <input name="zipCode" value={props.zipCode} placeholder="Zip Code" type="number" onChange={props.onInputChange} />
      </div>
      <div className="data-item column">
        <label htmlFor="distance"><h5>Mile Radius:</h5></label>
        <span>
          0
            <input name="distance" id="distance" value={props.distance} type="range" min="5" max="100" step="5" onChange={props.onInputChange} />
          100
          </span>
      </div>
      <div className="data-item column">
        <label htmlFor="specialty"><h5>Specialty:</h5></label>
        <select type="text" name="specialty" id="specialty" value={props.specialty} onChange={props.onInputChange} placeholder="Specialty">
          <option value=""></option>
          {specialties}
        </select>
      </div>
      <div className="data-item column">
        <h5>Availability:</h5>
        {availability}
      </div>
      <button className="primary" onClick={() => {
        props.getDoctors({
          zipCode: props.zipCode,
          disance: props.distance
        })
      }}>Search</button>
    </div>
  )
}

function capitalizeWord(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}