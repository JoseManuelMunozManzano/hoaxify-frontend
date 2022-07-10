import React from 'react';

const ProfileCard = (props) => {
  const { displayName, username } = props.user;
  return <div>{`${displayName}@${username}`}</div>;
};

export default ProfileCard;
