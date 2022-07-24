import React, { Component } from 'react';
import * as apiCalls from '../api/apiCalls';

class HoaxFeed extends Component {
  state = {
    page: {
      content: [],
    },
    isLoadingHoaxes: false,
  };

  componentDidMount() {
    this.setState({ isLoadingHoaxes: true });
    apiCalls.loadHoaxes(this.props.user).then((response) => {
      this.setState({ page: response.data, isLoadingHoaxes: false });
    });
  }

  render() {
    if (this.state.isLoadingHoaxes) {
      return (
        <div className="d-flex">
          <div className="spinner-border text-black-50 m-auto">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }
    if (this.state.page.content.length === 0) {
      return <div className="card card-header text-center">There are no hoaxes</div>;
    }

    return <div></div>;
  }
}

export default HoaxFeed;
