import React from 'react';
import { render, screen, fireEvent, queryByPlaceholderText, waitForDomChange } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { UserSignUpPage } from './UserSignupPage';

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

    const mockAsyncDelayed = () => {
      return jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          // Establecemos un tiempo de espera tras el cual la promise se resuelve
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });
    };

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
      const actions = {
        postSignup: jest.fn().mockResolvedValueOnce({}),
      };

      setupForSubmit({ actions });

      fireEvent.click(button);

      expect(actions.postSignup).toHaveBeenCalledTimes(1);
    });

    it('does not throw exception when clicking the button when actions not provided in props', () => {
      setupForSubmit();

      expect(() => fireEvent.click(button)).not.toThrow();
    });

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

    // Se va a impedir que el usuario pueda pulsar múltiples veces el botón Sign Up mientras se procesa
    // la petición.
    // También se va a indicar al usuario como va el progreso de la petición realizada.
    it('does not allow user to click the Sign Up button when there is an ongoing api call', () => {
      // Utilizamos una implementación a medida
      // Devolvemos una promise porque nuestra action API de axios devuelve una promise.
      const actions = {
        postSignup: mockAsyncDelayed(),
      };
      setupForSubmit({ actions });
      fireEvent.click(button);

      // Pulsamos el botón SignUp por segunda vez
      fireEvent.click(button);

      // Por ahora se esta llamando 2 veces.
      // Para corregir esto, necesitamos conocer el progreso de nuestra petición
      expect(actions.postSignup).toHaveBeenCalledTimes(1);
    });

    it('displays spinner when there is an ongoing api call', () => {
      const actions = {
        postSignup: mockAsyncDelayed(),
      };
      const { queryByText } = setupForSubmit({ actions });
      fireEvent.click(button);

      // De nuestro texto buscamos Loading... para saber que esta el spinner.
      // Este texto viene del spinner de Bootstrap
      // https://getbootstrap.com/docs/4.3/components/spinners/
      const spinner = queryByText('Loading...');
      expect(spinner).toBeInTheDocument();
    });

    it('hides spinner after api call finishes successfully', async () => {
      // Tenemos que esperar a la respuesta.
      const actions = {
        postSignup: mockAsyncDelayed(),
      };
      const { queryByText } = setupForSubmit({ actions });
      fireEvent.click(button);

      // Ahora, tras pulsar el botón, esperamos a que nuestro componente
      // se actualice, lo que significará que nuestro spinner se habrá ocultado.
      await waitForDomChange();

      // Este test fallará por un timeout porque nada cambia en el DOM todavía.
      // Para resolver este problema se debe manejar el caso success en nuestra llamada a la API.
      const spinner = queryByText('Loading...');
      expect(spinner).not.toBeInTheDocument();
    });
  });
});
