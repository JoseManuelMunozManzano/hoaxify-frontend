import React from 'react';
import { render, screen } from '@testing-library/react';
import HoaxView from './HoaxView';

const setup = () => {
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
  return render(<HoaxView hoax={hoax} />);
};

describe('HoaxView', () => {
  describe('Layout', () => {
    it('displays hoax content', () => {
      setup();
      expect(screen.queryByText('This is the first hoax')).toBeInTheDocument();
    });

    it('displays users image', () => {
      const { container } = setup();
      const image = container.querySelector('img');
      expect(image.src).toContain('/images/profile/profile1.png');
    });
  });
});
