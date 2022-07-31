import React from 'react';
import ButtonWithProgress from '../components/ButtonWithProgress';
import Input from '../components/Input';
import { connect } from 'react-redux';
import * as authActions from '../redux/authActions';

export class UserSignUpPage extends React.Component {
  state = {
    displayName: '',
    username: '',
    password: '',
    passwordRepeat: '',
    pendingApiCall: false,
    errors: {},
  };

  onChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;

    const errors = { ...this.state.errors };
    delete errors[name];

    this.setState({
      [name]: value,
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
        this.setState({ pendingApiCall: false }, () => {
          this.props.history.push('/');
        });
      })
      .catch((apiError) => {
        // console.log(JSON.stringify(apiError.response.data));
        let errors = { ...this.state.errors };
        if (apiError.response.data && apiError.response.data.validationErrors) {
          errors = { ...apiError.response.data.validationErrors };
        }
        this.setState({ pendingApiCall: false, errors });
      });
  };

  render() {
    let passwordRepeatError;
    const { password, passwordRepeat } = this.state;
    if (password || passwordRepeat) {
      passwordRepeatError = password === passwordRepeat ? '' : 'Does not match to password';
    }

    return (
      <div className="container">
        <h1 className="text-center">Sign Up</h1>
        <div className="col-12 mb-3">
          <Input
            name="displayName"
            label="Display Name"
            placeholder="Your display name"
            value={this.state.displayName}
            onChange={this.onChange}
            hasError={this.state.errors.displayName && true}
            error={this.state.errors.displayName}
          />
        </div>

        <div className="col-12 mb-3">
          <Input
            name="username"
            label="Username"
            placeholder="Your username"
            value={this.state.username}
            onChange={this.onChange}
            hasError={this.state.errors.username && true}
            error={this.state.errors.username}
          />
        </div>

        <div className="col-12 mb-3">
          <Input
            name="password"
            label="Password"
            placeholder="Your password"
            type="password"
            value={this.state.password}
            onChange={this.onChange}
            hasError={this.state.errors.password && true}
            error={this.state.errors.password}
          />
        </div>

        <div className="col-12 mb-3">
          <Input
            name="passwordRepeat"
            label="Password Repeat"
            placeholder="Repeat your password"
            type="password"
            value={this.state.passwordRepeat}
            onChange={this.onChange}
            hasError={passwordRepeatError && true}
            error={passwordRepeatError}
          />
        </div>

        <div className="text-center">
          <ButtonWithProgress
            onClick={this.onClickSignup}
            disabled={this.state.pendingApiCall || passwordRepeatError ? true : false}
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

const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      postSignup: (user) => dispatch(authActions.signupHandler(user)),
    },
  };
};

export default connect(null, mapDispatchToProps)(UserSignUpPage);
