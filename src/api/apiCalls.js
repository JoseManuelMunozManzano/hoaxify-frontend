// Este fuente contiene las funciones para realizar peticiones API al exterior.
import axios from 'axios';
import { Buffer } from 'buffer';

export const signup = (user) => {
  return axios.post('/api/1.0/users', user);
};

export const login = (user) => {
  return axios.post('/api/1.0/login', {}, { auth: user });
};

// To not repeat auth part in each api call (like updating user, or posting content etc), we set
// the authorization header as soon as user logs in and clear it after user logs out.
export const setAuthorizationHeader = ({ username, password, isLoggedIn }) => {
  if (isLoggedIn) {
    axios.defaults.headers.common['Authorization'] = `Basic ${Buffer.from(username + ':' + password).toString(
      'base64'
    )}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};
