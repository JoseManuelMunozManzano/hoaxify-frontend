import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { Provider } from 'react-redux';
import axios from 'axios';
import configureStore from '../redux/configureStore';

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
});
