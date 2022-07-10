import React from 'react';

const ProfileCard = (props) => {
  const { displayName, username } = props.user;
  return (
    <div className="card">
      <div className="card-header text-center">
        <img alt="profile" width="200" height="200" />
      </div>
      <div className="card-body text-center">
        <h4>{`${displayName}@${username}`}</h4>
      </div>
    </div>
  );
};

export default ProfileCard;
