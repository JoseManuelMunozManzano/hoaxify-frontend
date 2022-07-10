import React from 'react';
import defaultPicture from '../assets/profile.png';

const ProfileImageWithDefault = (props) => {
  let imageSource = defaultPicture;

  if (props.image) {
    imageSource = `/images/profile/${props.image}`;
  }

  return (
    // Se pone esta línea de eslint porque no hemos añadido alt a img
    //eslint-disable-next-line
    <img
      {...props}
      src={imageSource}
      onError={(event) => {
        event.target.src = defaultPicture;
      }}
    />
  );
};

export default ProfileImageWithDefault;
