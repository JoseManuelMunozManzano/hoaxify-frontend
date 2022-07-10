import React from 'react';
import * as apiCalls from '../api/apiCalls';

class UserPage extends React.Component {
  componentDidMount() {
    apiCalls.getUser();
  }

  render() {
    return <div data-testid="userpage">Userpage</div>;
  }
}

export default UserPage;
