import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import authReducer from '../redux/authReducer';

const setup = (path) => {
  const store = createStore(authReducer);

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </Provider>
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
});
