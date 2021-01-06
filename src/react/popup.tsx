import React from "react";
import ReactDOM from "react-dom";
import chromep from "chrome-promise"

interface PropsI {

}

interface StateI {
  test: string;
}

class Popup extends React.Component<PropsI, StateI> {
  constructor(props: PropsI) {
    super(props)

    this.state = {
      test: ""
    }
  }

  async componentDidMount() {
    const storage = await chromep.storage.sync.get();
    this.setState({ test: storage.test })
  }

  render() {

    setTimeout(() => {
      chromep.storage.sync.set({test: "jess"});
      this.setState({ test: "jess" })
    }, 500);

    return (
      <>
        <div>{this.state.test}</div>
      </>
    )
  }
}

ReactDOM.render(<Popup/>, document.getElementById("root"))