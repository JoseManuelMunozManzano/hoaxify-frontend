import React from 'react';
import { findByText, getByText, render, screen, waitFor } from '@testing-library/react';
import HoaxFeed from './HoaxFeed';
import * as apiCalls from '../api/apiCalls';

const setup = (props) => {
  return render(<HoaxFeed {...props} />);
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
    it('displays hoax content', async () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesSinglePage);
      setup();

      const hoaxContent = await screen.findByText('This is the latest hoax');
      expect(hoaxContent).toBeInTheDocument();
    });
  });
});
