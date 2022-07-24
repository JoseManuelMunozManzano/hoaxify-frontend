import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { Provider } from 'react-redux';
import axios from 'axios';
import configureStore from '../redux/configureStore';
import { Buffer } from 'buffer';
import * as apiCalls from '../api/apiCalls';

// Se pone para que no fallen los tests App.spec.js y HomePage.spec.js que no hacen
// mocking a UserList aunque lo esté llamando la cadena App.js > HomePage.js
apiCalls.listUsers = jest.fn().mockResolvedValue({
  data: {
    content: [],
    number: 0,
    size: 3,
  },
});

// Se añade por el mismo motivo de arriba
apiCalls.loadHoaxes = jest.fn().mockResolvedValue({
  data: {
    content: [],
    number: 0,
    size: 3,
  },
});

// Añadido por la misma razón que apiCalls.listUsers
apiCalls.getUser = jest.fn().mockResolvedValue({
  data: {
    id: 1,
    username: 'user1',
    displayName: 'display1',
    image: 'profile1.png',
  },
});

const mockSuccessGetUser1 = {
  data: {
    id: 1,
    username: 'user1',
    displayName: 'display1',
    image: 'profile1.png',
  },
};

const mockSuccessGetUser2 = {
  data: {
    id: 2,
    username: 'user2',
    displayName: 'display2',
    image: 'profile2.png',
  },
};

// Otro problema es si ponemos a mano una url de un usuario inexistente
// http://localhost:3000/#/user50
// Aparece el mensaje de error User not found.
// Si ahora pulsamos en My Profile
// Cambia la url pero se sigue mostrando el mensaje de error
const mockFailGetUser = {
  response: {
    data: {
      message: 'User not found',
    },
  },
};

// Para evitar problemas de datos cargados en LocalStorage, los vamos a limpiar antes de cada test
beforeEach(() => {
  localStorage.clear();
  delete axios.defaults.headers.common['Authorization'];
});

const setup = (path) => {
  const store = configureStore(false);

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </Provider>
  );
};

