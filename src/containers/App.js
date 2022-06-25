import { Route, Switch } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import UserSignupPage from '../pages/UserSignupPage';
import UserPage from '../pages/UserPage';

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
      <div className="container">
        <Switch>
          {/* Para que encuentre correctamente los paths hay 2 posibilidades:
            1. Ordenar los paths
            2. Usar la propiedad exact. Se usa cuando queremos que el componente sea visible
                si se cumple el path concreto */}
          <Route exact path="/" component={HomePage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={UserSignupPage} />
          {/* Path dinámico usando : */}
          <Route path="/:username" component={UserPage} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
