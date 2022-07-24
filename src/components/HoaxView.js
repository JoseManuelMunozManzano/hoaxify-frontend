import React, { Component } from 'react';
import ProfileImageWithDefault from './ProfileImageWithDefault';

class HoaxView extends Component {
  render() {
    const { hoax } = this.props;
    const { user } = hoax;
    const { username, displayName, image } = user;

    return (
      <div className="card p-1">
        <div className="d-flex">
          <ProfileImageWithDefault className="rounded-circle m-1" width="32" height="32" image={image} />
          <div className="flex-fill m-auto pl-2">
            <h6>
              {displayName}@{username}
            </h6>
          </div>
        </div>
        <div className="pl-5">{hoax.content}</div>
      </div>
    );
  }
}

export default HoaxView;
