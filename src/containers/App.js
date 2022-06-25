import { Route, Switch } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';

function App() {
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
        </Switch>
      </div>
    </div>
  );
}

export default App;
