import React from 'react';
import { render } from '@testing-library/react';
import UserListItem from './UserListItem';

const user = {
  username: 'user1',
  displayName: 'display1',
  image: 'profile1.png',
};

describe('UserListItem', () => {
  it('has image', () => {
    const { container } = render(<UserListItem user={user} />);
    const image = container.querySelector('img');
    expect(image).toBeInTheDocument();
  });
});
