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
  render() {
    return (
      <div>
        <h1>Sign Up</h1>
      </div>
    );
  }
}

// Este export es para Redux, más adelante
export default UserSignUpPage;
