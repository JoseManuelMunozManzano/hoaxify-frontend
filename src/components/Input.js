import React from 'react';

// No necesitamos mantener el estado en el compoennte. Functional component

const Input = (props) => {
  let inputClassName = 'form-control';
  if (props.hasError !== undefined) {
    inputClassName += props.hasError ? ' is-invalid' : ' is-valid';
  }

  return (
    <div>
      {props.label && <label>{props.label}</label>}
      <input
        className={inputClassName}
        type={props.type || 'text'}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
      />
      {props.hasError && <span className="invalid-feedback">{props.error}</span>}
    </div>
  );
};

// Estos valores por defecto se informan para que el test
// 'has value for input when it is provided as prop' no de warning
Input.defaultProps = {
  onChange: () => {},
};

export default Input;
