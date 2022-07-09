import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import UserList from './UserList';
import * as apiCalls from '../api/apiCalls';

const setup = () => {
  return render(<UserList />);
};

const mockedEmptySuccessResponse = {
  data: {
    content: [],
    number: 0, // page number
    size: 3, // page size
  },
};

const mockSuccessGetSinglePage = {
  data: {
    content: [
      {
        username: 'user1',
        displayName: 'display1',
        image: '',
      },
      {
        username: 'user2',
        displayName: 'display2',
        image: '',
      },
      {
        username: 'user3',
        displayName: 'display3',
        image: '',
      },
    ],
    number: 0,
    first: true, // es la primera página
    last: true, // es la última página
    size: 3,
    totalPages: 1,
  },
};

describe('UserList', () => {
  describe('Layout', () => {
    it('has header of Users', () => {
      const { container } = setup();
      const header = container.querySelector('h3');
      expect(header).toHaveTextContent('Users');
    });

    it('displays three items when listUser api returns three users', async () => {
      apiCalls.listUsers = jest.fn().mockResolvedValue(mockSuccessGetSinglePage);
      const { queryByTestId } = setup();
      await waitFor(() => {
        const userGroup = queryByTestId('usergroup');
        expect(userGroup.childElementCount).toBe(3);
      });
    });

    it('displays the displayName@username when listUser api returns users', async () => {
      apiCalls.listUsers = jest.fn().mockResolvedValue(mockSuccessGetSinglePage);
      const { findByText } = setup();
      const firstUser = await findByText('display1@user1');
      expect(firstUser).toBeInTheDocument();
    });
  });

  describe('Lifecycle', () => {
    it('calls listUsers api when it is rendered', () => {
      apiCalls.listUsers = jest.fn().mockResolvedValue(mockedEmptySuccessResponse);
      setup();
      expect(apiCalls.listUsers).toHaveBeenCalledTimes(1);
    });

    it('calls listUsers method with page zero and size three', () => {
      apiCalls.listUsers = jest.fn().mockResolvedValue(mockedEmptySuccessResponse);
      setup();
      expect(apiCalls.listUsers).toHaveBeenCalledWith({ page: 0, size: 3 });
    });
  });
});
