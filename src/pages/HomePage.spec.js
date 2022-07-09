import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';
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

describe('HomePage', () => {
  describe('Layout', () => {
    it('has root page div', () => {
      // Por ahora no sabemos como va a ser esta HomePage. Por tanto, necesitamos tener
      // algún tipo de datos de un usuario no visible para consultar.
      //
      // No es una buena práctica, pero para este caso, por ahora, es la única solución disponible.
      const { queryByTestId } = render(<HomePage />);
      const homePageDiv = screen.queryByTestId('homepage');
      expect(homePageDiv).toBeInTheDocument();
    });
  });
});
