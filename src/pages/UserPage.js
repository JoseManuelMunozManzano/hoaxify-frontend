import React from 'react';
import * as apiCalls from '../api/apiCalls';

class UserPage extends React.Component {
  componentDidMount() {
    const username = this.props.match.params.username;
    if (!username) {
      return;
    }
    apiCalls.getUser(username);
  }

  render() {
    return <div data-testid="userpage">Userpage</div>;
  }
}

UserPage.defaultProps = {
  match: {
    params: {},
  },
};

export default UserPage;
