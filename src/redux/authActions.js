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

export const signupHandler = (user) => {
  return function (dispatch) {
    return apiCalls.signup(user).then((response) => {
      return dispatch(loginHandler(user));
      // Este return estaba mal.
      //
      // Tras el hacer el submit de la petición de signup, redireccionamos a homepage, pero
      // nuestro TopBar se actualiza al layout login cuando la petición login se resuelve con éxito.
      // Como hay otra llamada a la API en progreso (la del login), debemos esperar a que se
      // resuelva antes de redirigir a homepage
      // Con la solución, la página se redirige a homepage cuando ambas llamadas, signup y login
      // han termninado.
      //
      // En definitiva, mucho cuidado y poner el return en el dispatch porque si se hace después
      // se está haciendo el return sin que haya terminado de resolverse ese dispatch.
      //
      // return response;
    });
  };
};
