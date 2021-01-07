import React from "react";
import ReactDOM from "react-dom";
import chromep from "chrome-promise"
import { Order, orderFields } from "../scripts/urlChecker";
import { Paper, Typography } from "@material-ui/core";

interface PropsI {

}

interface StateI {
  order?: Order;
}

class Popup extends React.Component<PropsI, StateI> {
  constructor(props: PropsI) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    setInterval(async () => {
      const storage = await chromep.storage.local.get();
      if(storage.order != null) {
        this.setState({ order: storage.order })
      }
    }, 500);
  }

  render() {

    const { order } = this.state;

    return (
      <>
        <Paper style={{ padding: 10, minWidth: 200 }}>
          <Typography align="left" variant="body2" component="h6" noWrap>
            {
              (order != null) ?
                <>
                  <Typography align="center" variant="h6" component="p" noWrap>
                    Order Info
                  </Typography>
                  {
                    orderFields.map((orderField) => {
                      const orderInput = order[orderField.actualId];
                      if(orderInput != null && orderInput !== "") {
                        return <span key={orderField.actualId}><b>{orderField.name}</b> {orderInput}<br/></span>
                      }
                    })
                  }
                </>
              : <>No order info available</>
            }
          </Typography>
        </Paper>
      </>
    )
  }
}

const embeddedRoot = document.createElement("div");
embeddedRoot.setAttribute("id", "embeddedRoot")
embeddedRoot.setAttribute("style", "position: fixed; right: 10px; z-index: 10000;")
document.getElementsByTagName("body").item(0)?.prepend(embeddedRoot)
ReactDOM.render(<Popup/>, document.getElementById("embeddedRoot"))