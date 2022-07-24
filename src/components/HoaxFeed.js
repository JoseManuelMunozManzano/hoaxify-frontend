import React, { Component } from 'react';
import * as apiCalls from '../api/apiCalls';

class HoaxFeed extends Component {
  componentDidMount() {
    apiCalls.loadHoaxes();
  }

  render() {
    return <div>HoaxFeed</div>;
  }
}

export default HoaxFeed;
