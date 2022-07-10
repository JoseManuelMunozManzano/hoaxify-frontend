import React from 'react';
import defaultPicture from '../assets/profile.png';

const ProfileImageWithDefault = (props) => {
  let imageSource = defaultPicture;

  if (props.image) {
    imageSource = `/images/profile/${props.image}`;
  }

  // Se pone esta línea de eslint porque no hemos añadido alt a img
  //eslint-disable-next-line
  return <img src={imageSource} />;
};

export default ProfileImageWithDefault;
