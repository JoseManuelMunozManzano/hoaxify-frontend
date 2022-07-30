import React, { Component } from 'react';

class Modal extends Component {
  render() {
    const { title, visible, body, okButton, cancelButton } = this.props;

    let rootClass = 'modal fade';
    let rootStyle;

    if (visible) {
      rootClass += ' d-block show';
      rootStyle = { backgroundColor: '#000000b0' };
    }

    return (
      <div className={rootClass} style={rootStyle} data-testid="modal-root">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
            </div>
            <div className="modal-body">{body}</div>
            <div className="modal-footer">
              <button className="btn btn-secondary">{cancelButton}</button>
              <button className="btn btn-primary">{okButton}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
