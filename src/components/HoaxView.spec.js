import React from 'react';
import { render, screen } from '@testing-library/react';
import HoaxView from './HoaxView';

describe('HoaxView', () => {
  describe('Layout', () => {
    it('displays hoax content', () => {
      const hoax = {
        id: 10,
        content: 'This is the first hoax',
        date: 1561294668539,
        user: {
          id: 1,
          username: 'user1',
          displayName: 'display1',
          image: 'profile1.png',
        },
      };
      render(<HoaxView hoax={hoax} />);
      expect(screen.queryByText('This is the first hoax')).toBeInTheDocument();
    });
  });
});
