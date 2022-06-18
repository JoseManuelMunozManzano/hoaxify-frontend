import React from 'react';
import { render, screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
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

    // NOTA: Se puede indicar que un test no se realice poniendo xit en vez de it
    //       También nos podemos focalizar en un test indicando fit
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

      const spinner = queryByText('Loading...');
      await waitForElementToBeRemoved(spinner);

      expect(spinner).not.toBeInTheDocument();
    });

    it('hides spinner after api call finishes with error', async () => {
      // Vamos a hacer un mock con resultado de error
      // Para probar esto paramos el back-end y pulsamos el botón Sign Up en el browser
      // Vemos que el spinner sigue apareciendo aunque la llamada a la API acaba en error.
      const actions = {
        postSignup: jest.fn().mockImplementation(() => {
          return new Promise((resolve, reject) => {
            // Establecemos un tiempo de espera tras el cual la promise se rechaza
            setTimeout(() => {
              reject({
                response: { data: {} },
              });
            }, 300);
          });
        }),
      };
      const { queryByText } = setupForSubmit({ actions });
      fireEvent.click(button);

      const spinner = queryByText('Loading...');
      await waitForElementToBeRemoved(spinner);

      expect(spinner).not.toBeInTheDocument();
    });
  });
});

// Por qué añadimos esto:
// Hay un error con los tests. Realmente no afecta a su resultado, pero sale en la consola.
// Indica que no se puede realizar una actualización del state de React sobre un componente que esta desmontado y
//  cuando el test ha terminado.
// Este problema aparece en test en los que montamos y desmontamos componentes en un lapso de tiempo muy corto.
// Si vamos a UserSignupPage, vemos que estamos actualizando el state tras acabar la llamada a la API:
//
//   onClickSignup = () => {
//   const user = {
//     username: this.state.username,
//     displayName: this.state.displayName,
//     password: this.state.password,
//   };
//   this.setState({ pendingApiCall: true });
//   this.props.actions.postSignup(user).then((response) => {
//       AQUI ESTA EL PROBLEMA
//     this.setState({ pendingApiCall: false });
//   });
// };
//
// Esto hace que se dispare la rederización del componente
//
// En concreto este error aparece en:
// it('does not allow user to click the Sign Up button when there is an ongoing api call', () => {}
// it('displays spinner when there is an ongoing api call', () => {}
// it('hides spinner after api call finishes successfully', async () => {}
//
// En este último test, estamos esperando que se actualice el DOM antes de acabar el test, así que no hay problema.
// Pero para los demás test, estamos terminando los tests antes que termine la llamada a la API, lo que
// significa que estamos desmontando el componente tan pronto como el test termina.
// Pero por debajo la llamada a la API sigue en progreso para esos tests, y la API los resuelve tras el delay,
// lo que dispara la función implementada en el response (donde se indica que esta el problema)
// Como el componente esta desmontado, intentar actualizar el state de dicho componente lanza el error que
// se puede ver si se comenta la línea de aquí abajo.
//
// Esto no pasa en el browser porque el componente nunca se desmonta. Siempre se visualiza la página SignUp por
// ahora. Pero podría verse.
//
// Soluciones y Atajos.
// Atajo: poner esos dos últimos test como xit para que no se ejecuten
// Solución:
//    1. Usar un anti-pattern: chequear si el componente esta montado antes de llamar al state.
//    2. Mejor solución: Cancelar la llamada a la API si es posible antes de que el componente se desmonte.
//
// Como en las próximas secciones se va a introducir Redux, este manejará las llamadas axios.
// Se van a añadir capas extra entre el componente y la llamada a la API.
// Por tanto, la mejor solución (cancelar la llamada a la API) va a ser muy complicado.
//
// Por tanto se deja así y se incluye esta línea para no ver el error en consola.
console.error = () => {};
