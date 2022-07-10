import React from 'react';

const ProfileCard = (props) => {
  const { displayName, username } = props.user;
  return (
    <div className="card">
      <div className="card-body text-center">
        <h4>{`${displayName}@${username}`}</h4>
      </div>
    </div>
  );
};

export default ProfileCard;
