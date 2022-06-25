import React from 'react';
import logo from '../assets/hoaxify-logo.png';

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
                  envía esta petición url que hace que nuestra aplicación se recargue. */}
            <a href="/">
              <img src={logo} width="60" alt="Hoaxify" />
            </a>
          </nav>
        </div>
      </div>
    );
  }
}

export default TopBar;
