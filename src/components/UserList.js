import React from 'react';
import * as apiCalls from '../api/apiCalls';

// En este componente listaremos los usuarios. Tendrá su propio estado y hará llamadas a la API
class UserList extends React.Component {
  state = {
    page: {
      number: 0,
      size: 3,
    },
  };

  // Ciclo de Vida: llamado cuando este componente se añada a la Page
  componentDidMount() {
    apiCalls.listUsers({ page: this.state.page.number, size: this.state.page.size }).then(() => {});
  }

  render() {
    return (
      <div className="card">
        <h3 className="card-title m-auto">Users</h3>
      </div>
    );
  }
}

export default UserList;
