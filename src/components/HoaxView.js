import React, { Component } from 'react';

class HoaxView extends Component {
  render() {
    return <div>{this.props.hoax.content}</div>;
  }
}

export default HoaxView;
