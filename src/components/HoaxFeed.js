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
    newHoaxCount: 0,
  };

  componentDidMount() {
    // Ahora tenemos un error porque cada vez que nuestro componente se monta, se crea un nuevo interval y nunca se destruye.
    // De esto nos damos cuenta mirando en Chrome, en las herramientas para desarrolladores, pestaña Network, que no para
    // de hacer llamadas al backend
    // Este error se ve al ir a la página de login
    this.setState({ isLoadingHoaxes: true });
    apiCalls.loadHoaxes(this.props.user).then((response) => {
      this.setState({ page: response.data, isLoadingHoaxes: false }, () => {
        this.counter = setInterval(this.checkCount, 3000);
      });
    });
  }

  // Se corrige limpiando el setInterval aquí
  componentWillUnmount() {
    clearInterval(this.counter);
  }

  checkCount = () => {
    const hoaxes = this.state.page.content;
    if (hoaxes.length === 0) {
      return;
    }

    const topHoax = hoaxes[0];
    apiCalls.loadNewHoaxCount(topHoax.id, this.props.user).then((response) => {
      this.setState({ newHoaxCount: response.data.count });
    });
  };

  onClickLoadMore = () => {
    const hoaxes = this.state.page.content;
    if (hoaxes.length === 0) {
      return;
    }

    const hoaxAtBottom = hoaxes[hoaxes.length - 1];
    apiCalls.loadOldHoaxes(hoaxAtBottom.id, this.props.user).then((response) => {
      const page = { ...this.state.page };
      page.content = [...page.content, ...response.data.content];
      page.last = response.data.last;
      this.setState({ page });
    });
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
        {this.state.newHoaxCount > 0 && (
          <div className="card card-header text-center">
            {this.state.newHoaxCount === 1 ? 'There is 1 new hoax' : `There are ${this.state.newHoaxCount} new hoaxes`}
          </div>
        )}
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
