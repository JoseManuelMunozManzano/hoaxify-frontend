import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';
import * as apiCalls from '../api/apiCalls';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import authReducer from '../redux/authReducer';

const defaultState = {
  id: 1,
  username: 'user1',
  displayName: 'display1',
  image: 'profile1.png',
  password: 'P4ssword',
  isLoggedIn: true,
};

let store;

const setup = (state = defaultState) => {
  store = createStore(authReducer, state);

  return render(
    <Provider store={store}>
      <HomePage />
    </Provider>
  );
};

// Se pone para que no fallen los tests App.spec.js y HomePage.spec.js que no hacen
// mocking a UserList aunque lo esté llamando la cadena App.js > HomePage.js
apiCalls.listUsers = jest.fn().mockResolvedValue({
  data: {
    content: [],
    number: 0,
    size: 3,
  },
});

describe('HomePage', () => {
  describe('Layout', () => {
    it('has root page div', () => {
      // Por ahora no sabemos como va a ser esta HomePage. Por tanto, necesitamos tener
      // algún tipo de datos de un usuario no visible para consultar.
      //
      // No es una buena práctica, pero para este caso, por ahora, es la única solución disponible.
      const { queryByTestId } = setup();
      const homePageDiv = screen.queryByTestId('homepage');
      expect(homePageDiv).toBeInTheDocument();
    });

    it('displays hoax submit when user logged in', () => {
      const { container } = setup();
      const textArea = container.querySelector('textarea');
      expect(textArea).toBeInTheDocument();
    });
  });
});
