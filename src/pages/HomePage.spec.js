import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';

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
