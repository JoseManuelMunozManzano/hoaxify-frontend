// Para no tener el store en diferentes módulos
import { createStore, applyMiddleware } from 'redux';
import authReducer from './authReducer';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

const configureStore = (addLogger = true) => {
  // Pasamos en nuestro middleware thunk para poder usarlo
  const middleware = addLogger ? applyMiddleware(thunk, logger) : applyMiddleware(thunk);
  return createStore(authReducer, middleware);
};

export default configureStore;
