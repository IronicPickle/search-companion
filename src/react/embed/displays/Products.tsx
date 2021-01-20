// Icon Imports
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";

// Main imports
import React, { Component, MouseEvent } from "react";
import { Box, Container, Divider, IconButton, Theme, Toolbar, Tooltip, Typography, withStyles } from "@material-ui/core";
import { globalContext, GlobalContext } from "../../contexts";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import Header from "./Header";

const styles = (theme: Theme) => ({
  mainContainer: {
    paddingRight: 0,
    paddingLeft: 0,
    minWidth: theme.spacing(48)
  },
  infoContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    height: theme.spacing(45) - theme.spacing(4) - 51,
    overflow: "auto"
  },
  entryToolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    minHeight: theme.spacing(4),
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText
    }
  },
  entryTitle: {
    marginRight: theme.spacing(2)
  },
  totalCostDivider: {
    marginRight: theme.spacing(2)
  },
  openLinkButton: {
    marginLeft: theme.spacing(1)
  },
  totalCost: {
    marginRight: 30 + theme.spacing(1)
  },
  divider: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(8),
    marginLeft: theme.spacing(8),
    marginBottom: theme.spacing(2)
  }
});

interface Props {
  classes: ClassNameMap;
}

interface State {
  
}

class Products extends Component<Props, State> {
  static contextType = globalContext;
  constructor(props: Props) {
    super(props)

    this.state = {}

  }

  render() {
    const { classes } = this.props;
    const { settings, order } = this.context as GlobalContext;

    let display = (
      <>
        <Container className={classes.mainContainer}>
          <Typography
            variant="subtitle1"
            component="h2"
            align="center"
          >No Products to Show</Typography>
          <Divider className={classes.divider} />
          <Typography
            variant="subtitle2"
            component="p"
            align="center"
          >
            Load up an Order on the CMS and this section<br/>
            will display all products on the order.
          </Typography>
        </Container>
      </>
    )

    if(order != null) display = (
      <>
        <Container className={classes.mainContainer}>
          <Header
            reference={order?.reference}
            type={order?.type}
            council={order?.council} 
          />
          <div className={classes.infoContainer}>
            <Typography
              variant="subtitle2"
              component="div"
            >
              {
                order.products.map(product => {
                  const productUrl = getProductLink(product.name)?.url;
                  const tooltip = (product.returned == null) ?
                    "Not returned"
                  : `Returned: ${product.returned}`
                  return (
                    <Tooltip title={tooltip} PopperProps={{ disablePortal: true }} key={product.name}>
                      <Toolbar disableGutters className={classes.entryToolbar} >
                        <Box flexGrow={1}>
                          <b className={classes.entryTitle}>{product.name}</b><br />
                        </Box>
                        <Box>
                          £{product.cost}
                        </Box>
                        <Box>
                          <IconButton
                            size="small"
                            className={classes.openLinkButton}
                            href={productUrl || ""}
                            target="_blank"
                            disabled={productUrl == null}
                          >
                            <Tooltip title="Order Product" PopperProps={{ disablePortal: true }} >
                              <ArrowRightAltIcon 
                                style={{
                                  transform: (productUrl == null) ? "rotate(90deg)" : "rotate(-45deg)"
                                }}
                              />
                            </Tooltip>
                          </IconButton>
                        </Box>
                      </Toolbar>
                    </Tooltip>
                  )
                })
              }
              <Divider className={classes.totalCostDivider} />
              <Toolbar disableGutters className={classes.entryToolbar} key="totalCost" >
                <Box flexGrow={1}>
                  <b className={classes.entryTitle}>Total Cost </b><br />
                </Box>
                <Box className={classes.totalCost}>
                  £{order?.totalCost}
                </Box>
              </Toolbar>
            </Typography>
          </div>
        </Container>
      </>
    )

    return display;
  }
}

function getProductLink(name: string) {
  return productLinks.find(productLink => {
    const matches = productLink.matches;
    for(const i in matches) {
      if(name.toLowerCase().includes(matches[i])) {
        return productLink;
      }
    }
  });
}

const productLinks = [
  // Mining Report Companies
  { matches: [ "terrasearch", "terrafirma" ],
    url: "https://www.terrafirmaidc.co.uk/order" },
  { matches: [ "coal authority" ],
    url: "https://www.groundstability.com/public/web/web-portal/log-order?execution=e1s2" },

  // Environmental Report Companies
  { matches: [ "groundsure" ],
    url: "https://www.groundsure.com/login-register/" },
  { matches: [ "fci", "cls" ],
    url: "https://www.clsl.co.uk/" },
  { matches: [ "landmark"],
    url: "" },

  // Water Report Companies
  { matches: [ "(con29 dw) - anglian" ],
    url: "https://www.geodesys.com/drainage-and-water" },
  { matches: [ "(con29 dw) - welsh water" ],
    url: "https://account.dwrcymru.com/en/Forms/Standard-Drainage-and-Water-Enquiries.aspx" },
  { matches: [ "(con29 dw) - hafren dyfrdwy" ],
    url: "https://account.dwrcymru.com/en/Forms/Standard-Drainage-and-Water-Enquiries.aspx" },
  { matches: [ "(con29 dw) - northumbrian" ],
    url: "" },
  { matches: [ "(con29 dw) - severn trent" ],
    url: "https://my-account.severntrentsearches.com/login" },
  { matches: [ "(con29 dw) - south west" ],
    url: "" },
  { matches: [ "(con29 dw) - southern" ],
    url: "" },
  { matches: [ "(con29 dw) - thames" ],
    url: "https://www.thameswater-propertysearches.co.uk/" },
  { matches: [ "(con29 dw) - united utilities" ],
    url: "https://propertysearches.unitedutilities.com/homeloggedin/order/" },
  { matches: [ "(con29 dw) - wessex" ],
    url: "https://www.wessexsearches.co.uk/CON29DW-Drainage-and-Water-Enquiries/" },
  { matches: [ "(con29 dw) - yorkshire" ],
    url: "https://www.safe-move.co.uk/residential-searches/residential-con29dw/" },
  { matches: [ "gas distributions", "gas and electric" ],
    url: "https://www.utilitysearch.com/main.asp" },
]

export default withStyles(styles, { withTheme: true })(Products);