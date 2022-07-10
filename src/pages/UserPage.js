import React from 'react';
import * as apiCalls from '../api/apiCalls';
import ProfileCard from '../components/ProfileCard';

class UserPage extends React.Component {
  state = {
    user: undefined,
    userNotFound: false,
    isLoadingUser: false,
  };

  componentDidMount() {
    this.loadUser();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.username !== this.props.match.params.username) {
      this.loadUser();
    }
  }

  loadUser = () => {
    const username = this.props.match.params.username;
    if (!username) {
      return;
    }
    this.setState({ userNotFound: false, isLoadingUser: true });
    apiCalls
      .getUser(username)
      .then((response) => {
        this.setState({ user: response.data, isLoadingUser: false });
      })
      .catch((error) => {
        // Por ahora no nos importa el motivo del fallo
        this.setState({
          userNotFound: true,
        });
      });
  };

  render() {
    if (this.state.isLoadingUser) {
      return (
        <div className="d-flex">
          <div className="spinner-border text-black-50 m-auto">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }

    if (this.state.userNotFound) {
      return (
        <div className="alert alert-danger text-center" role="alert">
          <div className="alert-heading">
            <i class="fas fa-exclamation-triangle fa-3x"></i>
          </div>
          <h5>User not found</h5>
        </div>
      );
    }

    return <div data-testid="userpage">{this.state.user && <ProfileCard user={this.state.user} />}</div>;
  }
}

UserPage.defaultProps = {
  match: {
    params: {},
  },
};

export default UserPage;
