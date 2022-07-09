import React from 'react';

const UserListItem = (props) => {
  return (
    <div className="list-group-item list-group-item-action">
      <img alt="profile" width="32" height="32" />
      {`${props.user.displayName}@${props.user.username}`}
    </div>
  );
};

export default UserListItem;
