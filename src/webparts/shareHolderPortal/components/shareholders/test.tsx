// import Grid from "@material-ui/core/Grid";
// import Hidden from "@material-ui/core/Hidden";
// import List from "@material-ui/core/List";
// import ListItem from "@material-ui/core/ListItem";
// import ListItemIcon from "@material-ui/core/ListItemIcon";
// import Paper from "@material-ui/core/Paper";
// import { MuiThemeProvider, ThemeProvider } from "@material-ui/core/styles";
// import DescriptionIcon from "@material-ui/icons/Description";
// import HelpIcon from "@material-ui/icons/Help";
// import HomeIcon from "@material-ui/icons/Home";
// import MenuIcon from "@material-ui/icons/Menu";
// import PieChartIcon from "@material-ui/icons/PieChart";
// import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
// import { SPComponentLoader } from "@microsoft/sp-loader";
// import { Web, sp } from "@pnp/pnpjs";
// import "babel-polyfill";
// import "es6-promise";
// import * as jQuery from "jquery";
// import { Panel } from "office-ui-fabric-react/lib/Panel";
// import * as React from "react";
// import { HashRouter as Router, Link, Route, Switch } from "react-router-dom";
// import { AdminReportsHome } from "./adminReports/AdminReportsHome";
// import { shareholderInputTheam } from "./common/common";
// import { AdminDashBoard } from "./dashboard/admin_Dashboard";
// import { DashBoard } from "./dashboard/dashboard";
// import { AdmindocumentsandForms } from "./documentsandforms/admin_documentsandForms";
// import { DocumentsandForms } from "./documentsandforms/documentsandforms";
// import { HelpCenter } from "./helpcenter/helpcenter";
// import { IShareHolderPortalProps } from "./IShareHolderPortalProps";
// import styles from "./ShareHolderPortal.module.scss";
// import { AdminShareholdersDetails } from "./shareholders/Admins/Admin_ShareholdersDetails";
// import { AdminShareholdings } from "./shareholders/Admins/Admin_Shareholdings";
// import { MyShareholdings } from "./shareholders/MyShareholdings";
// import { MyShareholdingsDetails } from "./shareholders/MyShareholdingsDetails";
// import { devURL, qavURL, prodURL, importURL } from "./common/common";
// import ImportExportIcon from "@material-ui/icons/ImportExport";

// SPComponentLoader.loadCss(
//   "https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
// );

// export default class ShareHolderPortal extends React.Component<
//   IShareHolderPortalProps,
//   any
// > {
//   public siteURL = devURL;
//   public constructor(props: IShareHolderPortalProps, state: any) {
//     super(props);
//     this.state = {
//       shareholdingCollection: [],
//       setIsOpen: false,
//       value: 0,
//       setValue: 0,
//       view_ShareholdersDetails: false,
//       context: this.props.context,
//       accountEmail: null,
//       shareholderID: null,
//       newWeb: null,
//       tenentURL: null,
//       isCurrentUserAdmin: false,
//       currentUserPermissions: ""
//       //shareholderDocuments: ""
//     };
//   }

//   public componentDidMount() {
//     let siteURL = this.props.context.pageContext.web.absoluteUrl;
//     let tenentUrl = siteURL.substring(0, siteURL.indexOf("sites/") - 1);
//     this.setState({ tenentURL: tenentUrl }, () => {
//       this.loggedInUserAccountID();
//     });
//   }

//   public openPanel = () => {
//     this.setState({
//       setIsOpen: true
//     });
//   };

//   public dismissPanel = () => {
//     this.setState({
//       setIsOpen: false
//     });
//   };

