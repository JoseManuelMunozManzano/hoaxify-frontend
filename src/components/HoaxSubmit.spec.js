import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import HoaxSubmit from './HoaxSubmit';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import authReducer from '../redux/authReducer';
import * as apiCalls from '../api/apiCalls';

const defaultState = {
  id: 1,
  username: 'user1',
  displayName: 'display1',
  image: 'profile1.png',
  password: 'P4ssword',
  isLoggedIn: true,
};

let store;

const setup = (state = defaultState) => {
  store = createStore(authReducer, state);

  return render(
    <Provider store={store}>
      <HoaxSubmit />
    </Provider>
  );
};

describe('HoaxSubmit', () => {
  describe('Layout', () => {
    it('has textarea', () => {
      const { container } = setup();
      const textArea = container.querySelector('textarea');
      expect(textArea).toBeInTheDocument();
    });

    it('has image', () => {
      const { container } = setup();
      const image = container.querySelector('img');
      expect(image).toBeInTheDocument();
    });

    it('displays textarea 1 line', () => {
      const { container } = setup();
      const textArea = container.querySelector('textarea');
      expect(textArea.rows).toBe(1);
    });

    it('displays user image', () => {
      const { container } = setup();
      const image = container.querySelector('img');
      expect(image.src).toContain('/images/profile/' + defaultState.image);
    });
  });

  describe('Interactions', () => {
    it('displays 3 rows when focused to textarea', () => {
      const { container } = setup();
      const textArea = container.querySelector('textarea');
      fireEvent.focus(textArea);
      expect(textArea.rows).toBe(3);
    });

    it('displays hoaxify button when focused to textarea', () => {
      const { container } = setup();
      const textArea = container.querySelector('textarea');
      fireEvent.focus(textArea);
      const hoaxifyButton = screen.queryByText('Hoaxify');
      expect(hoaxifyButton).toBeInTheDocument();
    });

    it('displays Cancel button when focused to textarea', () => {
      const { container } = setup();
      const textArea = container.querySelector('textarea');
      fireEvent.focus(textArea);
      const cancelButton = screen.queryByText('Cancel');
      expect(cancelButton).toBeInTheDocument();
    });

    it('does not display Hoaxify button when not focused to textarea', () => {
      setup();
      const hoaxifyButton = screen.queryByText('Hoaxify');
      expect(hoaxifyButton).not.toBeInTheDocument();
    });

    it('does not display Cancel button when not focused to textarea', () => {
      setup();
      const cancelButton = screen.queryByText('Cancel');
      expect(cancelButton).not.toBeInTheDocument();
    });

    it('returns back to unfocused state after clicking the cancel', () => {
      const { container } = setup();
      const textArea = container.querySelector('textarea');
      fireEvent.focus(textArea);
      const cancelButton = screen.queryByText('Cancel');
      fireEvent.click(cancelButton);
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    });

    it('calls postHoax with hoax request object when clicking Hoaxify', () => {
      const { container } = setup();
      const textArea = container.querySelector('textarea');
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: 'Test hoax content' } });

      const hoaxifyButton = screen.queryByText('Hoaxify');

      apiCalls.postHoax = jest.fn().mockResolvedValue({});
      fireEvent.click(hoaxifyButton);

      expect(apiCalls.postHoax).toHaveBeenCalledWith({
        content: 'Test hoax content',
      });
    });

    it('returns back to unfocused state after successful postHoax action', async () => {
      const { container } = setup();
      const textArea = container.querySelector('textarea');
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: 'Test hoax content' } });

      const hoaxifyButton = screen.queryByText('Hoaxify');

      apiCalls.postHoax = jest.fn().mockResolvedValue({});
      fireEvent.click(hoaxifyButton);

      await waitFor(() => {
        expect(screen.queryByText('Hoaxify')).not.toBeInTheDocument();
      });
    });

    it('clear content after successful postHoax action', async () => {
      const { container } = setup();
      const textArea = container.querySelector('textarea');
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: 'Test hoax content' } });

      const hoaxifyButton = screen.queryByText('Hoaxify');

      apiCalls.postHoax = jest.fn().mockResolvedValue({});
      fireEvent.click(hoaxifyButton);

      await waitFor(() => {
        expect(screen.queryByText('Test hoax content')).not.toBeInTheDocument();
      });
    });

    it('clear content after clicking cancel', () => {
      const { container } = setup();
      const textArea = container.querySelector('textarea');
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: 'Test hoax content' } });

      fireEvent.click(screen.queryByText('Cancel'));

      expect(screen.queryByText('Test hoax content')).not.toBeInTheDocument();
    });

    it('disables Hoaxify button when there is postHoax api call', async () => {
      const { container } = setup();
      const textArea = container.querySelector('textarea');
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: 'Test hoax content' } });

      const hoaxifyButton = screen.queryByText('Hoaxify');

      // En vez de mockResolvedValue vamos a definir una implementación con un comportamiento
      // que retrasa la respuesta
      const mockFunction = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });

      apiCalls.postHoax = mockFunction;
      fireEvent.click(hoaxifyButton);

      // Pulsmos el botón Hoaxify de nuevo
      fireEvent.click(hoaxifyButton);

      expect(mockFunction).toHaveBeenCalledTimes(1);
    });

    it('disables Cancel button when there is postHoax api call', async () => {
      const { container } = setup();
      const textArea = container.querySelector('textarea');
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: 'Test hoax content' } });

      const hoaxifyButton = screen.queryByText('Hoaxify');

      const mockFunction = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });

      apiCalls.postHoax = mockFunction;
      fireEvent.click(hoaxifyButton);

      const cancelButton = screen.queryByText('Cancel');
      expect(cancelButton).toBeDisabled();
    });

    it('displays spinner when there is postHoax api call', async () => {
      const { container } = setup();
      const textArea = container.querySelector('textarea');
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: 'Test hoax content' } });

      const hoaxifyButton = screen.queryByText('Hoaxify');

      const mockFunction = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });

      apiCalls.postHoax = mockFunction;
      fireEvent.click(hoaxifyButton);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });
});
