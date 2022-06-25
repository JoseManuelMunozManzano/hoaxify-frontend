import { Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';

function App() {
  return (
    <div>
      <div className="container">
        <Route path="/" component={HomePage} />
      </div>
    </div>
  );
}

export default App;
