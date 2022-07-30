import React from 'react';
import { render, screen } from '@testing-library/react';
import HoaxView from './HoaxView';
import { MemoryRouter } from 'react-router-dom';

const hoaxWithoutAttachment = {
  id: 10,
  content: 'This is the first hoax',
  user: {
    id: 1,
    username: 'user1',
    displayName: 'display1',
    image: 'profile1.png',
  },
};

const hoaxWithAttachment = {
  id: 10,
  content: 'This is the first hoax',
  user: {
    id: 1,
    username: 'user1',
    displayName: 'display1',
    image: 'profile1.png',
  },
  attachment: {
    fileType: 'image/png',
    name: 'attached-image.png',
  },
};

const setup = (hoax = hoaxWithoutAttachment) => {
  // milisegundos
  const oneMinute = 60 * 1000;
  const date = new Date(new Date() - oneMinute);
  hoax.date = date;

  return render(
    <MemoryRouter>
      <HoaxView hoax={hoax} />
    </MemoryRouter>
  );
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

    it('has link to user page', () => {
      const { container } = setup();
      const anchor = container.querySelector('a');
      expect(anchor.getAttribute('href')).toBe('/user1');
    });

    it('displays file attachment image', () => {
      const { container } = setup(hoaxWithAttachment);
      const images = container.querySelectorAll('img');
      expect(images.length).toBe(2);
    });
  });
});
