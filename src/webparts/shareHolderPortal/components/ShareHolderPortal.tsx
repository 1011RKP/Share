import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Paper from "@material-ui/core/Paper";
import { MuiThemeProvider, ThemeProvider } from "@material-ui/core/styles";
import DescriptionIcon from "@material-ui/icons/Description";
import HelpIcon from "@material-ui/icons/Help";
import HomeIcon from "@material-ui/icons/Home";
import MenuIcon from "@material-ui/icons/Menu";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import PieChartIcon from "@material-ui/icons/PieChart";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { SPComponentLoader } from "@microsoft/sp-loader";
import { Web, sp } from "@pnp/pnpjs";
import "babel-polyfill";
import "es6-promise";
import * as jQuery from "jquery";
import { Panel } from "office-ui-fabric-react/lib/Panel";
import * as React from "react";
import { HashRouter as Router, Link, Route, Switch } from "react-router-dom";
import { AdminReportsHome } from "./adminReports/AdminReportsHome";
import {
  shareholderInputTheam,
  ErrorButton,
  SucessButton,
} from "./common/common";
import { AdminDashBoard } from "./dashboard/admin_Dashboard";
import { DashBoard } from "./dashboard/dashboard";
import { AdmindocumentsandForms } from "./documentsandforms/admin_documentsandForms";
import { DocumentsandForms } from "./documentsandforms/documentsandforms";
import { HelpCenter } from "./helpcenter/helpcenter";
import { IShareHolderPortalProps } from "./IShareHolderPortalProps";
import styles from "./ShareHolderPortal.module.scss";
import { AdminShareholdersDetails } from "./shareholders/Admins/Admin_ShareholdersDetails";
import { AdminShareholdings } from "./shareholders/Admins/Admin_Shareholdings";
import { MyShareholdings } from "./shareholders/MyShareholdings";
import { MyShareholdingsDetails } from "./shareholders/MyShareholdingsDetails";
import { devURL } from "./common/common";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
export const wawaLogo: any = require("../images/Logo.jpg");
export const loading: any = require("../images/loading.gif");
SPComponentLoader.loadCss(
  "https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
);

export default class ShareHolderPortal extends React.Component<
  IShareHolderPortalProps,
  any
