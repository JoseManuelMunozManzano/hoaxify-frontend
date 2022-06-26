import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { HashRouter } from 'react-router-dom';
import App from './containers/App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import authReducer from './redux/authReducer';
import logger from 'redux-logger';

// Vamos a usar Redux para mantener el estado de nuestra autenticación
// En una app Redux, solo podemos tener un store, y este es responsable de mantener el estado
// de la aplicación.
// El estado se actualiza cuando se despachan funciones.
const store = createStore(authReducer, applyMiddleware(logger));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
);
