import React from 'react';
import { render } from '@testing-library/react';
import ProfileImageWithDefault from './ProfileImageWithDefault';

describe('ProfileImageWithDefault', () => {
  describe('Layout', () => {
    it('has image', () => {
      const { container } = render(<ProfileImageWithDefault />);
      const image = container.querySelector('img');
      expect(image).toBeInTheDocument();
    });

    it('displays default image when image property not provided', () => {
      const { container } = render(<ProfileImageWithDefault />);
      const image = container.querySelector('img');
      expect(image.src).toContain('/profile.png');
    });
  });
});
