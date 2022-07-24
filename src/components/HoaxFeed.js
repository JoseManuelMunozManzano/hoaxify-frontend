import React, { Component } from 'react';
import * as apiCalls from '../api/apiCalls';

class HoaxFeed extends Component {
  state = {
    page: {
      content: [],
    },
  };

  componentDidMount() {
    apiCalls.loadHoaxes(this.props.user).then((response) => {
      this.setState({ page: response.data });
    });
  }

  render() {
    if (this.state.page.content.length === 0) {
      return <div className="card card-header text-center">There are no hoaxes</div>;
    }

    return <div></div>;
  }
}

export default HoaxFeed;
