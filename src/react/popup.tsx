import React, { useEffect } from "react";
import ReactDOM from "react-dom";


class Popup extends React.Component {
  render() {
    return <div>Hello, world!</div>
  }
}

ReactDOM.render(<Popup/>, document.getElementById("popupContainer"))