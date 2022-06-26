import * as apiCalls from '../api/apiCalls';

// Para solucionar el problema de UserSignupPage, en el que hemos añadido responsabilidad extra
// a nuestros componentes (solo debería obtener la información de usuario y hacer post al backend)
// vamos a extraer esas acciones fuera de nuestros componentes, a este módulo (action creators)
// Se ha instalado una librería de Redux que actúa como middleware (redux-thunk)

// To-dos los valores de nuestro payload login-success
export const loginSuccess = (loginUserData) => {
  return {
    type: 'login-success',
    payload: loginUserData,
  };
};

// username y password, obtenidos del formulario LoginPage.
// Estamos devolviendo una función y aquí es donde entra redux-thunk
export const loginHandler = (credentials) => {
  return function (dispatch) {
    return apiCalls.login(credentials).then((response) => {
      dispatch(
        loginSuccess({
          ...response.data,
          password: credentials.password,
        })
      );

      return response;
    });
  };
};
