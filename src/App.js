import { UserSignUpPage } from './pages/UserSignupPage';
import { LoginPage } from './pages/LoginPage';
import * as apiCalls from './api/apiCalls';

// Para pasar la función sign-up como un prop a UserSignupPage
// Esto no quedará en producción, es solo con propósito de pruebas.
// Esto lo hacemos aquí porque más tarde vamos a meter Redux y se dispararán las acciones de Sign Up a través de el.
const actions = {
  postSignup: apiCalls.signup,
};

function App() {
  // return <UserSignUpPage actions={actions} />;
  return <LoginPage />;
}

export default App;
