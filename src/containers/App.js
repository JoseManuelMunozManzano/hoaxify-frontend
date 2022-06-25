import { Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';

function App() {
  return (
    <div>
      <div className="container">
        <Route path="/" component={HomePage} />
        <Route path="/login" component={LoginPage} />
      </div>
    </div>
  );
}

export default App;
