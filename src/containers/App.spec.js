import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

const setup = (path) => {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
};

describe('App', () => {
  it('displays homepage when url is /', () => {
    const { getByTestId } = setup('/');
    expect(screen.getByTestId('homepage')).toBeInTheDocument();
  });

  it('displays LoginPage when url is /login', () => {
    const { container } = setup('/login');
    const header = container.querySelector('h1');
    expect(header).toHaveTextContent('Login');
  });

  // Para evitar path parciales. Por ejemplo, /login y /homepage parten ambos de /
  it('displays only LoginPage when url is /login', () => {
    const { queryByTestId } = setup('/login');
    expect(screen.queryByTestId('homepage')).not.toBeInTheDocument();
  });
});
