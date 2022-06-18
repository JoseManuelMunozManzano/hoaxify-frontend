import axios from 'axios';

describe('apiCalls', () => {
  describe('signup', () => {
    // Como siempre, primero hacemos el test
    // Falla porque no existe signup() en apiCalls
    it('calls /api/1.0/users', () => {
      const mockSignup = jest.fn();

      axios.post = mockSignup;
      apiCalls.signup();
    });
  });
});
