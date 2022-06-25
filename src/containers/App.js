import { Route, Switch } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import UserSignupPage from '../pages/UserSignupPage';
import UserPage from '../pages/UserPage';
import TopBar from '../components/TopBar';
import * as apiCalls from '../api/apiCalls';

const actions = {
  postLogin: apiCalls.login,
  postSignup: apiCalls.signup,
};

function App() {
  // Hay un problema potencial con este routing interno.
  // Tenemos mapeos para:
  // http://localhost:3000/#/login
  // http://localhost:3000/#/signup
  // http://localhost:3000/#/user1 (realmente es dinámico)
  //
  // Pero, qué ocurre si un usuario crea un username para login o signup?
  // Cuando queramos visualizar la página user para el, desplegaremos la página login o la signup.
  // Este no es un buen comportamiento para un cliente. Se puede resolver este problema
  // añadiendo números aleatorios al username para hacerlos únicos.
  // Por ahora lo dejamos como está.
  return (
    <div>
      <TopBar />
      <div className="container">
        <Switch>
          <Route exact path="/" component={HomePage} />
          {/* En estos props va history, location y match */}
          <Route path="/login" component={(props) => <LoginPage {...props} actions={actions} />} />
          <Route path="/signup" component={(props) => <UserSignupPage {...props} actions={actions} />} />
          {/* Path dinámico usando : */}
          <Route path="/:username" component={UserPage} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
