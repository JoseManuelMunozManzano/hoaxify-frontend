import axios from 'axios';
import * as apiCalls from './apiCalls';

describe('apiCalls', () => {
  describe('signup', () => {
    // Como siempre, primero hacemos el test
    // Falla porque no existe signup() en apiCalls
    it('calls /api/1.0/users', () => {
      const mockSignup = jest.fn();
      axios.post = mockSignup;
      apiCalls.signup();

      // calls contiene el historial de llamadas.
      // Esto es porque esta función puede llamarse muchas veces, así que obtenemos que call queremos.
      // En este caso la primera vez.
      // Y cuando acedemos a ese call, podemos obtener el array de parámetros y queremos buscar el primer parámetro.
      // Ese calls[0][0] es nuestro path
      const path = mockSignup.mock.calls[0][0];
      expect(path).toBe('/api/1.0/users');
    });
  });

  describe('login', () => {
    it('calls /api/1.0/login', () => {
      const mockLogin = jest.fn();
      axios.post = mockLogin;
      apiCalls.login({ username: 'test-user', password: 'P4ssword' });
      const path = mockLogin.mock.calls[0][0];
      expect(path).toBe('/api/1.0/login');
    });
  });
});
