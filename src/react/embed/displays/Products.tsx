// Icon Imports
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";

// Main imports
import React, { Component, CSSProperties } from "react";
import { Box, Container, Divider, Grid, IconButton, Theme, Toolbar, Tooltip, Typography, withStyles } from "@material-ui/core";
import { globalContext, GlobalContext } from "../../contexts";
import { WithStyles } from "@material-ui/core/styles/withStyles";

const styles = (theme: Theme) => ({
  infoContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
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

interface Props extends WithStyles<typeof styles> {
  style: CSSProperties;
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
    const { style, classes } = this.props;
    const { order } = this.context as GlobalContext;

    let display = (
      <Grid container direction="column" justify="center" style={style}>
        <Typography
          variant="subtitle2"
          component="p"
          align="center"
        >
          Load up an Order on the CMS and this section<br/>
          will display all products on the order.
        </Typography>
      </Grid>
    )

    if(order != null) display = (
      <>
        <Container style={style}>
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
    url: "https://orders.groundsure.com/Account/Logon?ReturnUrl=%2f#quotes" },
  { matches: [ "fci", "cls" ],
    url: "https://www.clsl.co.uk/" },
  { matches: [ "landmark"],
    url: "https://www.landmarklegalreports.co.uk/Welcome.do?articleId1=47701&articleId2=47698&activePage=home" },

  // Water Report Companies
  { matches: [ "(con29 dw) - anglian" ],
    url: "https://www.geodesys.com/drainage-and-water" },
  { matches: [ "(con29 dw) - welsh water" ],
    url: "https://account.dwrcymru.com/en/Forms/Standard-Drainage-and-Water-Enquiries.aspx" },
  { matches: [ "(con29 dw) - hafren dyfrdwy" ],
    url: "https://account.dwrcymru.com/en/Forms/Standard-Drainage-and-Water-Enquiries.aspx" },
  /*{ matches: [ "(con29 dw) - northumbrian" ],
    url: "" },*/
  { matches: [ "(con29 dw) - severn trent" ],
    url: "https://my-account.severntrentsearches.com/login" },
  { matches: [ "(con29 dw) - south west" ],
    url: "https://www.southernwater.co.uk/account-login" },
  { matches: [ "(con29 dw) - southern" ],
    url: "https://www.southernwater.co.uk/account-login" },
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

  // Other
  { matches: [ "smartsearch" ],
    url: "https://www.smartsearchsecure.com/" }
]

export default withStyles(styles, { withTheme: true })(Products);