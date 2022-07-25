import React, { Component } from 'react';
import * as apiCalls from '../api/apiCalls';
import HoaxView from './HoaxView';
import Spinner from './Spinner';

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

  onClickLoadMore = () => {
    const hoaxes = this.state.page.content;
    if (hoaxes.length === 0) {
      return;
    }

    const hoaxAtBottom = hoaxes[hoaxes.length - 1];
    apiCalls.loadOldHoaxes(hoaxAtBottom.id);
  };

  render() {
    if (this.state.isLoadingHoaxes) {
      return <Spinner />;
    }
    if (this.state.page.content.length === 0) {
      return <div className="card card-header text-center">There are no hoaxes</div>;
    }

    return (
      <div>
        {this.state.page.content.map((hoax) => {
          return <HoaxView key={hoax.id} hoax={hoax} />;
        })}
        {this.state.page.last === false && (
          <div className="card card-header text-center" style={{ cursor: 'pointer' }} onClick={this.onClickLoadMore}>
            Load More
          </div>
        )}
      </div>
    );
  }
}

export default HoaxFeed;
