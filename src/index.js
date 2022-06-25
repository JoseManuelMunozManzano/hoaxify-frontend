import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// En test usamos MemoryRouter, pero en nuestra app usaremos HashRouter
// Añade # a nuestras urls
// Por ejemplo, para login será: localhost:3000/#/login
//
// También existe BrowserRouter. No hace falta añadir el hash (#)
// Luce mejor, pero requiere también implementación en la parte back-end
import { HashRouter } from 'react-router-dom';

import App from './containers/App';
import * as apiCalls from './api/apiCalls';

const actions = {
  // postSignup: apiCalls.signup,
  postLogin: apiCalls.login,
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HashRouter>
    <App />
  </HashRouter>
);
