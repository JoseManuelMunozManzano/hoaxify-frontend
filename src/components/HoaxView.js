import React, { Component } from 'react';

class HoaxView extends Component {
  render() {
    return <div className="card p-1">{this.props.hoax.content}</div>;
  }
}

export default HoaxView;
