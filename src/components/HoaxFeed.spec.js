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

const mockSuccessGetNewHoaxesList = {
  data: [
    {
      id: 21,
      content: 'This is the newest hoax',
      date: 1561294668539,
      user: {
        id: 1,
        username: 'user1',
        displayName: 'display1',
        image: 'profile1.png',
      },
    },
  ],
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

    it('calls loadNewHoaxCount with topHoax id', async () => {
      jest.useFakeTimers();
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest.fn().mockResolvedValue({ data: { count: 1 } });
      setup();

      await screen.findByText('This is the latest hoax');
      jest.runOnlyPendingTimers();
      await screen.findByText('There is 1 new hoax');
      const firstParam = apiCalls.loadNewHoaxCount.mock.calls[0][0];
      expect(firstParam).toBe(10);
      jest.useRealTimers();
    });

    it('calls loadNewHoaxCount with topHoax id and username when rendered with user property', async () => {
      jest.useFakeTimers();
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest.fn().mockResolvedValue({ data: { count: 1 } });
      setup({ user: 'user1' });

      await screen.findByText('This is the latest hoax');
      jest.runOnlyPendingTimers();
      await screen.findByText('There is 1 new hoax');
      expect(apiCalls.loadNewHoaxCount).toHaveBeenCalledWith(10, 'user1');
      jest.useRealTimers();
    });

    it('displays new hoax count as 1 after loadNewHoaxCount success', async () => {
      jest.useFakeTimers();
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest.fn().mockResolvedValue({ data: { count: 1 } });
      setup({ user: 'user1' });

      await screen.findByText('This is the latest hoax');
      jest.runOnlyPendingTimers();
      const newHoaxCount = await screen.findByText('There is 1 new hoax');
      expect(newHoaxCount).toBeInTheDocument();
      jest.useRealTimers();
    });

    it('displays new hoax count constantly', async () => {
      jest.useFakeTimers();
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest.fn().mockResolvedValue({ data: { count: 1 } });
      setup({ user: 'user1' });

      await screen.findByText('This is the latest hoax');
      jest.runOnlyPendingTimers();
      await screen.findByText('There is 1 new hoax');
      apiCalls.loadNewHoaxCount = jest.fn().mockResolvedValue({ data: { count: 2 } });
      jest.runOnlyPendingTimers();
      const newHoaxCount = await screen.findByText('There are 2 new hoaxes');
      expect(newHoaxCount).toBeInTheDocument();
      jest.useRealTimers();
    });

    it('does not call loadNewHoaxCount after component is unmounted', async () => {
      jest.useFakeTimers();
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest.fn().mockResolvedValue({ data: { count: 1 } });
      const { unmount } = setup({ user: 'user1' });

      await screen.findByText('This is the latest hoax');
      jest.runOnlyPendingTimers();
      await screen.findByText('There is 1 new hoax');
      unmount();
      expect(apiCalls.loadNewHoaxCount).toHaveBeenCalledTimes(1);
      jest.useRealTimers();
    });

    it('displays new hoax count as 1 after loadNewHoaxCount success when user does not have hoaxes initially', async () => {
      jest.useFakeTimers();
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockEmptyResponse);
      apiCalls.loadNewHoaxCount = jest.fn().mockResolvedValue({ data: { count: 1 } });
      setup({ user: 'user1' });

      await screen.findByText('There are no hoaxes');
      jest.runOnlyPendingTimers();
      const newHoaxCount = await screen.findByText('There is 1 new hoax');
      expect(newHoaxCount).toBeInTheDocument();
      jest.useRealTimers();
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
      const firstParam = apiCalls.loadOldHoaxes.mock.calls[0][0];
      expect(firstParam).toBe(9);
    });

    it('calls loadOldHoaxes with hoax id and username when clicking Load More when rendered with user property', async () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadOldHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesLastOfMultiPage);
      setup({ user: 'user1' });

      const loadMore = await screen.findByText('Load More');
      fireEvent.click(loadMore);
      expect(apiCalls.loadOldHoaxes).toHaveBeenCalledWith(9, 'user1');
    });

    it('displays loaded old hoax when loadOldHoaxes api call success', async () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadOldHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesLastOfMultiPage);
      setup();

      const loadMore = await screen.findByText('Load More');
      fireEvent.click(loadMore);
      const oldHoax = await screen.findByText('This is the oldest hoax');
      expect(oldHoax).toBeInTheDocument();
    });

    it('hides Load More when loadOldHoaxes api call returns last page', async () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadOldHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesLastOfMultiPage);
      setup();

      const loadMore = await screen.findByText('Load More');
      fireEvent.click(loadMore);
      await screen.findByText('This is the oldest hoax');
      expect(screen.queryByText('Load More')).not.toBeInTheDocument();
    });

    // load new hoaxes
    it('calls loadNewHoaxes with hoax id when clicking New Hoax Count Card', async () => {
      jest.useFakeTimers();
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest.fn().mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewHoaxes = jest.fn().mockResolvedValue(mockSuccessGetNewHoaxesList);
      setup();

      await screen.findByText('This is the latest hoax');
      jest.runOnlyPendingTimers();
      const newHoaxCount = await screen.findByText('There is 1 new hoax');
      jest.runOnlyPendingTimers();
      fireEvent.click(newHoaxCount);
      const firstParam = apiCalls.loadNewHoaxes.mock.calls[0][0];
      expect(firstParam).toBe(10);
      jest.useRealTimers();
    });

    // it('calls loadOldHoaxes with hoax id and username when clicking Load More when rendered with user property', async () => {
    //   apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
    //   apiCalls.loadOldHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesLastOfMultiPage);
    //   setup({ user: 'user1' });

    //   const loadMore = await screen.findByText('Load More');
    //   fireEvent.click(loadMore);
    //   expect(apiCalls.loadOldHoaxes).toHaveBeenCalledWith(9, 'user1');
    // });

    // it('displays loaded old hoax when loadOldHoaxes api call success', async () => {
    //   apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
    //   apiCalls.loadOldHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesLastOfMultiPage);
    //   setup();

    //   const loadMore = await screen.findByText('Load More');
    //   fireEvent.click(loadMore);
    //   const oldHoax = await screen.findByText('This is the oldest hoax');
    //   expect(oldHoax).toBeInTheDocument();
    // });

    // it('hides Load More when loadOldHoaxes api call returns last page', async () => {
    //   apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
    //   apiCalls.loadOldHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesLastOfMultiPage);
    //   setup();

    //   const loadMore = await screen.findByText('Load More');
    //   fireEvent.click(loadMore);
    //   await screen.findByText('This is the oldest hoax');
    //   expect(screen.queryByText('Load More')).not.toBeInTheDocument();
    // });
  });
});

console.error = () => {};
