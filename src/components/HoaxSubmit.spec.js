import React from 'react';
import { render } from '@testing-library/react';
import HoaxSubmit from './HoaxSubmit';

describe('HoaxSubmit', () => {
  describe('Layout', () => {
    it('has textarea', () => {
      const { container } = render(<HoaxSubmit />);
      const textArea = container.querySelector('textarea');
      expect(textArea).toBeInTheDocument();
    });
  });
});
