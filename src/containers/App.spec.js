import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App', () => {
  it('displays homepage when url is /', () => {
    // Para renderizar App necesitamos establecer los paths. Necesitamos MemoryRouter.
    // Hay que configurar la propiedad initialEntries, que toma un array con el historial de paths.
    const { queryByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(queryByTestId('homepage')).toBeInTheDocument();
  });
});
