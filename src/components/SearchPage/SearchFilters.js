import React from 'react';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';

import capitalizeWord from '../utilities/capitalizeWord';
import medicalCareers from '../../constants/medicalCareers';
import medicalSpecialties from '../../constants/medicalSpecialties';
import medicalCareersWithSpecialties from '../../constants/medicalCareersWithSpecialties';
import daysOfTheWeek from '../../constants/daysOfTheWeek';

export default function SearchFilters(props) {
  function handleDistanceSlider(distance) {
    const e = {
      target: {
        name: 'distance',
        value: distance
      }
    }

    return props.onInputChange(e);
  }

  const specialties = medicalSpecialties.map((val, index) => {
    return <option value={val} key={index}>{val}</option>
  });
  const careers = medicalCareers.map((career, index) => (
    <option value={career.abbreviation} key={index}>{career.name}</option>
  ));

  const availability = daysOfTheWeek.map(day => {
    return <div className="form-input checkbox-container" key={day}>
      <input type="checkbox" id={day} name={day} checked={props.availability ? props.availability[day] : false} onChange={props.onAvailabilityChange} />
      <span className="checkbox"></span>
      <label htmlFor={day}>{capitalizeWord(day)}</label>
    </div>
  });

  return (
    <div>
      <div className="component-header-details">
        <div>
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
        <input name="zipCode" id="zipCode" value={props.zipCode} placeholder="Enter Zip Code" onChange={props.onInputChange} />
      </div>
      <div className="data-item column">
        <label htmlFor="distance"><h5>Mile Radius:</h5></label>
        <div className="slider">
          <InputRange
            formatLabel={value => `${value}`}
            step={5}
            maxValue={100}
            minValue={0}
            value={parseInt(props.distance)}
            onChange={distance => { handleDistanceSlider(distance) }}
          />
        </div>
      </div>
      <div className="data-item column">
        <label htmlFor="career"><h5>Career:</h5></label>
        <div className="select">
          <select type="text" name="career" id="career" value={props.career} onChange={props.onInputChange} placeholder="Career">
            {careers}
          </select>
          <i className="fas fa-angle-down"></i>
        </div>
      </div>
      {medicalCareersWithSpecialties.includes(props.career) && <div className="data-item column">
        <label htmlFor="specialty"><h5>Specialty:</h5></label>
        <div className="select">
          <select type="text" name="specialty" id="specialty" value={props.specialty} onChange={props.onInputChange} placeholder="Specialty">
            <option value="">All Specialties</option>
            {specialties}
          </select>
          <i className="fas fa-angle-down"></i>
        </div>
      </div>}
      <div className="data-item column">
        <h5>Availability:</h5>
        {availability}
      </div>
      <button className="primary" id="submit" onClick={() => {
        props.getDoctors({
          zipCode: props.zipCode,
          disance: props.distance
        })
      }}>Search</button>
    </div>
  )
}