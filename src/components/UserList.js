import React from 'react';
import * as apiCalls from '../api/apiCalls';

// En este componente listaremos los usuarios. Tendrá su propio estado y hará llamadas a la API
class UserList extends React.Component {
  // Ciclo de Vida: llamado cuando este componente se añada a la Page
  componentDidMount() {
    apiCalls.listUsers().then(() => {});
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
