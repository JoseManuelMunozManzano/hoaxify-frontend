import React from 'react';
import { render, screen } from '@testing-library/react';
import TopBar from './TopBar';
import { MemoryRouter } from 'react-router-dom';

// Para evitar el error: You should not use <Link> outside a <Router>
const setup = () => {
  return render(
    <MemoryRouter>
      <TopBar />
    </MemoryRouter>
  );
};

// Generalmente la barra de navegación superior contiene el logo y links internos a nuestra app.
describe('TopBar', () => {
  describe('Layout', () => {
    it('has application logo', () => {
      const { container } = setup();
      const image = container.querySelector('img');
      expect(image.src).toContain('hoaxify-logo.png');
    });

    it('has link to home from logo', () => {
      const { container } = setup();
      const image = container.querySelector('img');
      expect(image.parentElement.getAttribute('href')).toBe('/');
    });

    it('has link to signup', () => {
      const { queryByText } = setup();
      const signupLink = screen.queryByText('Sign Up');
      expect(signupLink.getAttribute('href')).toBe('/signup');
    });

    it('has link to login', () => {
      const { queryByText } = setup();
      const loginLink = screen.queryByText('Login');
      expect(loginLink.getAttribute('href')).toBe('/login');
    });
  });
});
