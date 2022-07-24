import React from 'react';
import { render } from '@testing-library/react';
import HoaxFeed from './HoaxFeed';
import * as apiCalls from '../api/apiCalls';

describe('HoaxFeed', () => {
  describe('Lifecycle', () => {
    it('calls loadHoaxes when it is rendered', () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue({});
      render(<HoaxFeed />);
      expect(apiCalls.loadHoaxes).toHaveBeenCalled();
    });
  });
});
