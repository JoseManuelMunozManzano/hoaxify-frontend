import React from 'react';
import { render, screen } from '@testing-library/react';
import HoaxView from './HoaxView';

const setup = () => {
  // milisegundos
  const oneMinute = 60 * 1000;
  const date = new Date(new Date() - oneMinute);

  const hoax = {
    id: 10,
    content: 'This is the first hoax',
    date,
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
      expect(screen.getByText('This is the first hoax')).toBeInTheDocument();
    });

    it('displays users image', () => {
      const { container } = setup();
      const image = container.querySelector('img');
      expect(image.src).toContain('/images/profile/profile1.png');
    });

    it('displays displayName@user', () => {
      setup();
      expect(screen.getByText('display1@user1')).toBeInTheDocument();
    });

    it('displays relative time', () => {
      setup();
      expect(screen.getByText('1 minute ago')).toBeInTheDocument();
    });
  });
});
