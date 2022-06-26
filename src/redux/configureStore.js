// Para no tener el store en diferentes módulos
import { createStore, applyMiddleware } from 'redux';
import authReducer from './authReducer';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

const configureStore = (addLogger = true) => {
  // Miramos si tenemos el id de usuario en localStorage
  let localStorageData = localStorage.getItem('hoax-auth');

  let persistedState = {
    id: 0,
    username: '',
    displayName: '',
    image: '',
    password: '',
    isLoggedIn: false,
  };
  if (localStorageData) {
    try {
      persistedState = JSON.parse(localStorageData);
    } catch (error) {}
  }

  const middleware = addLogger ? applyMiddleware(thunk, logger) : applyMiddleware(thunk);
  const store = createStore(authReducer, persistedState, middleware);

  // Se le llamará cuando algo cambie en nuestro store de Redux
  store.subscribe(() => {
    localStorage.setItem('hoax-auth', JSON.stringify(store.getState()));
  });

  return store;
};

export default configureStore;
