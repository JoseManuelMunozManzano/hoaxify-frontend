import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { HashRouter } from 'react-router-dom';

// Si vamos a Chrome, herramientas de desarrollador (F12), tab Components de React y LoginPage,
// veremos que hay nuevas props.
// Antes teníamos solo la propiedad actions
// Ahora también tenemos history, location y match
// Estos props los proporciona React Router.
// Para confirmarlo importamos LoginPage y la renderizamos.
// Ahora vemos solo el prop actions.
import LoginPage from './pages/LoginPage';

import App from './containers/App';
import * as apiCalls from './api/apiCalls';

const actions = {
  postLogin: apiCalls.login,
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HashRouter>
    <LoginPage />
  </HashRouter>
);