//   public loggedInUserAccountID = () => {
//     let newWeb = new Web(this.props.context.pageContext.web.absoluteUrl);
//     let restFullURL = this.props.siteurl + "/_api/web/currentuser";
//     let userID;
//     this.props.spHttpClient
//       .get(restFullURL, SPHttpClient.configurations.v1)
//       .then((response: SPHttpClientResponse) => {
//         response
//           .json()
//           .then((responseJSON: any) => {
//             //const accountEmail = responseJSON["UserPrincipalName"];
//             const accountEmail = responseJSON["Email"];
//             userID = responseJSON["Id"];
//             this.setState(
//               {
//                 accountEmail: accountEmail,
//                 newWeb: this.props.context.pageContext.web.absoluteUrl
//                 //shareholderDocuments: this.state.tenentURL + this.siteURL + "/ShareholdingDocuments/Forms/Admin.aspx"
//               },
//               () => {
//                 let url =
//                   this.props.siteurl +
//                   "/_api/web/sitegroups/getbyname('WawaSPAdmin')/Users?$filter=Id eq " +
//                   userID;
//                 this.props.spHttpClient
//                   .get(url, SPHttpClient.configurations.v1)
//                   .then((res: SPHttpClientResponse) => {
//                     res.json().then((r: any) => {
//                       if (r.value.length > 0) {
//                         this.setState({
//                           isCurrentUserAdmin: true,
//                           shareholderID: ""
//                         });
//                       } else {
//                         this.setState({
//                           isCurrentUserAdmin: false,
//                           shareholderID: ""
//                         });
//                         this.getEndUserDetails();
//                       }
//                     });
//                   });
//               }
//             );
//           })
//           .catch(e => {
//             console.error(e);
//           });
//       });
//   };

//   public getEndUserDetails = () => {
//     let newWeb = new Web(this.state.tenentURL + this.siteURL);
//     newWeb.lists
//       .getByTitle("Shareholdings")
//       .items.select("ID", "Title", "shareholderID", "shareholderEmail")
//       .orderBy("Title", true)
//       .filter("shareholderEmail eq '" + this.state.accountEmail + "'")
//       .get()
//       .then(d => {
//         if (d.length > 0) {
//           this.setState(prevState => ({
//             ...prevState,
//             shareholdingCollection: d
//           }));
//         } else {
//           this.setState(prevState => ({
//             ...prevState,
//             shareholdingCollection: []
//           }));
//         }
//         console.log(this.state);
//       })
//       .catch(e => {
//         console.error(e);
//       });
//   };

