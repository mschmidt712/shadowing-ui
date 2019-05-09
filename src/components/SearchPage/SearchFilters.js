import React, { Component } from 'react'

export default class SearchFilters extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    return (
      <div>
        <div className="component-header">
          <div className="component-header-details">
            <h3>Filters</h3>
          </div>
          <p className="component-header-right">
            <button className="icon small" onClick={this.props.toggleFilters}>
              <i className="fas fa-angle-double-left"></i>
            </button>
          </p>
        </div>
        <div className="data-item column">
          <h5>Enter Your Zip Code:</h5>
          <input />
        </div>
        <div className="data-item column">
          <h5>Mile Radius:</h5>
          <input />
        </div>
        <div className="data-item column">
          <h5>Specialty:</h5>
          <input />
        </div>
        <div className="data-item column">
          <h5>Availability:</h5>
          <input />
        </div>
      </div>
    )
  }
}
