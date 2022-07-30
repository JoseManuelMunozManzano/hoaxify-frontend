import React, { Component } from 'react';

class Modal extends Component {
  render() {
    let rootClass = 'modal fade';
    let rootStyle;

    if (this.props.visible) {
      rootClass += ' d-block show';
      rootStyle = { backgroundColor: '#000000b0' };
    }

    return (
      // Cogido de https://getbootstrap.com/docs/4.3/components/modal/ y transformado
      <div className={rootClass} style={rootStyle} data-testid="modal-root">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modal title</h5>
            </div>
            <div className="modal-body"></div>
            <div className="modal-footer">
              <button className="btn btn-secondary">Close</button>
              <button className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
