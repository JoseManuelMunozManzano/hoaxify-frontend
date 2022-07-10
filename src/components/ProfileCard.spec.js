import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfileCard from './ProfileCard';

describe('ProfileCard', () => {
  describe('Layout', () => {
    it('displays the displayName@username', () => {
      const user = {
        id: 1,
        username: 'user1',
        displayName: 'display1',
        image: 'profile1.png',
      };

      const { queryByText } = render(<ProfileCard user={user} />);
      const userInfo = screen.queryByText('display1@user1');
      expect(userInfo).toBeInTheDocument();
    });
  });
});