//   public loadHTML = () => {
//     let _html = (
//       <ThemeProvider theme={shareholderInputTheam}>
//         <Grid container spacing={3} style={{ margin: "-30px 0px 0px 0px" }}>
//           <Router>
//             <div className="hidden-md-up">
//               <Hidden only={["lg", "md", "xl"]}>
//                 <Grid item xs={12} sm={12}>
//                   <Paper>
//                     <a
//                       onClick={this.openPanel}
//                       style={{
//                         float: "right",
//                         cursor: "pointer"
//                       }}
//                     >
//                       <MenuIcon fontSize="large" />
//                     </a>
//                     <Panel
//                       isOpen={this.state.setIsOpen}
//                       onDismiss={this.dismissPanel}
//                       isLightDismiss={true}
//                       headerText="Wawa Shareholder Portal"
//                     >
//                       <List component="nav">
//                         <React.Fragment>
//                           {this.state.isCurrentUserAdmin !== true ? (
//                             <React.Fragment>
//                               <ListItem>
//                                 <ListItemIcon>
//                                   <Link
//                                     className={styles.linkto}
//                                     onClick={this.dismissPanel}
//                                     to="/"
//                                   >
//                                     <HomeIcon fontSize="default" />
//                                     DashBoard
//                                   </Link>
//                                 </ListItemIcon>
//                               </ListItem>
//                               <ListItem>
//                                 <ListItemIcon>
//                                   <Link
//                                     className={styles.linkto}
//                                     onClick={this.dismissPanel}
//                                     to={{
//                                       pathname: `/myShareholdings`
//                                     }}
//                                   >
//                                     <PieChartIcon fontSize="default" />
//                                     Shareholdings
//                                   </Link>
//                                 </ListItemIcon>
//                               </ListItem>
//                               <ListItem>
//                                 <ListItemIcon>
//                                   <Link
//                                     className={styles.linkto}
//                                     onClick={this.dismissPanel}
//                                     to="/documentsandforms"
//                                   >
//                                     <DescriptionIcon fontSize="default" />
//                                     Documents and Forms
//                                   </Link>
//                                 </ListItemIcon>
//                               </ListItem>
//                               <ListItem>
//                                 <ListItemIcon>
//                                   <Link
//                                     className={styles.linkto}
//                                     onClick={this.dismissPanel}
//                                     to="/helpCenter"
//                                   >
//                                     <HelpIcon fontSize="default" />
//                                     HelpCenter
//                                   </Link>
//                                 </ListItemIcon>
//                               </ListItem>
//                             </React.Fragment>
//                           ) : (
//                             <React.Fragment>
//                               <ListItem>
//                                 <ListItemIcon>
//                                   <Link
//                                     className={styles.linkto}
//                                     onClick={this.dismissPanel}
//                                     to="/"
//                                   >
//                                     <HomeIcon fontSize="default" />
//                                     DashBoard
//                                   </Link>
//                                 </ListItemIcon>
//                               </ListItem>
//                               <ListItem>
//                                 <ListItemIcon>
//                                   <Link
//                                     className={styles.linkto}
//                                     onClick={this.dismissPanel}
//                                     to={{
//                                       pathname: `/adminShareholdings`
//                                     }}
//                                   >
//                                     <PieChartIcon fontSize="default" />
//                                     Shareholdings
//                                   </Link>
//                                 </ListItemIcon>
//                               </ListItem>
//                               <ListItem>
//                                 <ListItemIcon>
//                                   <Link
//                                     className={styles.linkto}
//                                     onClick={this.dismissPanel}
//                                     to="/adminDocumentsandForms"
//                                   >
//                                     <DescriptionIcon fontSize="default" />
//                                     Documents and Forms
//                                   </Link>
//                                 </ListItemIcon>
//                               </ListItem>
//                               <ListItem>
//                                 <ListItemIcon>
//                                   <Link
//                                     className={styles.linkto}
//                                     onClick={this.dismissPanel}
//                                     to="/helpCenter"
//                                   >
//                                     <HelpIcon fontSize="default" />
//                                     HelpCenter
//                                   </Link>
//                                 </ListItemIcon>
//                               </ListItem>
//                               <ListItem>
//                                 <ListItemIcon>
//                                   <Link
//                                     className={styles.linkto}
//                                     onClick={this.dismissPanel}
//                                     to="/adminReportsHome"
//                                   >
//                                     <DescriptionIcon fontSize="default" />
//                                     Admin Reports
//                                   </Link>
//                                 </ListItemIcon>
//                               </ListItem>
//                               {/* <ListItem>

