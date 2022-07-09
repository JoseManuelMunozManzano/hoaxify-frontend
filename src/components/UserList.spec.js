import React from 'react';
import { render } from '@testing-library/react';
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

describe('UserList', () => {
  describe('Layout', () => {
    it('has header of Users', () => {
      const { container } = setup();
      const header = container.querySelector('h3');
      expect(header).toHaveTextContent('Users');
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
