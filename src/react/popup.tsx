import React from "react";
import ReactDOM from "react-dom";
import chromep from "chrome-promise"
import { orderFields } from "../lib/vars";
import { Order } from "../lib/interfaces";
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

  async componentDidMount() {
    const storage = await chromep.storage.local.get();
    if(storage.order != null) {
      this.setState({ order: storage.order })
    }
  }

  render() {

    const { order } = this.state;

    return (
      <>
        <Paper style={{ padding: 10, minWidth: 200 }}>
          <Typography align="left" variant="body2" component="p" noWrap>
            {
              (order != null) ?
                <>
                  <Typography align="center" variant="h6" component="h6" noWrap>
                    Order Info
                  </Typography>
                  {
                    orderFields.map((orderField) => {
                      const orderInput = order[orderField.actualId];
                      if(orderInput != null && orderInput !== "") {
                        return <><b>{orderField.name}</b> {orderInput}<br/></>
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

ReactDOM.render(<Popup/>, document.getElementById("root"))