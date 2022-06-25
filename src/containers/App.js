import { Route, Switch } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';

function App() {
  return (
    <div>
      <div className="container">
        <Switch>
          {/* Para que encuentre correctamente los paths hay 2 posibilidades:
            1. Ordenar los paths */}
          <Route path="/login" component={LoginPage} />
          <Route path="/" component={HomePage} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
