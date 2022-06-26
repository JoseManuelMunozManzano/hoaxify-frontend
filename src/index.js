import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { HashRouter } from 'react-router-dom';
import App from './containers/App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import authReducer from './redux/authReducer';
import logger from 'redux-logger';

// Para hacer prueba:
// Si vamos a Chrome, Herramientas de Desarrolladores, Components, y nos posicionamos en
// TopBar veremos en nuestros props user con los valores.
// Si cambiamos el valor de isLoggedIn de true a false, vemos como el Layout se actualiza
// y vuelve a aparecer SignUP y Login.
const loggedInState = {
  id: 1,
  username: 'user1',
  displayName: 'display1',
  image: 'profile1.png',
  password: 'P4ssword',
  isLoggedIn: true,
};

// Vamos a usar Redux para mantener el estado de nuestra autenticación
// En una app Redux, solo podemos tener un store, y este es responsable de mantener el estado
// de la aplicación.
// El estado se actualiza cuando se despachan funciones.
const store = createStore(authReducer, loggedInState, applyMiddleware(logger));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
);
