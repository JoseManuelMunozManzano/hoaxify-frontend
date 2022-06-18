import React from 'react';
import { render, screen, fireEvent, queryByPlaceholderText } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { UserSignUpPage } from './UserSignupPage.spec';

// Se agrupan los tests de JavaScript en funciones describe(), para organizarlos
// Toman 2 parámetros, la descripción y la función donde se incluirán las funciones de test
describe('UserSignUpPage', () => {
  // Vamos a testear la existencia de los campos requeridos
  // Vamos a renderizar el componente y luego su cabecera
  describe('Layout', () => {
    it('has header of Sign Up', () => {
      const { container } = render(<UserSignUpPage />);
      // No recomendado acceder con querySelector
      const header = container.querySelector('h1');
      expect(header).toHaveTextContent('Sign Up');
    });

    it('has input for display name', () => {
      const { queryByPlaceholderText } = render(<UserSignUpPage />);
      const displayNameInput = screen.queryByPlaceholderText('Your display name');
      expect(displayNameInput).toBeInTheDocument();
    });

    it('has input for username', () => {
      const { queryByPlaceholderText } = render(<UserSignUpPage />);
      const usernameInput = screen.queryByPlaceholderText('Your username');
      expect(usernameInput).toBeInTheDocument();
    });

    it('has input for password', () => {
      const { queryByPlaceholderText } = render(<UserSignUpPage />);
      const passwordInput = screen.queryByPlaceholderText('Your password');
      expect(passwordInput).toBeInTheDocument();
    });

    it('has password type for password input', () => {
      const { queryByPlaceholderText } = render(<UserSignUpPage />);
      const passwordInput = screen.queryByPlaceholderText('Your password');
      expect(passwordInput.type).toBe('password');
    });

    it('has input for password repeat', () => {
      const { queryByPlaceholderText } = render(<UserSignUpPage />);
      const passwordRepeat = screen.queryByPlaceholderText('Repeat your password');
      expect(passwordRepeat).toBeInTheDocument();
    });

    it('has password type for password repeat input', () => {
      const { queryByPlaceholderText } = render(<UserSignUpPage />);
      const passwordRepeat = screen.queryByPlaceholderText('Repeat your password');
      expect(passwordRepeat.type).toBe('password');
    });

    it('has submit button', () => {
      const { container } = render(<UserSignUpPage />);
      // No recomendado acceder con querySelector
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    const changeEvent = (content) => ({
      target: {
        value: content,
      },
    });

    let button, displayNameInput, usernameInput, passwordInput, passwordRepeat;

    // Función para test de click en Sign Up
    const setupForSubmit = (props) => {
      // Vamos a cambiar nuestros campos input y vamos a hacer click en el botón
      const view = render(<UserSignUpPage {...props} />);

      const { container, queryByPlaceholderText } = view;
      displayNameInput = screen.queryByPlaceholderText('Your display name');
      usernameInput = screen.queryByPlaceholderText('Your username');
      passwordInput = screen.queryByPlaceholderText('Your password');
      passwordRepeat = screen.queryByPlaceholderText('Repeat your password');

      fireEvent.change(displayNameInput, changeEvent('my-display-name'));
      fireEvent.change(usernameInput, changeEvent('my-username'));
      fireEvent.change(passwordInput, changeEvent('P4ssword'));
      fireEvent.change(passwordRepeat, changeEvent('P4ssword'));

      button = container.querySelector('button');

      return view;
    };

    it('sets the displayName value into state', () => {
      const { queryAllByPlaceholderText } = render(<UserSignUpPage />);
      const displayNameInput = screen.queryByPlaceholderText('Your display name');

      // Se simula la acción de entrada de datos de usuario con fireEvent.
      // change toma el campo como primer parámetro y el evento change como segundo parámetro.
      fireEvent.change(displayNameInput, changeEvent('my-display-name'));

      expect(displayNameInput).toHaveValue('my-display-name');
    });

    it('sets the username value into state', () => {
      const { queryAllByPlaceholderText } = render(<UserSignUpPage />);
      const usernameInput = screen.queryByPlaceholderText('Your username');

      fireEvent.change(usernameInput, changeEvent('my-user-name'));

      expect(usernameInput).toHaveValue('my-user-name');
    });

    it('sets the password value into state', () => {
      const { queryAllByPlaceholderText } = render(<UserSignUpPage />);
      const passwordInput = screen.queryByPlaceholderText('Your password');

      fireEvent.change(passwordInput, changeEvent('P4ssword'));

      expect(passwordInput).toHaveValue('P4ssword');
    });

    it('sets the password repeat value into state', () => {
      const { queryAllByPlaceholderText } = render(<UserSignUpPage />);
      const passwordRepeat = screen.queryByPlaceholderText('Repeat your password');

      fireEvent.change(passwordRepeat, changeEvent('P4ssword'));

      expect(passwordRepeat).toHaveValue('P4ssword');
    });

    it('calls postSignup when the fields are valid and the actions are provided in props', () => {
      // Se envía una petición http al backend.
      // En Testing, no se realiza realmente la llamada a la API del servidor.
      // Lo qwe se hace es emular que se envía la petición http. Esto se llama mocking.
      //
      // Primero creamos un objeto con nuestras acciones
      const actions = {
        postSignup: jest.fn().mockResolvedValueOnce({}),
      };

      setupForSubmit({ actions });

      fireEvent.click(button);

      // Se ha debido de llamar una vez
      expect(actions.postSignup).toHaveBeenCalledTimes(1);
    });

    it('does not throw exception when clicking the button when actions not provided in props', () => {
      // Vamos a cambiar nuestros campos input y vamos a hacer click en el botón
      setupForSubmit();

      // Pulsar el botón no arroja excepción
      expect(() => fireEvent.click(button)).not.toThrow();
    });

    // Cuando se hace click en el botón, debemos recibir el cuerpo del request basado en lo que ha escrito
    // el usuario, para poder enviarlo al backend
    it('calls post with user body when the fields are valid', () => {
      const actions = {
        postSignup: jest.fn().mockResolvedValueOnce({}),
      };

      setupForSubmit({ actions });

      fireEvent.click(button);

      const expectedUserObject = {
        username: 'my-username',
        displayName: 'my-display-name',
        password: 'P4ssword',
      };

      expect(actions.postSignup).toHaveBeenCalledWith(expectedUserObject);
    });
  });
});
