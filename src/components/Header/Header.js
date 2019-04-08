import React from 'react';
import './Header.css';

function Header (props) {
  let header;
  if (props.location && props.location.pathname == '/') {
    header = (<div>
      <header className="app-header">
        <h1 className="app-title" >Find Shadowing</h1>
        <h3 className="app-subtitle">A website built to help students find physicians to shadow in a number of specialities in their area. Enter your location below to get started</h3>

        <div className="header-zip">
          <label>Enter Your Zip Code</label>
          <input type="number" maxLength='5' placeholder="80226"></input>
          <button className="primary">Search</button>
        </div>

        <button className="link">Sign Up As A Physician</button>
        <button className="link about-us">About Us</button>
        <button className="primary login">Login</button>
      </header>
    </div>);
  } else {
    header = (<div>
      <header className="app-header-condensed">
        <h1 className="app-title" >Find Shadowing</h1>
        <button className="link about-us">About Us</button>
        <button className="primary login">Login</button>
      </header>
    </div>);
  }

  return header;
}

export default Header;