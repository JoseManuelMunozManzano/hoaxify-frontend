import React from 'react';

// En este componente listaremos los usuarios. Tendrá su propio estado y hará llamadas a la API
class UserList extends React.Component {
  render() {
    return (
      <div className="card">
        <h3 className="card-title m-auto">Users</h3>
      </div>
    );
  }
}

export default UserList;
