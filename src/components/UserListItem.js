import React from 'react';

const UserListItem = (props) => {
  return (
    <div className="list-group-item list-group-item-action">{`${props.user.displayName}@${props.user.username}`}</div>
  );
};

export default UserListItem;
