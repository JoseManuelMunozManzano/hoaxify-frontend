import React from 'react';
import defaultPicture from '../assets/profile.png';

const ProfileImageWithDefault = () => {
  // Se pone esta línea de eslint porque no hemos añadido alt a img
  //eslint-disable-next-line
  return <img src={defaultPicture} />;
};

export default ProfileImageWithDefault;
