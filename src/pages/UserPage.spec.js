import { render, screen, fireEvent } from '@testing-library/react';
import UserPage from './UserPage';
import * as apiCalls from '../api/apiCalls';
import axios from 'axios';
import configureStore from '../redux/configureStore';
import { Provider } from 'react-redux';

const mockSuccessGetUser = {
  data: {
    id: 1,
    username: 'user1',
    displayName: 'display1',
    image: 'profile1.png',
  },
};

const mockFailGetUser = {
  response: {
    data: {
      message: 'User not found',
    },
  },
};

// Con match estamos replicando lo que se ve en Chrome, en Developer Tools, pestaña Components, y buscar UserPage y click en el.
// En la parte derecha, en props, se ve este match con el parámetro params y username
const match = {
  params: {
    username: 'user1',
  },
};

const setup = (props) => {
  const store = configureStore(false);

  return render(
    <Provider store={store}>
      <UserPage {...props} />
    </Provider>
  );
};

beforeEach(() => {
  localStorage.clear();
  delete axios.defaults.headers.common['Authorization'];
});

const setUserOneLoggedInStorage = () => {
  localStorage.setItem(
    'hoax-auth',
    JSON.stringify({
      id: 1,
      username: 'user1',
      displayName: 'display1',
      image: 'profile1.png',
      password: 'P4ssword',
      isLoggedIn: true,
    })
  );
};

describe('UserPage', () => {
  describe('Layout', () => {
    // Este test falla porque no llega a encontrar el testid userpage cuando se carga el spinner
    it('has root page div', () => {
      // Por ahora no sabemos como va a ser esta UserPage. Por tanto, necesitamos tener
      // algún tipo de datos de un usuario no visible para consultar.
      //
      // No es una buena práctica, pero para este caso, por ahora, es la única solución disponible.
      const { queryByTestId } = setup();
      const userPageDiv = screen.queryByTestId('userpage');
      expect(userPageDiv).toBeInTheDocument();
    });

    it('displays the displayName@username when user data loaded', async () => {
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
      const { findByText } = setup({ match });
      const text = await findByText('display1@user1');
      expect(text).toBeInTheDocument();
    });

    // Probar con la siguiente url: http://localhost:3000/#/user301
    // O cualquier usuario que sepamos que no existe
    //
    // Falla porque se muestra el spinner en vez del texto User not found
    it('displays not found alert when user not found', async () => {
      apiCalls.getUser = jest.fn().mockRejectedValue(mockFailGetUser);
      const { findByText } = setup({ match });
      const alert = await findByText('User not found');
      expect(alert).toBeInTheDocument();
    });

    it('displays spinner while loading user data', () => {
      const mockDelayedResponse = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetUser);
          }, 300);
        });
      });

      apiCalls.getUser = mockDelayedResponse;
      const { queryByText } = setup({ match });
      const spinner = screen.queryByText('Loading...');
      expect(spinner).toBeInTheDocument();
    });

    it('displays the edit button when loggedInUser matches to user in url', async () => {
      setUserOneLoggedInStorage();
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
      const { findByText } = setup({ match });
      await findByText('display1@user1');
      const editButton = screen.queryByText('Edit');
      expect(editButton).toBeInTheDocument();
    });
  });

  describe('Lifecycle', () => {
    it('calls getUser when it is rendered', () => {
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
      setup({ match });
      expect(apiCalls.getUser).toHaveBeenCalledTimes(1);
    });

    it('calls getUser for user1 when it is rendered with user1 in match', () => {
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
      setup({ match });
      expect(apiCalls.getUser).toHaveBeenCalledWith('user1');
    });
  });

  describe('ProfileCard Interactions', () => {
    it('displays edit layout when clicking edit button', async () => {
      setUserOneLoggedInStorage();
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
      const { findByText } = setup({ match });

      const editButton = await findByText('Edit');

      fireEvent.click(editButton);
      expect(screen.queryByText('Save')).toBeInTheDocument();
    });
  });
});
