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

const mockSuccessUpdateUser = {
  data: {
    id: 1,
    username: 'user1',
    displayName: 'display1-update',
    image: 'profile1-update.png',
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
    const setupForEdit = async () => {
      setUserOneLoggedInStorage();
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
      const rendered = setup({ match });
      const editButton = await rendered.findByText('Edit');
      fireEvent.click(editButton);

      return rendered;
    };

    it('displays edit layout when clicking edit button', async () => {
      const { queryByText } = await setupForEdit();
      expect(screen.queryByText('Save')).toBeInTheDocument();
    });

    it('returns back to none edit mode after clicking cancel', async () => {
      const { queryByText } = await setupForEdit();

      const cancelButton = screen.queryByText('Cancel');
      fireEvent.click(cancelButton);

      expect(screen.queryByText('Edit')).toBeInTheDocument();
    });

    // Aunque funciona el test, en la pestaña Network vemos que el servidor nos devuelve Not allowed
    // Falta el id en el Put Request (http://localhost:3000/api/1.0/users/undefined)
    // Falta el body request
    //
    // Arreglado esto con los 2 test siguientes, ya funciona la respuesta del servidor.
    it('calls updateUser api when clicking save', async () => {
      const { queryByText } = await setupForEdit();
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const saveButton = screen.queryByText('Save');
      fireEvent.click(saveButton);

      expect(apiCalls.updateUser).toHaveBeenCalledTimes(1);
    });

    // test del id en el Put Request
    it('calls updateUser api with user id', async () => {
      const { queryByText } = await setupForEdit();
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const saveButton = screen.queryByText('Save');
      fireEvent.click(saveButton);
      const userId = apiCalls.updateUser.mock.calls[0][0];

      // estamos probando con user1 que tiene el id 1
      expect(userId).toBe(1);
    });

    // test del request body
    it('calls updateUser api with request body having changed displayName', async () => {
      const { queryByText, container } = await setupForEdit();
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const displayInput = container.querySelector('input');
      fireEvent.change(displayInput, { target: { value: 'display1-update' } });

      const saveButton = screen.queryByText('Save');
      fireEvent.click(saveButton);

      // El body es el segundo parámetro
      const requestBody = apiCalls.updateUser.mock.calls[0][1];

      // estamos probando con user1 que tiene el id 1
      expect(requestBody.displayName).toBe('display1-update');
    });

    it('returns to non edit mode after successful updateUser api call', async () => {
      const { queryByText } = await setupForEdit();
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const saveButton = screen.queryByText('Save');
      fireEvent.click(saveButton);

      const editButtonAfterClickingSave = await screen.findByText('Edit');

      // estamos probando con user1 que tiene el id 1
      expect(editButtonAfterClickingSave).toBeInTheDocument();
    });
  });
});

console.error = () => {};
