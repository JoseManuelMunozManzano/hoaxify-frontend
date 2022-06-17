// Se va a usar la nomenclatura siguiente:
// component.spec.js     este para el componente
// component.test.js     este para los tests del componente
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

  render() {
    return (
      <div>
        <h1>Sign Up</h1>
        <div>
          <input placeholder="Your display name" value={this.state.displayName} onChange={this.onChangeDisplayName} />
        </div>

        <div>
          <input placeholder="Your username" value={this.state.username} onChange={this.onChangeUsername} />
        </div>

        <div>
          <input
            placeholder="Your password"
            type="password"
            value={this.state.password}
            onChange={this.onChangePassword}
          />
        </div>

        <div>
          <input
            placeholder="Repeat your password"
            type="password"
            value={this.state.passwordRepeat}
            onChange={this.onChangePasswordRepeat}
          />
        </div>

        <div>
          <button>Sign Up</button>
        </div>
      </div>
    );
  }
}

// Este export es para Redux, más adelante
export default UserSignUpPage;
