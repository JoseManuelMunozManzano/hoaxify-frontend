import React, { Component } from 'react';
import ProfileImageWithDefault from './ProfileImageWithDefault';

class HoaxView extends Component {
  render() {
    return (
      <div className="card p-1">
        <ProfileImageWithDefault className="rounded-circle" width="32" height="32" image={this.props.hoax.user.image} />
        {this.props.hoax.content}
      </div>
    );
  }
}

export default HoaxView;
