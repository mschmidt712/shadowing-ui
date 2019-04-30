import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import * as userActions from '../../actions/userActions';

class UserPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hipaaCert: undefined
    }
  }

  render() {
    let hipaaCert = '';
    if (this.props.hipaaCert) {
      hipaaCert = <h3>
        HIPAA Certified
        <i className="fa fa-check icon"></i>
      </h3>
    } else {
      hipaaCert = <h3>
        HIPAA Certified
        <i className="fa fa-times icon"></i>
      </h3>
    }

    return (
      <div>
        {this.props.occupation === 'student' &&
          <div>
            <h1>{this.props.name}</h1>
            <h3>Email: {this.props.email}</h3>
            <h3>Phone Number: {this.props.phoneNumber}</h3>
            <h3>Address: {`${this.props.address.streetAddress}, ${this.props.address.city}, ${this.props.address.state} ${this.props.address.zipCode}`}</h3>
            {hipaaCert}
            <Link to="/sign-up/student">
              <button className="secondary">Edit Profile</button>
            </Link>
          </div>}
        {this.props.occupation === 'doctor' &&
          <div>Doctor</div>}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state.authReducer,
  ...state.userReducer
});

const mapDispatchToProps = dispatch => ({
  getStudent: (id) => dispatch(userActions.getStudent(id)),
  getDoctor: (id) => dispatch(userActions.getDoctor(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);