const changeEvent = (content) => ({
  target: {
    value: content,
  },
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

describe('App', () => {
  it('displays homepage when url is /', () => {
    const { getByTestId } = setup('/');
    expect(screen.getByTestId('homepage')).toBeInTheDocument();
  });

  it('displays LoginPage when url is /login', () => {
    const { container } = setup('/login');
    const header = container.querySelector('h1');
    expect(header).toHaveTextContent('Login');
  });

  // Para evitar path parciales. Por ejemplo, /login y /homepage parten ambos de /
  it('displays only LoginPage when url is /login', () => {
    const { queryByTestId } = setup('/login');
    expect(screen.queryByTestId('homepage')).not.toBeInTheDocument();
  });

  it('displays UserSignupPage when url is /signup', () => {
    const { container } = setup('/signup');
    const header = container.querySelector('h1');
    expect(header).toHaveTextContent('Sign Up');
  });

  it('displays userpage when url is other than /, /login or /signup', () => {
    const { getByTestId } = setup('/user1');
    expect(screen.getByTestId('userpage')).toBeInTheDocument();
  });

  it('displays topBar when url is /', () => {
    const { container } = setup('/');
    const navigation = container.querySelector('nav');
    expect(navigation).toBeInTheDocument();
  });
  it('displays topBar when url is /login', () => {
    const { container } = setup('/login');
    const navigation = container.querySelector('nav');
    expect(navigation).toBeInTheDocument();
  });
  it('displays topBar when url is /signup', () => {
    const { container } = setup('/signup');
    const navigation = container.querySelector('nav');
    expect(navigation).toBeInTheDocument();
  });
  it('displays topBar when url is /user1', () => {
    const { container } = setup('/user1');
    const navigation = container.querySelector('nav');
    expect(navigation).toBeInTheDocument();
  });

  it('shows the UserSignupPage when clicking signup', () => {
    const { queryByText, container } = setup('/');
    const signupLink = screen.queryByText('Sign Up');
    fireEvent.click(signupLink);
    const header = container.querySelector('h1');
    expect(header).toHaveTextContent('Sign Up');
  });

  it('shows the LoginPage when clicking login', () => {
    const { queryByText, container } = setup('/');
    const loginLink = screen.queryByText('Login');
    fireEvent.click(loginLink);
    const header = container.querySelector('h1');
    expect(header).toHaveTextContent('Login');
  });

  it('shows the HomePage when clicking logo', () => {
    const { getByTestId, container } = setup('/login');
    const logo = container.querySelector('img');
    fireEvent.click(logo);
    expect(screen.getByTestId('homepage')).toBeInTheDocument();
  });

  it('displays My Profile on TopBar after login success', async () => {
    const { container } = setup('/login');

    const usernameInput = screen.queryByPlaceholderText('Your username');
    fireEvent.change(usernameInput, changeEvent('user1'));
    const passwordInput = screen.queryByPlaceholderText('Your password');
    fireEvent.change(passwordInput, changeEvent('P4ssword'));
    const button = container.querySelector('button');

    axios.post = jest.fn().mockResolvedValue({
      data: {
        id: 1,
        username: 'user1',
        displayName: 'display1',
        image: 'profile1.png',
      },
    });

    fireEvent.click(button);

    const myProfileLink = await screen.findByText('My Profile');
    expect(myProfileLink).toBeInTheDocument();
  });

  it('displays My Profile on TopBar after signup success', async () => {
    const { container } = setup('/signup');

    const displayNameInput = screen.queryByPlaceholderText('Your display name');
    const usernameInput = screen.queryByPlaceholderText('Your username');
    const passwordInput = screen.queryByPlaceholderText('Your password');
    const passwordRepeat = screen.queryByPlaceholderText('Repeat your password');

    fireEvent.change(displayNameInput, changeEvent('display1'));
    fireEvent.change(usernameInput, changeEvent('user1'));
    fireEvent.change(passwordInput, changeEvent('P4ssword'));
    fireEvent.change(passwordRepeat, changeEvent('P4ssword'));

    const button = container.querySelector('button');

    // 2 mocks, uno para el signup y otro para el login
    axios.post = jest
      .fn()
      .mockResolvedValueOnce({
        data: {
          message: 'User saved',
        },
      })
      .mockResolvedValueOnce({
        data: {
          id: 1,
          username: 'user1',
          displayName: 'display1',
          image: 'profile1.png',
        },
      });

    fireEvent.click(button);

    const myProfileLink = await screen.findByText('My Profile');
    expect(myProfileLink).toBeInTheDocument();
  });

  // Para solucionar el problema de reload cuando se hace login.
  // Esta volviendo a mostrar Login y SignUp en TopBar. Para evitarlo se guardarán los datos
  // en Local Storage
  it('saves logged in user data to localStorage after login success', async () => {
    const { container } = setup('/login');

    const usernameInput = screen.queryByPlaceholderText('Your username');
    fireEvent.change(usernameInput, changeEvent('user1'));
    const passwordInput = screen.queryByPlaceholderText('Your password');
    fireEvent.change(passwordInput, changeEvent('P4ssword'));
    const button = container.querySelector('button');

    axios.post = jest.fn().mockResolvedValue({
      data: {
        id: 1,
        username: 'user1',
        displayName: 'display1',
        image: 'profile1.png',
      },
    });

    fireEvent.click(button);

    await screen.findByText('My Profile');
    const dataInStorage = JSON.parse(localStorage.getItem('hoax-auth'));
    expect(dataInStorage).toEqual({
      id: 1,
      username: 'user1',
      displayName: 'display1',
      image: 'profile1.png',
      password: 'P4ssword',
      isLoggedIn: true,
    });
  });

  it('displays logged in topBar when storage has logged in user data', () => {
    setUserOneLoggedInStorage();
    // Realmente no importa la página que pongamos
    const { queryByText } = setup('/');
    const myProfileLink = screen.queryByText('My Profile');
    expect(myProfileLink).toBeInTheDocument();
  });

  it('sets axios authorization with base64 encoded user credentials after login success', async () => {
    const { container } = setup('/login');

    const usernameInput = screen.queryByPlaceholderText('Your username');
    fireEvent.change(usernameInput, changeEvent('user1'));
    const passwordInput = screen.queryByPlaceholderText('Your password');
    fireEvent.change(passwordInput, changeEvent('P4ssword'));
    const button = container.querySelector('button');

    axios.post = jest.fn().mockResolvedValue({
      data: {
        id: 1,
        username: 'user1',
        displayName: 'display1',
        image: 'profile1.png',
      },
    });

    fireEvent.click(button);

    await screen.findByText('My Profile');

    // La cabecera Authorization tendrá las credenciales del usuario codificadas en Base64
    const axiosAuthorization = axios.defaults.headers.common['Authorization'];
    const encoded = Buffer.from('user1:P4ssword').toString('base64');
    const expectedAuthorization = `Basic ${encoded}`;
    expect(axiosAuthorization).toBe(expectedAuthorization);
  });

  it('sets axios authorization with base64 encoded user credentials when storage has logged in user data', () => {
    setUserOneLoggedInStorage();

    setup('/');
    // La cabecera Authorization tendrá las credenciales del usuario codificadas en Base64
    const axiosAuthorization = axios.defaults.headers.common['Authorization'];
    const encoded = Buffer.from('user1:P4ssword').toString('base64');
    const expectedAuthorization = `Basic ${encoded}`;
    expect(axiosAuthorization).toBe(expectedAuthorization);
  });

  it('removes axios authorization header when user logout', () => {
    setUserOneLoggedInStorage();

    const { queryByText } = setup('/');
    fireEvent.click(screen.queryByText('Logout'));

    // La cabecera Authorization tendrá las credenciales del usuario codificadas en Base64
    const axiosAuthorization = axios.defaults.headers.common['Authorization'];
    // toBeFalsy() indica que es null o undefined
    expect(axiosAuthorization).toBeFalsy();
  });

  it('updates user page after clicking my profile when another user page was opened', async () => {
    apiCalls.getUser = jest.fn().mockResolvedValueOnce(mockSuccessGetUser2).mockResolvedValueOnce(mockSuccessGetUser1);

    setUserOneLoggedInStorage();

    const { queryByText } = setup('/user2');
    await screen.findByText('display2@user2');

    const myProfileLink = queryByText('My Profile');
    fireEvent.click(myProfileLink);

    const user1Info = await screen.findByText('display1@user1');
    expect(user1Info).toBeInTheDocument();
  });

  it('updates user page after clicking my profile when another non existing user page was opened', async () => {
    apiCalls.getUser = jest.fn().mockRejectedValueOnce(mockFailGetUser).mockResolvedValueOnce(mockSuccessGetUser1);

    setUserOneLoggedInStorage();

    const { queryByText } = setup('/user50');
    await screen.findByText('User not found');

    const myProfileLink = queryByText('My Profile');
    fireEvent.click(myProfileLink);

    const user1Info = await screen.findByText('display1@user1');
    expect(user1Info).toBeInTheDocument();
  });
});
