import React from 'react';
import { render } from '@testing-library/react';
import TopBar from './TopBar';

// Generalmente la barra de navegación superior contiene el logo y links internos a nuestra app.
describe('TopBar', () => {
  describe('Layout', () => {
    it('has application logo', () => {
      const { container } = render(<TopBar />);
      const image = container.querySelector('img');
      expect(image.src).toContain('hoaxify-logo.png');
    });

    it('has link to home from logo', () => {
      const { container } = render(<TopBar />);
      const image = container.querySelector('img');
      expect(image.parentElement.getAttribute('href')).toBe('/');
    });
  });
});
