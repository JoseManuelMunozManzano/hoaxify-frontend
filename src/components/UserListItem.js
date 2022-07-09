import React from 'react';
import defaultPicture from '../assets/profile.png';

const UserListItem = (props) => {
  return (
    <div className="list-group-item list-group-item-action">
      <img className="rounded-circle" alt="profile" width="32" height="32" src={defaultPicture} />
      <span className="pl-2">{`${props.user.displayName}@${props.user.username}`}</span>
    </div>
  );
};

export default UserListItem;
