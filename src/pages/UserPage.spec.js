import { render, screen } from '@testing-library/react';
import UserPage from './UserPage';

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
});
