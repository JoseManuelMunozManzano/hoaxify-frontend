import React from 'react';
import HoaxSubmit from '../components/HoaxSubmit';
import UserList from '../components/UserList';

class HomePage extends React.Component {
  render() {
    return (
      <div data-testid="homepage">
        <div className="row">
          <div className="col-8">
            <HoaxSubmit />
          </div>

          <div className="col-4">
            <UserList />
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
