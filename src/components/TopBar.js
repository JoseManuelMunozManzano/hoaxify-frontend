import React from 'react';
import logo from '../assets/hoaxify-logo.png';
import { Link } from 'react-router-dom';

class TopBar extends React.Component {
  render() {
    return (
      <div className="bg-white shadow-sm mb-2">
        <div className="container">
          <nav className="navbar navbar-light navbar-expand">
            {/* Para que la imagen tenga un link a home:
              1. Envolver la imagen con el tag <a> y establecer href con el valor que queremos.
                  Como usamos HashRouter nuestros links van con prefijo #. Si pulsamos el logo,
                  nuestra página se recarga porque nuestro link no esta hasheado y el browser
                  envía esta petición url que hace que nuestra aplicación se recargue. 

              2. Se añade # a nuestro link. Esto hace que el test falle porque se espera que
                href sera "/", no "#/", pero cuando pulsamos en nuestro icono nuestra app
                no se recarga. Este es el comportamiento que queremos.
                Para que nuestro test pase, ReactRouter viene con una solución, esto es,
                el componente <Link />.
                Básicamente crea por nosotros el correspondiente link basado en el comportamiento
                de root de nuestro cliente. 
                Sustituimos <a> por <Link> y "#/" por "/"
                Esto da error de test, en la consola: You should not use <Link> outside a <Router> 
                En el navegador no se ve ese error porque TopBar esta en App que esta en Router. */}
            <Link to="/" className="navbar-brand">
              <img src={logo} width="60" alt="Hoaxify" /> Hoaxify
            </Link>
            <ul className="nav navbar-nav ml-auto">
              <li className="nav-item">
                <Link to="/signup" className="nav-link">
                  Sign Up
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    );
  }
}

export default TopBar;
