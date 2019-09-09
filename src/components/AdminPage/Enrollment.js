import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom'

export default function Enrollment(props) {
  const doctors = props.doctors.map(doctor => {
    return <tr className="user-row" key={doctor.id}>
      <td>{doctor.name}, {doctor.degree}</td>
      <td>{doctor.specialty}</td>
      <td>{doctor.address.city}, {doctor.address.state}</td>
      <td>{doctor.active ? 'Active' : 'Inactive'}</td>
      <td><Link to={`/user?id=${doctor.id}&occupation=doctor`}>See User Page</Link></td>
    </tr>
  });
  const students = props.students.map(student => {
    return <tr className="user-row" key={student.id}>
      <td>{student.name}</td>
      <td>{student.school}</td>
      <td>{student.schoolYear}</td>
      <td>{student.address.city}, {student.address.state}</td>
      <td><Link to={`/user?id=${student.id}&occupation=student`}>See User Page</Link></td>
    </tr>
  });

  return (
    <div>
      <h3 className="app-subtitle">Enrollment Statistics</h3>
      <h5>Last Updated: {moment(props.updateDate).format('dddd, MMMM Do YYYY')}</h5>
      <button className="request box-shadow center enrollment-button" onClick={() => { props.toggleEnrollmentVisibility('Doctors') }}>
        <h2 className="app-subtitle"><i className="fa fa-user-md"></i> Doctors</h2>
        <h1>{props.doctorCount}</h1>
      </button>
      {props.showDoctors && <table className="user-table">
        <tbody>
          <tr className="user-row">
            <th>Name</th>
            <th>Specialty</th>
            <th>Location</th>
            <th>Active Status</th>
            <th>ID</th>
          </tr>
          {doctors}
        </tbody>
      </table>}
      <button className="request box-shadow center enrollment-button" onClick={() => { props.toggleEnrollmentVisibility('Students') }}>
        <h2 className="app-subtitle"><i className="fa fa-user-graduate"></i> Students</h2>
        <h1>{props.studentCount}</h1>
      </button>
      {props.showStudents && <table className="user-table">
        <tbody>
          <tr className="user-row">
            <th>Name</th>
            <th>School</th>
            <th>School Year</th>
            <th>Location</th>
            <th>ID</th>
          </tr>
          {students}
        </tbody>
      </table>}
      <button className="request box-shadow center enrollment-button" disabled>
        <h2 className="app-subtitle"><i className="fas fa-envelope"></i> Requests</h2>
        <h1>{props.requestCount}</h1>
      </button>
    </div >
  )
}