//                               </ListItem> */}
//                             </React.Fragment>
//                           )}
//                         </React.Fragment>
//                       </List>
//                     </Panel>
//                   </Paper>
//                 </Grid>
//               </Hidden>
//             </div>
//             <Hidden only={["lg", "md", "xl"]}>
//               <Grid item sm={12} xs={12}>
//                 <div
//                   className="row"
//                   style={{
//                     background: "#e0e0e0",
//                     margin: "-12px"
//                   }}
//                 >
//                   <div className="col-sm-12">
//                     <div className="alert" style={{ marginBottom: "0rem" }}>
//                       <p
//                         className="text-center"
//                         style={{
//                           margin: "auto!important",
//                           marginBottom: "0rem",
//                           paddingTop: "1px",
//                           paddingBottom: "15px"
//                         }}
//                       >
//                         <span className="text-danger">Need help? </span> Call
//                         484-840-1813 or{" "}
//                         <span className="text-danger">
//                           {" "}
//                           <a
//                             href="mailto:shareholderservices@wawa.com"
//                             className="text-danger"
//                           >
//                             {" "}
//                             Email Us{" "}
//                           </a>
//                         </span>
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </Grid>
//             </Hidden>
//             <Hidden only={["sm", "xs"]}>
//               <Grid item md={12} lg={12} xl={12}>
//                 <div
//                   className="row"
//                   style={{
//                     background: "#e0e0e0",
//                     margin: "-12px"
//                   }}
//                 >
//                   <div className="col-sm-12">
//                     <div className="alert" style={{ marginBottom: "0rem" }}>
//                       <p
//                         className="text-center"
//                         style={{
//                           margin: "auto!important",
//                           marginBottom: "0rem",
//                           paddingTop: "1px",
//                           paddingBottom: "15px"
//                         }}
//                       >
//                         <span className="text-danger">Need help? </span> Call
//                         484-840-1813 or{" "}
//                         <span className="text-danger">
//                           {" "}
//                           <a
//                             href="mailto:shareholderservices@wawa.com"
//                             className="text-danger"
//                           >
//                             {" "}
//                             Email Us{" "}
//                           </a>
//                         </span>
//                       </p>
//                       <a
//                         href={importURL}
//                         style={{
//                           float: "right",
//                           marginTop: "-36px",
//                           textDecoration: "none"
//                         }}
//                       >
//                         <ImportExportIcon /> Import Excel Data
//                       </a>
//                     </div>
//                   </div>
//                 </div>
//               </Grid>
//             </Hidden>
//             <Hidden only={["sm", "xs"]}>
//               <Grid
//                 item
//                 xl={2}
//                 lg={2}
//                 md={2}
//                 className={styles.container_lg_sideNavigation}
//               >
//                 <List component="nav">
//                   <React.Fragment>
//                     {this.state.isCurrentUserAdmin !== true ? (
//                       <React.Fragment>
//                         <ListItem>
//                           <ListItemIcon>
//                             <Link className={styles.linkto} to="/">
//                               <HomeIcon fontSize="default" />
//                               DashBoard
//                             </Link>
//                           </ListItemIcon>
//                         </ListItem>
//                         <ListItem>
//                           <ListItemIcon>
//                             <Link
//                               className={styles.linkto}
//                               to={{
//                                 pathname: `/myShareholdings`
//                               }}
//                             >
//                               <PieChartIcon fontSize="default" />
//                               Shareholdings
//                             </Link>
//                           </ListItemIcon>
//                         </ListItem>
//                         <ListItem>
//                           <ListItemIcon>
//                             <Link
//                               className={styles.linkto}
//                               to="/documentsandforms"
//                             >
//                               <DescriptionIcon fontSize="default" />
//                               Documents and Forms
//                             </Link>
//                           </ListItemIcon>
//                         </ListItem>
//                         <ListItem>
//                           <ListItemIcon>
//                             <Link className={styles.linkto} to="/helpCenter">
//                               <HelpIcon fontSize="default" />
//                               HelpCenter
//                             </Link>
//                           </ListItemIcon>
//                         </ListItem>
//                       </React.Fragment>
//                     ) : (
//                       <React.Fragment>
//                         <ListItem>
//                           <ListItemIcon>
//                             <Link className={styles.linkto} to="/">
//                               <HomeIcon fontSize="default" />
//                               DashBoard
//                             </Link>
//                           </ListItemIcon>
//                         </ListItem>
//                         <ListItem>
//                           <ListItemIcon>
//                             <Link
//                               className={styles.linkto}
//                               to={{
//                                 pathname: `/adminShareholdings`
//                               }}
//                             >
//                               <PieChartIcon fontSize="default" />
//                               Shareholdings
//                             </Link>
//                           </ListItemIcon>
//                         </ListItem>
//                         <ListItem>
//                           <ListItemIcon>
//                             <Link
//                               className={styles.linkto}
//                               to="/adminDocumentsandForms"
//                             >
//                               <DescriptionIcon fontSize="default" />
//                               Documents and Forms
//                             </Link>
//                           </ListItemIcon>
//                         </ListItem>
//                         <ListItem>
//                           <ListItemIcon>
//                             <Link className={styles.linkto} to="/helpCenter">
//                               <HelpIcon fontSize="default" />
//                               HelpCenter
//                             </Link>
//                           </ListItemIcon>
//                         </ListItem>
//                         <ListItem>
//                           <ListItemIcon>
//                             <Link
//                               className={styles.linkto}
//                               to="/adminReportsHome"
//                             >
//                               <DescriptionIcon fontSize="default" />
//                               Admin Reports
//                             </Link>
//                           </ListItemIcon>
//                         </ListItem>
//                       </React.Fragment>
//                     )}
//                   </React.Fragment>
//                 </List>
//               </Grid>
//             </Hidden>
//             <Grid
//               item
//               xs={12}
//               sm={12}
//               md={10}
//               lg={10}
//               xl={10}
//               className={styles.container_lg_contentArea}
//               style={{ paddingRight: "0" }}
//             >
//               {this.state.isCurrentUserAdmin !== true ? (
//                 <Switch>
//                   <Route
//                     exact
//                     path="/"
//                     render={props => (
//                       <DashBoard
//                         properties={{
//                           tenentURL: this.state.tenentURL + this.siteURL,
//                           accountEmail: this.state.accountEmail
//                         }}
//                       />
//                     )}
//                   />
//                   <Route
//                     exact
//                     path="/myShareholdings"
//                     render={props => (
//                       <MyShareholdings
//                         properties={{
//                           tenentURL: this.state.tenentURL + this.siteURL,
//                           accountEmail: this.state.accountEmail,
//                           newWeb: this.state.newWeb
//                         }}
//                       />
//                     )}
//                   />
//                   <Route
//                     exact
//                     path="/documentsandforms"
//                     render={props => (
//                       <DocumentsandForms
//                         properties={{
//                           tenentURL: this.state.tenentURL + this.siteURL,
//                           accountEmail: this.state.accountEmail
//                         }}
//                       />
//                     )}
//                   />
//                   <Route
//                     exact
//                     path="/helpCenter"
//                     render={props => (
//                       <HelpCenter
//                         properties={{
//                           newWeb: this.state.newWeb,
//                           accountID: this.state.shareholderID,
//                           accountEmail: this.state.accountEmail,
//                           tenentURL: this.state.tenentURL,
//                           isCurrentUserAdmin: this.state.isCurrentUserAdmin,
//                           currentUserPermissions: ""
//                         }}
//                       />
//                     )}
//                   />
//                   <Route
//                     exact
//                     path="/myShareholdingsDetails/:accountID"
//                     render={props => (
//                       <MyShareholdingsDetails
//                         properties={{
//                           tenentURL: this.state.tenentURL + this.siteURL,
//                           accountEmail: this.state.accountEmail
//                         }}
//                       />
//                     )}
//                   />
//                 </Switch>
//               ) : (
//                 <Switch>
//                   <Route
//                     exact
//                     path="/"
//                     render={props => (
//                       <AdminDashBoard
//                         properties={{
//                           newWeb: this.state.newWeb,
//                           tenentURL: this.state.tenentURL + this.siteURL
//                         }}
//                       />
//                     )}
//                   />
//                   <Route
//                     exact
//                     path="/adminShareholdings"
//                     render={props => (
//                       <AdminShareholdings
//                         properties={{
//                           tenentURL: this.state.tenentURL + this.siteURL
//                         }}
//                       />
//                     )}
//                   />
//                   <Route
//                     exact
//                     path="/adminDocumentsandForms"
//                     render={props => (
//                       <AdmindocumentsandForms
//                         properties={{
//                           newWeb: this.state.newWeb,
//                           accountID: this.state.shareholderID,
//                           accountEmail: this.state.accountEmail,
//                           tenentURL: this.state.tenentURL,
//                           isCurrentUserAdmin: this.state.isCurrentUserAdmin
//                         }}
//                       />
//                     )}
//                   />
//                   <Route
//                     exact
//                     path="/helpCenter"
//                     render={props => (
//                       <HelpCenter
//                         properties={{
//                           newWeb: this.state.newWeb,
//                           accountID: this.state.shareholderID,
//                           accountEmail: this.state.accountEmail,
//                           tenentURL: this.state.tenentURL,
//                           isCurrentUserAdmin: this.state.isCurrentUserAdmin,
//                           currentUserPermissions: ""
//                         }}
//                       />
//                     )}
//                   />
//                   <Route
//                     exact
//                     path="/adminReportsHome"
//                     render={props => (
//                       <AdminReportsHome
//                         properties={{
//                           newWeb: this.state.newWeb,
//                           accountID: this.state.shareholderID,
//                           accountEmail: this.state.accountEmail,
//                           tenentURL: this.state.tenentURL + this.siteURL,
//                           isCurrentUserAdmin: this.state.isCurrentUserAdmin,
//                           currentUserPermissions: ""
//                         }}
//                       />
//                     )}
//                   />
//                   <Route
//                     exact
//                     path="/adminShareholdersDetails/:accountID"
//                     render={props => (
//                       <AdminShareholdersDetails
//                         properties={{
//                           tenentURL: this.state.tenentURL + this.siteURL,
//                           newWeb: this.state.newWeb
//                         }}
//                       />
//                     )}
//                   />
//                   )
//                 </Switch>
//               )}
//             </Grid>
//           </Router>
//         </Grid>
//       </ThemeProvider>
//     );
//     return _html;
//   };

