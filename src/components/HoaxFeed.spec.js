import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import HoaxFeed from './HoaxFeed';
import * as apiCalls from '../api/apiCalls';
import { MemoryRouter } from 'react-router-dom';

const setup = (props) => {
  return render(
    <MemoryRouter>
      <HoaxFeed {...props} />
    </MemoryRouter>
  );
};

const mockEmptyResponse = {
  data: {
    content: [],
  },
};

// HoaxVM y Page
const mockSuccessGetHoaxesSinglePage = {
  data: {
    content: [
      {
        id: 10,
        content: 'This is the latest hoax',
        date: 1561294668539,
        user: {
          id: 1,
          username: 'user1',
          displayName: 'display1',
          image: 'profile1.png',
        },
      },
    ],
    number: 0,
    first: true,
    last: true,
    size: 5,
    totalPages: 1,
  },
};

const mockSuccessGetHoaxesFirstOfMultiPage = {
  data: {
    content: [
      {
        id: 10,
        content: 'This is the latest hoax',
        date: 1561294668539,
        user: {
          id: 1,
          username: 'user1',
          displayName: 'display1',
          image: 'profile1.png',
        },
      },
      {
        // Porque el contenido es ordenado en forma descendente basado en el id
        id: 9,
        content: 'This is hoax 9',
        date: 1561294668539,
        user: {
          id: 1,
          username: 'user1',
          displayName: 'display1',
          image: 'profile1.png',
        },
      },
    ],
    number: 0,
    first: true,
    last: false,
    size: 5,
    totalPages: 2,
  },
};

const mockSuccessGetHoaxesLastOfMultiPage = {
  data: {
    content: [
      {
        id: 1,
        content: 'This is the oldest hoax',
        date: 1561294668539,
        user: {
          id: 1,
          username: 'user1',
          displayName: 'display1',
          image: 'profile1.png',
        },
      },
    ],
    number: 0,
    first: true,
    last: true,
    size: 5,
    totalPages: 2,
  },
};

describe('HoaxFeed', () => {
  describe('Lifecycle', () => {
    it('calls loadHoaxes when it is rendered', () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockEmptyResponse);
      setup();
      expect(apiCalls.loadHoaxes).toHaveBeenCalled();
    });

    it('calls loadHoaxes with user parameter when it is rendered with user property', () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockEmptyResponse);
      setup({ user: 'user1' });
      expect(apiCalls.loadHoaxes).toHaveBeenCalledWith('user1');
    });

    it('calls loadHoaxes without user parameter when it is rendered without user property', () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockEmptyResponse);
      setup();
      const parameter = apiCalls.loadHoaxes.mock.calls[0][0];
      expect(parameter).toBeUndefined();
    });
  });

  describe('Layout', () => {
    it('displays no hoax message when the response has empty page', async () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockEmptyResponse);
      setup();
      const message = await screen.findByText('There are no hoaxes');
      expect(message).toBeInTheDocument();
    });

    it('does not display no hoax message when the response has page of hoax', async () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesSinglePage);
      setup();
      await waitFor(() => {
        expect(screen.queryByText('There are no hoaxes')).not.toBeInTheDocument();
      });
    });

    it('displays spinner when loading the hoaxes', () => {
      apiCalls.loadHoaxes = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetHoaxesSinglePage);
          }, 300);
        });
      });
      setup();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    // Para que muestre hoax, ir a Postman y ejecutar Create Hoax
    // También se pueden crear Hoax directamente desde la app
    it('displays hoax content', async () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesSinglePage);
      setup();

      const hoaxContent = await screen.findByText('This is the latest hoax');
      expect(hoaxContent).toBeInTheDocument();
    });

    it('displays Load More when there are next pages', async () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      setup();

      const loadMore = await screen.findByText('Load More');
      expect(loadMore).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls loadOldHoaxes with hoax id when clicking Load More', async () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadOldHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesLastOfMultiPage);
      setup();

      const loadMore = await screen.findByText('Load More');
      fireEvent.click(loadMore);
      expect(apiCalls.loadOldHoaxes).toHaveBeenCalledWith(9);
    });
  });
});
