// Se va a usar la nomenclatura siguiente:
// component.js          este para el componente
// component.spec.js     este para los tests del componente
//
// NOTA: También se podría haber creado un folder llamado __tests__ y meter los tests ahí.
//
//
// Para nombrar los test hay dos posibilidades:
// test
// it     La que vamos a usar

import React from 'react';

// Statefull compoennt. No se usan hooks
// Incluimos aquí el export para nuestros tests
export class UserSignUpPage extends React.Component {
  state = {
    displayName: '',
    username: '',
    password: '',
    passwordRepeat: '',
    pendingApiCall: false,
  };

  onChangeDisplayName = (event) => {
    const value = event.target.value;

    this.setState({
      displayName: value,
    });
  };

  onChangeUsername = (event) => {
    const value = event.target.value;

    this.setState({
      username: value,
    });
  };

  onChangePassword = (event) => {
    const value = event.target.value;

    this.setState({
      password: value,
    });
  };

  onChangePasswordRepeat = (event) => {
    const value = event.target.value;

    this.setState({
      passwordRepeat: value,
    });
  };

  onClickSignup = () => {
    const user = {
      username: this.state.username,
      displayName: this.state.displayName,
      password: this.state.password,
    };
    this.setState({ pendingApiCall: true });
    // Como es un promise, manejamos la condición resolve.
    // Por ahora solo actualizamos el state
    this.props.actions.postSignup(user).then((response) => {
      this.setState({ pendingApiCall: false });
    });
  };

  render() {
    return (
      <div className="container">
        <h1 className="text-center">Sign Up</h1>
        <div className="col-12 mb-3">
          <label>Display Name</label>
          <input
            className="form-control"
            placeholder="Your display name"
            value={this.state.displayName}
            onChange={this.onChangeDisplayName}
          />
        </div>

        <div className="col-12 mb-3">
          <label>Username</label>
          <input
            className="form-control"
            placeholder="Your username"
            value={this.state.username}
            onChange={this.onChangeUsername}
          />
        </div>

        <div className="col-12 mb-3">
          <label>Password</label>
          <input
            className="form-control"
            placeholder="Your password"
            type="password"
            value={this.state.password}
            onChange={this.onChangePassword}
          />
        </div>

        <div className="col-12 mb-3">
          <label>Password Repeat</label>
          <input
            className="form-control"
            placeholder="Repeat your password"
            type="password"
            value={this.state.passwordRepeat}
            onChange={this.onChangePasswordRepeat}
          />
        </div>

        <div className="text-center">
          <button className="btn btn-primary" onClick={this.onClickSignup} disabled={this.state.pendingApiCall}>
            {this.state.pendingApiCall && (
              <div className="spinner-border text-light spinner-border-sm mr-sm-1" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            )}
            Sign Up
          </button>
        </div>
      </div>
    );
  }
}

UserSignUpPage.defaultProps = {
  actions: {
    postSignup: () =>
      new Promise((resolve, reject) => {
        resolve({});
      }),
  },
};

// Este export es para Redux, más adelante
export default UserSignUpPage;
