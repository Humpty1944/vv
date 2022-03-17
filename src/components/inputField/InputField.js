import React from "react";

class InputField extends React.Component {
  render() {
    console.log(this.props.className);
    return (
      <div className="inputField">
        <input
          className={this.props.className}
          type={this.props.type}
          placeholder={this.props.placeholder}
          onChange={(e) => this.props.onChange(e.target.value)}
        />
      </div>
    );
  }
}

export default InputField;
