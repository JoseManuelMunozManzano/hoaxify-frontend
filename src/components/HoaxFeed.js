import React, { Component } from 'react';
import * as apiCalls from '../api/apiCalls';

class HoaxFeed extends Component {
  componentDidMount() {
    apiCalls.loadHoaxes(this.props.user);
  }

  render() {
    return <div>HoaxFeed</div>;
  }
}

export default HoaxFeed;