> {
  public siteURL = devURL;
  public constructor(props: IShareHolderPortalProps, state: any) {
    super(props);
    this.state = {
      shareholdingCollection: [],
      setIsOpen: false,
      value: 0,
      setValue: 0,
      view_ShareholdersDetails: false,
      context: this.props.context,
      accountEmail: null,
      shareholderID: null,
      newWeb: null,
      tenentURL: null,
      isCurrentUserAdmin: false,
      currentUserPermissions: "",
      isDialog_Open: false,
      onDialog_Click:false,
      userNotFound:false
    };
  }

  public componentDidMount() {
    let siteURL = this.props.context.pageContext.web.absoluteUrl;
    let tenentUrl = siteURL.substring(0, siteURL.indexOf("sites/") - 1);
    this.setState({ tenentURL: tenentUrl }, () => {
      this.loggedInUserAccountID();
    });
  }

  public disclaimerPopUp = () => {
    let _html = (
      <React.Fragment>
        <div className="row">
          <Dialog
            disableBackdropClick
            open={this.state.isDialog_Open}
            maxWidth="lg"
            aria-labelledby="disclaimer-dialog-title"
            aria-describedby="disclaimer-dialog-description"
          >
            <DialogTitle
              id="disclaimer-dialog-title"
              style={{
                color: "#ffff",
                backgroundColor: "#275458",
                boxShadow: "0 5px 5px 0 rgba(0,0,0,.25)",
                padding: "10px",
                marginBottom: "15px",
              }}
            >
              <h5>Downloading Disclaimer </h5>
            </DialogTitle>
            <DialogContent>
              <div style={{ marginBottom: "0" }}>
                <p style={{ fontSize: "14px", margin: "0" }}>
                  The information posted on the Wawa Shareholder Portal (the
                  "Portal") is the confidential information of Wawa, Inc.
                  ("Wawa"). By downloading content from the Portal, you agree to
                  retain in confidence the information disclosed to you by Wawa.
                  You further agree that you will not use, copy, duplicate,
                  distribute or disseminate this information to parties (other
                  than to your personal financial or tax advisors for the sole
                  purpose of providing professional services to you) without the
                  prior express written consent of Wawa. Whenever accessing the
                  Portal and downloading files, you are responsible to ensure
                  that both your device and internet connection are secure. You
                  are responsible for the continued protection of the downloaded
                  content after downloading.
                </p>
                <br />
                <p style={{ fontSize: "14px", margin: "0" }}>
                  Certain information downloaded may contain "forward-looking
                  statements." You can identify these statements and other
                  forward-looking statements in this information by words such
                  as "may", "will", "expect", "anticipate", "believe",
                  "estimate", "plan", "intend", "continue", or similar words,
                  expressions or the negative of such terms or other comparable
                  terminology. You should read these statements carefully
                  because they contain projections of our future results of
                  operations or financial condition, or state other
                  “forward-looking” information. Such statements are based on
                  the current expectations and certain assumptions of the
                  Company’s management, and are, therefore, subject to certain
                  risks and uncertainties. These statements are based on
                  assumptions that may not come true. A variety of factors, many
                  of which are beyond the Company’s control, affect the
                  Company’s operations, performance, business strategy and
                  results and could cause the actual results, performance or
                  achievements of the Company to be materially different from
                  any future results, performance or achievements that may be
                  expressed or implied by such forward-looking statements or
                  anticipated on the basis of historical trends. A number of
                  risks and uncertainties exist which could cause actual results
                  to differ materially from the results reflected in these
                  forward-looking statements. All forward-looking disclosure is
                  speculative by its nature. The Company undertakes no
                  obligation to update any of the forward-looking information
                  included in this report, whether as a result of new
                  information, future events, changed expectations or otherwise.
                </p>
              </div>
            </DialogContent>
            <DialogActions style={{ padding: "15px" }}>
              <SucessButton
                onClick={(e) => {
                  this.disclaimerPost();
                }}
              >
                <CheckCircleIcon style={{ marginRight: "5px" }} />
                {this.state.onDialog_Click !== false ? (
                  <React.Fragment>
                    {" "}
                    Agree{" "}
                    <div
                      className="spinner-border spinner-border-sm"
                      style={{
                        color: "white",
                        marginBottom: "2px",
                        marginLeft: "5px",
                      }}
                      role="status"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment> Agree </React.Fragment>
                )}
              </SucessButton>
            </DialogActions>
          </Dialog>
        </div>
      </React.Fragment>
    );
    return _html;
  }

  public disclaimerPost = () => {
    this.setState({onDialog_Click:true},()=>{
    let newWeb = new Web(this.state.tenentURL + this.siteURL);
    newWeb.lists
      .getByTitle("Disclaimer")
      .items.add({
        Title: this.state.accountEmail.toString(),
      })
      .then((i) => {
        this.setState({
          isDialog_Open: false,
          onDialog_Click: false,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  });
  }

  public disclaimerValidate = () => {
    let newWeb = new Web(this.state.tenentURL + this.siteURL);
    newWeb.lists
      .getByTitle("Disclaimer")
      .items.select("ID", "Title")
      .orderBy("Title", true)
      .filter("Title eq '" + this.state.accountEmail + "'")
      .get()
      .then((d) => {
        if (d.length > 0) {
          this.setState({
            isDialog_Open:false
          });
        } else {
          this.setState({
            isDialog_Open:true
          })
        }
        console.log(this.state);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  public openPanel = () => {
    this.setState({
      setIsOpen: true,
    });
  }

  public dismissPanel = () => {
    this.setState({
      setIsOpen: false,
    });
  }

  public loggedInUserAccountID = () => {
    let newWeb = new Web(this.props.context.pageContext.web.absoluteUrl);
    let restFullURL = this.props.siteurl + "/_api/web/currentuser";
    let userID;
    this.props.spHttpClient
      .get(restFullURL, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        response
          .json()
          .then((responseJSON: any) => {
            let accountEmail = "";
            const email = responseJSON["UserPrincipalName"];
            if (email.indexOf("#") > 0) {
              let spl = email.split("#");
              spl = spl[0].split("_");
              accountEmail = spl[0] + "@" + spl[1];
            } else {
              accountEmail = responseJSON["UserPrincipalName"];
            }
            console.log(accountEmail);
            //const accountEmail = responseJSON["Email"];
            userID = responseJSON["Id"];
            this.setState(
              {
                accountEmail: accountEmail,
                newWeb: this.props.context.pageContext.web.absoluteUrl,
                //shareholderDocuments: this.state.tenentURL + this.siteURL + "/ShareholdingDocuments/Forms/Admin.aspx"
              },
              () => {
                this.disclaimerValidate();
                let url =
                  this.props.siteurl +
                  // "/_api/web/sitegroups/getbyname('WawaSPAdmin')/Users?$filter=Id eq " +
                  "/_api/web/sitegroups/getbyname('Shareholders')/Users?$filter=Id eq " +
                  userID;
                this.props.spHttpClient
                  .get(url, SPHttpClient.configurations.v1)
                  .then((res: SPHttpClientResponse) => {
                    res.json().then((r: any) => {
                      // if (r.value.length > 0) {
                      //   this.setState({
                      //     isCurrentUserAdmin: true,
                      //     shareholderID: ""
                      //   });
                      // } else {
                      //   this.setState({
                      //     isCurrentUserAdmin: false,
                      //     shareholderID: ""
                      //   });
                      //   this.getEndUserDetails();
                      // }
                      if (r.value.length > 0) {
                        this.setState({
                          isCurrentUserAdmin: false,
                          shareholderID: "",
                        });
                        this.getEndUserDetails();
                      } else {
                        this.setState({
                          isCurrentUserAdmin: true,
                          shareholderID: "",
                        });
                      }
                    });
                  });
              }
            );
          })
          .catch((e) => {
            console.error(e);
          });
      });
  }

  public getEndUserDetails = () => {
    let newWeb = new Web(this.state.tenentURL + this.siteURL);
    newWeb.lists
      .getByTitle("Shareholdings")
      .items.select("ID", "Title", "shareholderID", "shareholderEmail")
      .orderBy("Title", true)
      .filter("shareholderEmail eq '" + this.state.accountEmail + "'")
      .get()
      .then((d) => {
        if (d.length > 0) {
          this.setState((prevState) => ({
            ...prevState,
            shareholdingCollection: d,
            userNotFound:false
          }));
        } else {
          this.setState((prevState) => ({
            ...prevState,
            shareholdingCollection: [],
            userNotFound:true
          }));
        }
        console.log(this.state);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  public loadHTML = () => {
    let _html = (
      <ThemeProvider theme={shareholderInputTheam}>
        <Grid container spacing={3} style={{ margin: "-30px 0px 0px 0px" }}>
          <Router>
            <div className="hidden-md-up">
              <Hidden only={["lg", "md", "xl"]}>
                <Grid item xs={12} sm={12}>
                  <Paper>
                    <a
                      onClick={this.openPanel}
                      style={{
                        float: "right",
                        cursor: "pointer",
                      }}
                    >
                      <MenuIcon fontSize="large" />
                    </a>
                    <Panel
                      isOpen={this.state.setIsOpen}
                      onDismiss={this.dismissPanel}
                      isLightDismiss={true}
                      headerText="Wawa Shareholder Portal"
                    >
                      <List component="nav">
                        <React.Fragment>
                          {this.state.isCurrentUserAdmin !== true ? (
                            <React.Fragment>
                              <ListItem>
                                <ListItemIcon>
                                  <Link
                                    className={styles.linkto}
                                    onClick={this.dismissPanel}
                                    to="/"
                                  >
                                    <HomeIcon fontSize="default" />
                                    Dashboard
                                  </Link>
                                </ListItemIcon>
                              </ListItem>
                              <ListItem>
                                <ListItemIcon>
                                  <Link
                                    className={styles.linkto}
                                    onClick={this.dismissPanel}
                                    to={{
                                      pathname: `/myShareholdings`,
                                    }}
                                  >
                                    <PieChartIcon fontSize="default" />
                                    Shareholdings
                                  </Link>
                                </ListItemIcon>
                              </ListItem>
                              <ListItem>
                                <ListItemIcon>
                                  <Link
                                    className={styles.linkto}
                                    onClick={this.dismissPanel}
                                    to="/documentsandforms"
                                  >
                                    <DescriptionIcon fontSize="default" />
                                    Documents and Forms
                                  </Link>
                                </ListItemIcon>
                              </ListItem>
                              <ListItem>
                                <ListItemIcon>
                                  <Link
                                    className={styles.linkto}
                                    onClick={this.dismissPanel}
                                    to="/helpCenter"
                                  >
                                    <HelpIcon fontSize="default" />
                                    Help Center
                                  </Link>
                                </ListItemIcon>
                              </ListItem>
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <ListItem>
                                <ListItemIcon>
                                  <Link
                                    className={styles.linkto}
                                    onClick={this.dismissPanel}
                                    to="/"
                                  >
                                    <HomeIcon fontSize="default" />
                                    Dashboard
                                  </Link>
                                </ListItemIcon>
                              </ListItem>
                              <ListItem>
                                <ListItemIcon>
                                  <Link
                                    className={styles.linkto}
                                    onClick={this.dismissPanel}
                                    to={{
                                      pathname: `/adminShareholdings`,
                                    }}
                                  >
                                    <PieChartIcon fontSize="default" />
                                    Shareholdings
                                  </Link>
                                </ListItemIcon>
                              </ListItem>
                              <ListItem>
                                <ListItemIcon>
                                  <Link
                                    className={styles.linkto}
                                    onClick={this.dismissPanel}
                                    to="/adminDocumentsandForms"
                                  >
                                    <DescriptionIcon fontSize="default" />
                                    Documents and Forms
                                  </Link>
                                </ListItemIcon>
                              </ListItem>
                              <ListItem>
                                <ListItemIcon>
                                  <Link
                                    className={styles.linkto}
                                    onClick={this.dismissPanel}
                                    to="/helpCenter"
                                  >
                                    <HelpIcon fontSize="default" />
                                    Help Center
                                  </Link>
                                </ListItemIcon>
                              </ListItem>
                              <ListItem>
                                <ListItemIcon>
                                  <Link
                                    className={styles.linkto}
                                    onClick={this.dismissPanel}
                                    to="/adminReportsHome"
                                  >
                                    <DescriptionIcon fontSize="default" />
                                    Admin Reports
                                  </Link>
                                </ListItemIcon>
                              </ListItem>
                              {/* <ListItem>

                              </ListItem> */}
                            </React.Fragment>
                          )}
                        </React.Fragment>
                      </List>
                    </Panel>
                  </Paper>
                </Grid>
              </Hidden>
            </div>
            <Hidden only={["lg", "md", "xl"]}>
              <Grid item sm={12} xs={12}>
                <div
                  className="row"
                  style={{
                    background: "#e0e0e0",
                    margin: "-12px",
                  }}
                >
                  <div className="col-sm-12">
                    <div className="alert" style={{ marginBottom: "0rem" }}>
                      <p
                        className="text-center"
                        style={{
                          margin: "auto!important",
                          marginBottom: "0rem",
                          paddingTop: "1px",
                          paddingBottom: "15px",
                        }}
                      >
                        <span className="text-danger">Need help? </span> Call
                        484-840-1813 or{" "}
                        <span className="text-danger">
                          {" "}
                          <a
                            href="mailto:shareholderservices@wawa.com"
                            className="text-danger"
                          >
                            {" "}
                            Email Us{" "}
                          </a>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </Grid>
            </Hidden>
            <Hidden only={["sm", "xs"]}>
              <Grid item md={12} lg={12} xl={12}>
                <div
                  className="row"
                  style={{
                    background: "#e0e0e0",
                    margin: "-12px",
                  }}
                >
                  <div className="col-sm-12">
                    <div className="alert" style={{ marginBottom: "0rem" }}>
                      <img
                        src={wawaLogo}
                        style={{
                          float: "left",
                          height: "65px",
                          background: "none",
                          marginTop: "-13px",
                          marginLeft: "-25px",
                        }}
                      />
                      <p
                        className="text-center"
                        style={{
                          margin: "auto!important",
                          marginBottom: "0rem",
                          paddingTop: "1px",
                          paddingBottom: "15px",
                        }}
                      >
                        <span className="text-danger">Need help? </span> Call
                        484-840-1813 or{" "}
                        <span className="text-danger">
                          {" "}
                          <a
                            href="mailto:shareholderservices@wawa.com"
                            className="text-danger"
                          >
                            {" "}
                            Email Us{" "}
                          </a>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </Grid>
            </Hidden>
            <Hidden only={["sm", "xs"]}>
              <Grid
                item
                xl={2}
                lg={2}
                md={2}
                className={styles.container_lg_sideNavigation}
              >
                <List component="nav">
                  <React.Fragment>
                    {this.state.isCurrentUserAdmin !== true ? (
                      <React.Fragment>
                        <ListItem>
                          <ListItemIcon>
                            <Link className={styles.linkto} to="/">
                              <HomeIcon fontSize="default" />
                              Dashboard
                            </Link>
                          </ListItemIcon>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Link
                              className={styles.linkto}
                              to={{
                                pathname: `/myShareholdings`,
                              }}
                            >
                              <PieChartIcon fontSize="default" />
                              Shareholdings
                            </Link>
                          </ListItemIcon>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Link
                              className={styles.linkto}
                              to="/documentsandforms"
                            >
                              <DescriptionIcon fontSize="default" />
                              Documents and Forms
                            </Link>
                          </ListItemIcon>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Link className={styles.linkto} to="/helpCenter">
                              <HelpIcon fontSize="default" />
                              Help Center
                            </Link>
                          </ListItemIcon>
                        </ListItem>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <ListItem>
                          <ListItemIcon>
                            <Link className={styles.linkto} to="/">
                              <HomeIcon fontSize="default" />
                              Dashboard
                            </Link>
                          </ListItemIcon>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Link
                              className={styles.linkto}
                              to={{
                                pathname: `/adminShareholdings`,
                              }}
                            >
                              <PieChartIcon fontSize="default" />
                              Shareholdings
                            </Link>
                          </ListItemIcon>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Link
                              className={styles.linkto}
                              to="/adminDocumentsandForms"
                            >
                              <DescriptionIcon fontSize="default" />
                              Documents and Forms
                            </Link>
                          </ListItemIcon>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Link className={styles.linkto} to="/helpCenter">
                              <HelpIcon fontSize="default" />
                              Help Center
                            </Link>
                          </ListItemIcon>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Link
                              className={styles.linkto}
                              to="/adminReportsHome"
                            >
                              <DescriptionIcon fontSize="default" />
                              Admin Reports
                            </Link>
                          </ListItemIcon>
                        </ListItem>
                      </React.Fragment>
                    )}
                  </React.Fragment>
                </List>
              </Grid>
            </Hidden>
            <Grid
              item
              xs={12}
              sm={12}
              md={10}
              lg={10}
              xl={10}
              className={styles.container_lg_contentArea}
              style={{ paddingRight: "0" }}
            >
              {this.state.isCurrentUserAdmin !== true ? (
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={(props) => (
                      <DashBoard
                        properties={{
                          tenentURL: this.state.tenentURL + this.siteURL,
                          accountEmail: this.state.accountEmail,
                        }}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/myShareholdings"
                    render={(props) => (
                      <MyShareholdings
                        properties={{
                          tenentURL: this.state.tenentURL + this.siteURL,
                          accountEmail: this.state.accountEmail,
                          newWeb: this.state.newWeb,
                        }}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/documentsandforms"
                    render={(props) => (
                      <DocumentsandForms
                        properties={{
                          tenentURL: this.state.tenentURL + this.siteURL,
                          accountEmail: this.state.accountEmail,
                        }}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/helpCenter"
                    render={(props) => (
                      <HelpCenter
                        properties={{
                          newWeb: this.state.newWeb,
                          accountID: this.state.shareholderID,
                          accountEmail: this.state.accountEmail,
                          tenentURL: this.state.tenentURL,
                          isCurrentUserAdmin: this.state.isCurrentUserAdmin,
                          currentUserPermissions: "",
                          pageContext: this.props.spHttpClient,
                        }}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/myShareholdingsDetails/:accountID"
                    render={(props) => (
                      <MyShareholdingsDetails
                        properties={{
                          tenentURL: this.state.tenentURL + this.siteURL,
                          accountEmail: this.state.accountEmail,
                          pageContext: this.props.spHttpClient,
                        }}
                      />
                    )}
                  />
                </Switch>
              ) : (
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={(props) => (
                      <AdminDashBoard
                        properties={{
                          newWeb: this.state.newWeb,
                          tenentURL: this.state.tenentURL + this.siteURL,
                        }}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/adminShareholdings"
                    render={(props) => (
                      <AdminShareholdings
                        properties={{
                          tenentURL: this.state.tenentURL + this.siteURL,
                        }}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/adminDocumentsandForms"
                    render={(props) => (
                      <AdmindocumentsandForms
                        properties={{
                          newWeb: this.state.newWeb,
                          accountID: this.state.shareholderID,
                          accountEmail: this.state.accountEmail,
                          tenentURL: this.state.tenentURL,
                          isCurrentUserAdmin: this.state.isCurrentUserAdmin,
                        }}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/helpCenter"
                    render={(props) => (
                      <HelpCenter
                        properties={{
                          newWeb: this.state.newWeb,
                          accountID: this.state.shareholderID,
                          accountEmail: this.state.accountEmail,
                          tenentURL: this.state.tenentURL,
                          isCurrentUserAdmin: this.state.isCurrentUserAdmin,
                          currentUserPermissions: "",
                          pageContext: this.props.spHttpClient,
                        }}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/adminReportsHome"
                    render={(props) => (
                      <AdminReportsHome
                        properties={{
                          newWeb: this.state.newWeb,
                          accountID: this.state.shareholderID,
                          accountEmail: this.state.accountEmail,
                          tenentURL: this.state.tenentURL + this.siteURL,
                          isCurrentUserAdmin: this.state.isCurrentUserAdmin,
                          currentUserPermissions: "",
                        }}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/adminShareholdersDetails/:accountID"
                    render={(props) => (
                      <AdminShareholdersDetails
                        properties={{
                          tenentURL: this.state.tenentURL + this.siteURL,
                          newWeb: this.state.newWeb,
                          pageContext: this.props.spHttpClient,
                        }}
                      />
                    )}
                  />
                  )
                </Switch>
              )}
            </Grid>
          </Router>
        </Grid>
      </ThemeProvider>
    );
    return _html;
  }

  public render(): React.ReactElement<IShareHolderPortalProps> {
    jQuery("#workbenchPageContent").attr("style", "max-width:100%!important");
    jQuery(".SPCanvas-canvas").attr("style", "max-width:100%!important");
    jQuery(".CanvasZone").attr("style", "max-width:100%!important");

    return (
      <div className={styles.shareHolderPortal}>
        <div className={styles.root}>
          <React.Fragment>{this.disclaimerPopUp()}</React.Fragment>
          {this.state.shareholderID !== null ? (
            this.state.isCurrentUserAdmin === true ? (
              <React.Fragment> {this.loadHTML()} </React.Fragment>
            ) : this.state.shareholdingCollection.length > 0 ? (
              <React.Fragment> {this.loadHTML()} </React.Fragment>
            ) : (
              <React.Fragment>
                {this.state.userNotFound !== false ? (
                  <React.Fragment>
                    <div className="container">
                      <div
                        className="row"
                        style={{ clear: "both", marginTop: "25px" }}
                      ></div>
                      <div className="alert alert-danger">
                        <h4
                          style={{
                            margin: "auto",
                            display: "block",
                          }}
                        >
                          <strong>Error for "{this.state.accountEmail}" {" "}!</strong> Something Went Wrong. Please
                          contact Wawa Shareholder Portal Admin Office.
                        </h4>
                      </div>
                    </div>
                  </React.Fragment>
                ) : null}
              </React.Fragment>
            )
          ) : (
            <div className="conatiner">
              <img
                src={loading}
                // src={
                //   this.props.siteurl + "/SiteAssets/shareholders/loading.gif"
                // }
                //  "https://wawadev.sharepoint.com/sites/RatnaDev/SiteAssets/shareholders/loading.gif"
                style={{
                  margin: "auto",
                  display: "block",
                  padding: "25px",
                }}
                className="resposive"
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}
