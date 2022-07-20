import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TopBar from './TopBar';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import authReducer from '../redux/authReducer';
import * as authActions from '../redux/authActions';

const loggedInState = {
  id: 1,
  username: 'user1',
  displayName: 'display1',
  image: 'profile1.png',
  password: 'P4ssword',
  isLoggedIn: true,
};

const defaultState = {
  id: 0,
  username: '',
  displayName: '',
  image: '',
  password: '',
  isLoggedIn: false,
};

let store;

// Para evitar el error: You should not use <Link> outside a <Router>
// Se añade Redux
// Se añade state. Como no todos los tests llaman a setup con parámetro se pone un valor por defecto
const setup = (state = defaultState) => {
  store = createStore(authReducer, state);

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <TopBar />
      </MemoryRouter>
    </Provider>
  );
};

// Generalmente la barra de navegación superior contiene el logo y links internos a nuestra app.
describe('TopBar', () => {
  describe('Layout', () => {
    it('has application logo', () => {
      const { container } = setup();
      const image = container.querySelector('img');
      expect(image.src).toContain('hoaxify-logo.png');
    });

    it('has link to home from logo', () => {
      const { container } = setup();
      const image = container.querySelector('img');
      expect(image.parentElement.getAttribute('href')).toBe('/');
    });

    it('has link to signup', () => {
      const { queryByText } = setup();
      const signupLink = screen.queryByText('Sign Up');
      expect(signupLink.getAttribute('href')).toBe('/signup');
    });

    it('has link to login', () => {
      const { queryByText } = setup();
      const loginLink = screen.queryByText('Login');
      expect(loginLink.getAttribute('href')).toBe('/login');
    });

    it('has link to logout when user logged in', () => {
      const { queryByText } = setup(loggedInState);
      const logoutLink = screen.queryByText('Logout');
      expect(logoutLink).toBeInTheDocument();
    });

    it('has link to user profile when user logged in', () => {
      const { queryByText } = setup(loggedInState);
      const profileLink = screen.queryByText('My Profile');
      // Es user1 porque en loggedInState hemos puesto ese valor a username
      expect(profileLink.getAttribute('href')).toBe('/user1');
    });

    it('displays the displayName when user logged in', () => {
      const { queryByText } = setup(loggedInState);
      const displayName = screen.queryByText('display1');
      expect(displayName).toBeInTheDocument();
    });

    it('displays users image when user logged in', () => {
      const { container } = setup(loggedInState);
      const images = container.querySelectorAll('img');
      const userImage = images[1];
      expect(userImage.src).toContain('/images/profile/' + loggedInState.image);
    });
  });

  describe('Interactions', () => {
    it('displays the login and signup links when user clicks logout', () => {
      const { queryByText } = setup(loggedInState);
      const logoutLink = screen.queryByText('Logout');
      fireEvent.click(logoutLink);

      // Podemos probar Login y SignUp, pero con uno es suficiente
      const loginLink = screen.queryByText('Login');
      expect(loginLink).toBeInTheDocument();
    });

    it('adds show class to drop down menu when clicking username', () => {
      const { queryByText, queryByTestId } = setup(loggedInState);
      const displayName = screen.queryByText('display1');
      fireEvent.click(displayName);
      const dropDownMenu = screen.queryByTestId('drop-down-menu');
      expect(dropDownMenu).toHaveClass('show');
    });

    it('removes show class to drop down menu when clicking app logo', () => {
      const { queryByText, queryByTestId, container } = setup(loggedInState);
      const displayName = screen.queryByText('display1');
      fireEvent.click(displayName);

      const logo = container.querySelector('img');
      fireEvent.click(logo);

      const dropDownMenu = screen.queryByTestId('drop-down-menu');
      expect(dropDownMenu).not.toHaveClass('show');
    });

    it('removes show class to drop down menu when clicking logout', async () => {
      const { queryByText, queryByTestId } = setup(loggedInState);
      const displayName = screen.queryByText('display1');
      fireEvent.click(displayName);

      fireEvent.click(screen.queryByText('Logout'));

      await store.dispatch(authActions.loginSuccess(loggedInState));

      const dropDownMenu = screen.queryByTestId('drop-down-menu');
      expect(dropDownMenu).not.toHaveClass('show');
    });
  });
});
