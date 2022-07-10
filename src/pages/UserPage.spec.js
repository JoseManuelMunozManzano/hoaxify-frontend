import { render, screen } from '@testing-library/react';
import UserPage from './UserPage';
import * as apiCalls from '../api/apiCalls';

const mockSuccessGetUser = {
  data: {
    id: 1,
    username: 'user1',
    displayName: 'display1',
    image: 'profile1.png',
  },
};

// Con match estamos replicando lo que se ve en Chrome, en Developer Tools, pestaña Components, y buscar UserPage y click en el.
// En la parte derecha, en props, se ve este match con el parámetro params y username
const match = {
  params: {
    username: 'user1',
  },
};

describe('UserPage', () => {
  describe('Layout', () => {
    it('has root page div', () => {
      // Por ahora no sabemos como va a ser esta UserPage. Por tanto, necesitamos tener
      // algún tipo de datos de un usuario no visible para consultar.
      //
      // No es una buena práctica, pero para este caso, por ahora, es la única solución disponible.
      const { queryByTestId } = render(<UserPage />);
      const userPageDiv = screen.queryByTestId('userpage');
      expect(userPageDiv).toBeInTheDocument();
    });
  });

  describe('Lifecycle', () => {
    it('calls getUser when it is rendered', () => {
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
      render(<UserPage match={match} />);
      expect(apiCalls.getUser).toHaveBeenCalledTimes(1);
    });

    it('calls getUser for user1 when it is rendered with user1 in match', () => {
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
      render(<UserPage match={match} />);
      expect(apiCalls.getUser).toHaveBeenCalledWith('user1');
    });
  });
});
