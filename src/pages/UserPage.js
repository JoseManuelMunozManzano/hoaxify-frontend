import React from 'react';
import * as apiCalls from '../api/apiCalls';

class UserPage extends React.Component {
  state = {
    user: undefined,
    userNotFound: false,
  };

  // Ahora mismo, tenemos un problema aquí.
  // Este ciclo de vida se ejecuta la primera vez al cargar la página.
  //
  // Por ejemplo: hacemos login con datos user1 y P4ssword1
  // Pulsamos en display2@user2 y vemos la url http://localhost:3000/#/user2 y en pantalla
  // display2@user2
  // Pero si ahora pulsamos en botón My Profile, la url es http://localhost:3000/#/user1, pero
  // la información que seguimos viendo en pantalla es display2@user2, es decir, no sale
  // display1@user1
  //
  // El problema es, como se ha dicho, que este código sólo se ejecuta la primera vez, al entrar
  // en la página. La segunda vez (pulsar My Profile) ya no recupera la información del username.
  componentDidMount() {
    this.loadUser();
  }

  // Se soluciona el problema usando otro elemento del ciclo de vida: componentDidUpdate
  // Confirmamos si tenemos que cargar los datos de nuevo
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.username !== this.props.match.params.username) {
      this.loadUser();
    }
  }

  loadUser = () => {
    const username = this.props.match.params.username;
    if (!username) {
      return;
    }
    apiCalls
      .getUser(username)
      .then((response) => {
        this.setState({ user: response.data });
      })
      .catch((error) => {
        // Por ahora no nos importa el motivo del fallo
        this.setState({
          userNotFound: true,
        });
      });
  };

  render() {
    if (this.state.userNotFound) {
      return (
        <div className="alert alert-danger text-center" role="alert">
          <div className="alert-heading">
            <i class="fas fa-exclamation-triangle fa-3x"></i>
          </div>
          <h5>User not found</h5>
        </div>
      );
    }

    return (
      <div data-testid="userpage">
        {this.state.user && <span>{`${this.state.user.displayName}@${this.state.user.username}`}</span>}
      </div>
    );
  }
}

UserPage.defaultProps = {
  match: {
    params: {},
  },
};

export default UserPage;