//   protected sendEmail = async () => {
//     let addressString: string = await sp.utility.getCurrentUserEmailAddresses();
//     // sp.web.currentUser.get().then((r: CurrentUser) => {
//     //   this.sendEmail(r['Title']);
//     // });
//     await sp.utility.sendEmail({
//       To: ["sa_PaleruR1@dev.wawashareholderportal.com"],
//       Subject: "This email is about...",
//       Body: "Here is the body. <br/>MY Name <br/> <b>It supports html</b>",
//       AdditionalHeaders: {
//         "content-type": "text/html"
//       }
//     });
//   };

//   public render(): React.ReactElement<IShareHolderPortalProps> {
//     jQuery("#workbenchPageContent").attr("style", "max-width:100%!important");
//     jQuery(".SPCanvas-canvas").attr("style", "max-width:100%!important");
//     jQuery(".CanvasZone").attr("style", "max-width:100%!important");

//     return (
//       <div className={styles.shareHolderPortal}>
//         <div className={styles.root}>
//           {this.state.shareholderID !== null ? (
//             this.state.isCurrentUserAdmin === true ? (
//               <React.Fragment> {this.loadHTML()} </React.Fragment>
//             ) : this.state.shareholdingCollection.length > 0 ? (
//               <React.Fragment> {this.loadHTML()} </React.Fragment>
//             ) : (
//               <React.Fragment>
//                 <div className="container">
//                   <div
//                     className="row"
//                     style={{ clear: "both", marginTop: "25px" }}
//                   ></div>
//                   <div className="alert alert-danger">
//                     <h4 style={{ margin: "auto", display: "block" }}>
//                       <strong>Error!</strong> Something Went Wrong please
//                       conatact Wawa Shareholder Portal Admin Office
//                     </h4>
//                   </div>
//                 </div>
//               </React.Fragment>
//             )
//           ) : (
//             <div className="conatiner">
//               <img
//                 src={
//                   this.props.siteurl + "/SiteAssets/shareholders/loading.gif"
//                 }
//                 //  "https://wawadev.sharepoint.com/sites/RatnaDev/SiteAssets/shareholders/loading.gif"
//                 style={{ margin: "auto", display: "block", padding: "25px" }}
//                 className="resposive"
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }
// }
