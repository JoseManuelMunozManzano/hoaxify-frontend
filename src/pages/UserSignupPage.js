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
import ButtonWithProgress from '../components/ButtonWithProgress';
import Input from '../components/Input';
import { connect } from 'react-redux';

// Statefull compoennt. No se usan hooks
// Incluimos aquí el export para nuestros tests
export class UserSignUpPage extends React.Component {
  state = {
    displayName: '',
    username: '',
    password: '',
    passwordRepeat: '',
    pendingApiCall: false,
    errors: {},
    passwordRepeatConfirmed: true,
  };

  onChangeDisplayName = (event) => {
    const value = event.target.value;

    const errors = { ...this.state.errors };
    delete errors.displayName;

    this.setState({
      displayName: value,
      errors,
    });
  };

  onChangeUsername = (event) => {
    const value = event.target.value;

    const errors = { ...this.state.errors };
    delete errors.username;

    this.setState({
      username: value,
      errors,
    });
  };

  onChangePassword = (event) => {
    const value = event.target.value;

    const passwordRepeatConfirmed = this.state.passwordRepeat === value;

    const errors = { ...this.state.errors };
    delete errors.password;
    errors.passwordRepeat = passwordRepeatConfirmed ? '' : 'Does not match to password';

    this.setState({
      password: value,
      passwordRepeatConfirmed,
      errors,
    });
  };

  onChangePasswordRepeat = (event) => {
    const value = event.target.value;

    const passwordRepeatConfirmed = this.state.password === value;

    const errors = { ...this.state.errors };
    errors.passwordRepeat = passwordRepeatConfirmed ? '' : 'Does not match to password';

    this.setState({
      passwordRepeat: value,
      passwordRepeatConfirmed,
      errors,
    });
  };

  onClickSignup = () => {
    const user = {
      username: this.state.username,
      displayName: this.state.displayName,
      password: this.state.password,
    };
    this.setState({ pendingApiCall: true });
    this.props.actions
      .postSignup(user)
      .then((response) => {
        // Con esto funciona en el navegador (no pasa el test por temas de configuración)
        // Hemos introducido aquí responsabilidad relacionada con LoginPage
        // Pero esta mal porque esto es la página SignUp y no debería importarle como se maneja
        // el login.
        const body = {
          username: this.state.username,
          password: this.state.password,
        };

        this.setState({ pendingApiCall: true });

        this.props.actions
          .postLogin(body)
          .then((response) => {
            const action = {
              type: 'login-success',
              payload: {
                ...response.data,
                password: this.state.password,
              },
            };
            this.props.dispatch(action);
            this.setState({ pendingApiCall: false }, () => {
              this.props.history.push('/');
            });
          })
          .catch((error) => {
            if (error.response) {
              this.setState({ apiError: error.response.data.message, pendingApiCall: false });
            }
          });

        // this.setState({ pendingApiCall: false }, () => {
        //   this.props.history.push('/');
        // });
      })
      .catch((apiError) => {
        let errors = { ...this.state.errors };
        if (apiError.response.data && apiError.response.data.validationErrors) {
          errors = { ...apiError.response.data.validationErrors };
        }
        this.setState({ pendingApiCall: false, errors });
      });
  };

  render() {
    return (
      <div className="container">
        <h1 className="text-center">Sign Up</h1>
        <div className="col-12 mb-3">
          {/* Para que se vea el error hace falta añadir el className is-invalid, porque así funciona Bootstrap. Ver componente Input */}
          <Input
            label="Display Name"
            placeholder="Your display name"
            value={this.state.displayName}
            onChange={this.onChangeDisplayName}
            hasError={this.state.errors.displayName && true}
            error={this.state.errors.displayName}
          />
        </div>

        <div className="col-12 mb-3">
          <Input
            label="Username"
            placeholder="Your username"
            value={this.state.username}
            onChange={this.onChangeUsername}
            hasError={this.state.errors.username && true}
            error={this.state.errors.username}
          />
        </div>

        <div className="col-12 mb-3">
          <Input
            label="Password"
            placeholder="Your password"
            type="password"
            value={this.state.password}
            onChange={this.onChangePassword}
            hasError={this.state.errors.password && true}
            error={this.state.errors.password}
          />
        </div>

        <div className="col-12 mb-3">
          <Input
            label="Password Repeat"
            placeholder="Repeat your password"
            type="password"
            value={this.state.passwordRepeat}
            onChange={this.onChangePasswordRepeat}
            hasError={this.state.errors.passwordRepeat && true}
            error={this.state.errors.passwordRepeat}
          />
        </div>

        <div className="text-center">
          <ButtonWithProgress
            onClick={this.onClickSignup}
            disabled={this.state.pendingApiCall || !this.state.passwordRepeatConfirmed}
            pendingApiCall={this.state.pendingApiCall}
            text="Sign Up"
          />
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
  history: {
    push: () => {},
  },
};

// Este export es para Redux, más adelante
export default connect()(UserSignUpPage);
