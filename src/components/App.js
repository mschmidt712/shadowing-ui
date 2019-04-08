import React, { Component } from 'react';
import { render } from 'react-dom';
import AppHeader from './Header/Header';
import Home from './Home/Home';
import './App.css';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      location: props.location
    };
  }

  render() {
    return (
      <div className="App">
          <AppHeader location={this.state.location}/>
          <Home 
            googleMapURL='https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBV0ERwNWnf4cLICe7TozgRJG6jNM5aL9Q'
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
      </div>
    );
  }
}

render(<App />, document.getElementById('container'));
export default App;
