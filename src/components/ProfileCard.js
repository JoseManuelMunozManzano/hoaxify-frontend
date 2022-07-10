import React from 'react';

const ProfileCard = (props) => {
  return <div>{`${props.user.displayName}@${props.user.username}`}</div>;
};

export default ProfileCard;
