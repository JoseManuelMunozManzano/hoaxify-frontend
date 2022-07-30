import React from 'react';
import { render, screen, waitFor, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import HoaxFeed from './HoaxFeed';
import * as apiCalls from '../api/apiCalls';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import authReducer from '../redux/authReducer';

const loggedInStateUser1 = {
  id: 1,
  username: 'user1',
  displayName: 'display1',
  image: 'profile1.png',
  password: 'P4ssword',
  isLoggedIn: true,
};

const setup = (props, state = loggedInStateUser1) => {
  const store = createStore(authReducer, state);

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <HoaxFeed {...props} />
      </MemoryRouter>
    </Provider>
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

const mockSuccessGetHoaxesMiddleOfMultiPage = {
  data: {
    content: [
      {
        id: 5,
        content: 'This hoax is in middle page',
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
    first: false,
    last: false,
    size: 5,
    totalPages: 2,
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

    it('calls loadNewHoaxes with hoax id and username when clicking New Hoax Count Card', async () => {
      jest.useFakeTimers();
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest.fn().mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewHoaxes = jest.fn().mockResolvedValue(mockSuccessGetNewHoaxesList);
      setup({ user: 'user1' });

      await screen.findByText('This is the latest hoax');
      jest.runOnlyPendingTimers();
      const newHoaxCount = await screen.findByText('There is 1 new hoax');
      jest.runOnlyPendingTimers();
      fireEvent.click(newHoaxCount);
      expect(apiCalls.loadNewHoaxes).toHaveBeenCalledWith(10, 'user1');
      jest.useRealTimers();
    });

    it('displays loaded new hoax when loadNewHoaxes api call success', async () => {
      jest.useFakeTimers();
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest.fn().mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewHoaxes = jest.fn().mockResolvedValue(mockSuccessGetNewHoaxesList);
      setup({ user: 'user1' });

      await screen.findByText('This is the latest hoax');
      jest.runOnlyPendingTimers();
      const newHoaxCount = await screen.findByText('There is 1 new hoax');
      jest.runOnlyPendingTimers();
      fireEvent.click(newHoaxCount);
      const newHoax = await screen.findByText('This is the newest hoax');
      jest.runOnlyPendingTimers();
      expect(newHoax).toBeInTheDocument();
      jest.useRealTimers();
    });

    it('hides new hoax when loadNewHoaxes api call success', async () => {
      jest.useFakeTimers();
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest.fn().mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewHoaxes = jest.fn().mockResolvedValue(mockSuccessGetNewHoaxesList);
      setup({ user: 'user1' });

      await screen.findByText('This is the latest hoax');
      jest.runOnlyPendingTimers();
      const newHoaxCount = await screen.findByText('There is 1 new hoax');
      jest.runOnlyPendingTimers();
      fireEvent.click(newHoaxCount);
      await screen.findByText('This is the newest hoax');
      expect(screen.queryByText('There is 1 new hoax')).not.toBeInTheDocument();
      jest.useRealTimers();
    });

    it('does not allow loadOldHoaxes to be called when there is an active api call about it', async () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadOldHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesLastOfMultiPage);
      setup();

      const loadMore = await screen.findByText('Load More');
      fireEvent.click(loadMore);
      fireEvent.click(loadMore);

      expect(apiCalls.loadOldHoaxes).toHaveBeenCalledTimes(1);
    });

    it('replace Load More with spinner when there is an active api call about loadOldHoaxes', async () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadOldHoaxes = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetHoaxesLastOfMultiPage);
          }, 300);
        });
      });
      setup();

      const loadMore = await screen.findByText('Load More');
      fireEvent.click(loadMore);
      const spinner = await screen.findByText('Loading...');

      expect(spinner).toBeInTheDocument();
      expect(screen.queryByText('Load More')).not.toBeInTheDocument();
    });

    it('replaces Spinner with Load More after active api call for loadOldHoaxes finishes with middle page response', async () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadOldHoaxes = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetHoaxesMiddleOfMultiPage);
          }, 300);
        });
      });
      setup();

      const loadMore = await screen.findByText('Load More');
      fireEvent.click(loadMore);
      await screen.findByText('This hoax is in middle page');

      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByText('Load More')).toBeInTheDocument();
    });

    // Por si nos quedamos sin conexión u otro tipo de error
    // Para esta prueba informar 15 hoaxes desde la app
    // Ir a Chrome, herramientas de desarrollador, pestaña Network y seleccionar del drop down offline.
    // Pulsar el botón Load More
    it('replaces Spinner with Load More after active api call for loadOldHoaxes finishes with error', async () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadOldHoaxes = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            reject({ response: { data: {} } });
          }, 300);
        });
      });
      setup();

      const loadMore = await screen.findByText('Load More');
      fireEvent.click(loadMore);
      const spinner = await screen.findByText('Loading...');
      await waitForElementToBeRemoved(spinner);

      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByText('Load More')).toBeInTheDocument();
    });

    // loadNewHoaxes
    it('does not allow loadNewHoaxes to be called when there is an active api call about it', async () => {
      jest.useFakeTimers();
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest.fn().mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewHoaxes = jest.fn().mockResolvedValue(mockSuccessGetNewHoaxesList);
      setup({ user: 'user1' });

      await screen.findByText('This is the latest hoax');
      jest.runOnlyPendingTimers();
      const newHoaxCount = await screen.findByText('There is 1 new hoax');
      jest.runOnlyPendingTimers();
      fireEvent.click(newHoaxCount);
      fireEvent.click(newHoaxCount);

      expect(apiCalls.loadNewHoaxes).toHaveBeenCalledTimes(1);
      jest.useRealTimers();
    });

    it('replaces There is 1 new hoax with spinner when there is an active api call about loadOldHoaxes', async () => {
      jest.useFakeTimers();
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest.fn().mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewHoaxes = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetNewHoaxesList);
          }, 300);
        });
      });
      setup();

      await screen.findByText('This is the latest hoax');
      jest.runOnlyPendingTimers();
      const newHoaxCount = await screen.findByText('There is 1 new hoax');
      jest.runOnlyPendingTimers();
      fireEvent.click(newHoaxCount);
      const spinner = await screen.findByText('Loading...');

      expect(spinner).toBeInTheDocument();
      expect(screen.queryByText('There is 1 new hoax')).not.toBeInTheDocument();
      jest.useRealTimers();
    });

    it('removes Spinner and There is 1 new hoax after active api call for loadNewHoaxes finishes with success', async () => {
      jest.useFakeTimers();
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest.fn().mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewHoaxes = jest.fn().mockResolvedValue(mockSuccessGetNewHoaxesList);
      setup({ user: 'user1' });

      await screen.findByText('This is the latest hoax');
      jest.runOnlyPendingTimers();
      const newHoaxCount = await screen.findByText('There is 1 new hoax');
      jest.runOnlyPendingTimers();
      fireEvent.click(newHoaxCount);
      await screen.findByText('This is the newest hoax');

      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.queryByText('There is 1 new hoax')).not.toBeInTheDocument();
      jest.useRealTimers();
    });

    it('replaces Spinner with There is 1 new hoax after active api call for loadNewHoaxes fails', async () => {
      jest.useFakeTimers();
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest.fn().mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewHoaxes = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            reject({ response: { data: {} } });
          }, 300);
        });
      });
      setup();

      await screen.findByText('This is the latest hoax');
      jest.runOnlyPendingTimers();
      const newHoaxCount = await screen.findByText('There is 1 new hoax');
      jest.runOnlyPendingTimers();
      fireEvent.click(newHoaxCount);
      const spinner = await screen.findByText('Loading...');
      await waitForElementToBeRemoved(spinner);

      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByText('There is 1 new hoax')).toBeInTheDocument();
      jest.useRealTimers();
    });

    it('displays modal when clicking delete on hoax', async () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest.fn().mockResolvedValue({ data: { count: 1 } });
      const { container } = setup();

      await screen.findByText('This is the latest hoax');

      // Aunque el modal no este visible, sigue estando en nuestro html y tiene botones
      const deleteButton = container.querySelectorAll('button')[0];
      fireEvent.click(deleteButton);

      const modalRootDiv = screen.queryByTestId('modal-root');
      expect(modalRootDiv).toHaveClass('modal fade d-block show');
    });

    it('hides modal when clicking cancel', async () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest.fn().mockResolvedValue({ data: { count: 1 } });
      const { container } = setup();

      await screen.findByText('This is the latest hoax');

      // Aunque el modal no este visible, sigue estando en nuestro html y tiene botones
      const deleteButton = container.querySelectorAll('button')[0];
      fireEvent.click(deleteButton);

      fireEvent.click(screen.getByText('Cancel'));

      const modalRootDiv = screen.queryByTestId('modal-root');
      expect(modalRootDiv).not.toHaveClass('d-block show');
    });

    it('displays modal with information about the action', async () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest.fn().mockResolvedValue({ data: { count: 1 } });
      const { container } = setup();

      await screen.findByText('This is the latest hoax');

      // Aunque el modal no este visible, sigue estando en nuestro html y tiene botones
      const deleteButton = container.querySelectorAll('button')[0];
      fireEvent.click(deleteButton);

      const message = screen.queryByText(`Are you sure to delete 'This is the latest hoax'?`);
      expect(message).toBeInTheDocument();
    });

    it('calls deleteHoax api with hoax id when delete button is clicked on modal', async () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest.fn().mockResolvedValue({ data: { count: 1 } });
      apiCalls.deleteHoax = jest.fn().mockResolvedValue({});
      const { container } = setup();

      await screen.findByText('This is the latest hoax');

      // Aunque el modal no este visible, sigue estando en nuestro html y tiene botones
      const deleteButton = container.querySelectorAll('button')[0];
      fireEvent.click(deleteButton);

      const deleteHoaxButton = screen.queryByText('Delete Hoax');
      fireEvent.click(deleteHoaxButton);
      expect(apiCalls.deleteHoax).toHaveBeenCalledWith(10);
    });

    it('hides modal after successful deleteHoax api call', async () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest.fn().mockResolvedValue({ data: { count: 1 } });
      apiCalls.deleteHoax = jest.fn().mockResolvedValue({});
      const { container } = setup();

      await screen.findByText('This is the latest hoax');

      // Aunque el modal no este visible, sigue estando en nuestro html y tiene botones
      const deleteButton = container.querySelectorAll('button')[0];
      fireEvent.click(deleteButton);

      const deleteHoaxButton = screen.queryByText('Delete Hoax');
      fireEvent.click(deleteHoaxButton);

      await waitFor(() => {
        const modalRootDiv = screen.queryByTestId('modal-root');
        expect(modalRootDiv).not.toHaveClass('d-block show');
      });
    });

    it('removes the deleted hoax from document after successful deleteHoax api call', async () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest.fn().mockResolvedValue({ data: { count: 1 } });
      apiCalls.deleteHoax = jest.fn().mockResolvedValue({});
      const { container } = setup();

      await screen.findByText('This is the latest hoax');

      // Aunque el modal no este visible, sigue estando en nuestro html y tiene botones
      const deleteButton = container.querySelectorAll('button')[0];
      fireEvent.click(deleteButton);

      const deleteHoaxButton = screen.queryByText('Delete Hoax');
      fireEvent.click(deleteHoaxButton);

      await waitFor(() => {
        const deletedHoaxContent = screen.queryByText('This is the latest hoax');
        expect(deletedHoaxContent).not.toBeInTheDocument();
      });
    });
  });
});

console.error = () => {};
