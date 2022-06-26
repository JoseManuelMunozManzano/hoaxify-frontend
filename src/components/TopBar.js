import React from 'react';
import logo from '../assets/hoaxify-logo.png';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class TopBar extends React.Component {
  render() {
    let links = (
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
    );

    if (this.props.user.isLoggedIn) {
      links = (
        <ul className="nav navbar-nav ml-auto">
          <li className="nav-item">Logout</li>
        </ul>
      );
    }

    return (
      <div className="bg-white shadow-sm mb-2">
        <div className="container">
          <nav className="navbar navbar-light navbar-expand">
            <Link to="/" className="navbar-brand">
              <img src={logo} width="60" alt="Hoaxify" /> Hoaxify
            </Link>
            {links}
          </nav>
        </div>
      </div>
    );
  }
}

// Este state viene de Redux
const mapStateToProps = (state) => {
  return {
    user: state,
  };
};

// connect es una función que devuelve otra función como resultado.
// TopBar es un parámetro de la función retornada.
export default connect(mapStateToProps)(TopBar);