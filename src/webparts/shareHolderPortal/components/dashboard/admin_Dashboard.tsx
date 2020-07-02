import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Link
} from "@material-ui/core";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ImportExportIcon from "@material-ui/icons/ImportExport";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import SearchIcon from "@material-ui/icons/Search";
import ViewListIcon from "@material-ui/icons/ViewList";
import { Web } from "@pnp/sp";
import * as _ from "lodash";
import * as React from "react";
import Moment from "react-moment";
import { HashRouter as Router, NavLink, Route, Switch } from "react-router-dom";//Link
import { AdminShareholdings } from "../shareholders/Admins/Admin_Shareholdings";
import styles from "./dashboard.module.scss";
import { devURL, importURL } from "../common/common";
import { AdminShareholdersDetails } from "../shareholders/Admins/Admin_ShareholdersDetails";

export class AdminDashBoard extends React.Component<any, any> {
  public constructor(props: any, state: any) {
    super(props);
    this.handleSort = this.handleSort.bind(this);
    this.getDocuments = this.getDocuments.bind(this);
    this.getEvents = this.getEvents.bind(this);
    this.getAnnouncements = this.getAnnouncements.bind(this);
    this.getShareholdings = this.getShareholdings.bind(this);
    this.getShareholdingStockDistributions = this.getShareholdingStockDistributions.bind(
      this
    );
    this.state = {
      properties: this.props.properties,
      totalSharesOwned: 0,
      totalOptions:0,
      shareholdingsCollection: [],
      shareholdingsCollection_filter: [],
      eventCollection: [],
      DocCollection: [],
      announcementsCollection: [],
      stockDistributions: [],
      tenentURL: this.props.properties.tenentURL,
      currentUpcomingEvents_Link:
        this.props.properties.tenentURL + "/ShareholdingEvents/Allitemsg.aspx",
      announcements_Link:
        this.props.properties.tenentURL +
        "/ShareholdingAnnouncements/Allitemsg.aspx",
      communityDocuments_Link:
        this.props.properties.tenentURL +
        "/CommunityDocuments/Forms/AllItems.aspx",
      stockDistributions_Link:
        this.props.properties.tenentURL +
        "/ShareholdingStockDistributions/Allitemsg.aspx",
        shareholderDocuments: this.props.properties.tenentURL.substring(0, this.props.properties.tenentURL.indexOf("sites/") - 1) + "/sites/"+ importURL +"/SitePages/Import.aspx",
      sortShareholderID: "NA", //desc
      sortShares: "NA",
      sortOptions: "NA"
    };
  }
  //siteURL.substring(0, siteURL.indexOf("sites/") - 1)
  public componentDidMount() {
    if (this.state.properties.newWeb) {
      let newWeb = new Web(this.state.tenentURL);
      this.getShareholdings(newWeb);
      this.getEvents(newWeb);
      this.getAnnouncements(newWeb);
      this.getShareholdingStockDistributions(newWeb);
      this.getDocuments(newWeb);
    }
  }

  public getShareholdings(newWeb): any {
    newWeb.lists
      .getByTitle("Shareholdings")
      .items.select(
        "Title",
        "shareholderID",
        "shares",
        "ID",
        "shareholderEmail",
        "options",
        "unvestedOptions",
        "vestedOptions",
        "unrestrictedShares",
        "restrictedShares",
        "ShareholderType"
      )
      .orderBy("ID", true)
      .filter("ShareholderType eq 'Shareholder'")
      .top(500)
      .get()
      .then(d => {
        if (d.length > 0) {
          let unique = [];
          let shareholdingsCollection = [];
          let totalShares = 0;
          let totalOptions = 0;
          unique = _.uniqBy(d, e => {
            return e.shareholderID;
          });
          for (let index = 0; index < unique.length; index++) {
            let obj = {
              ID: unique[index].ID,
              Title: unique[index].Title,
              shareholderID: unique[index].shareholderID,
              shareholderEmail: unique[index].shareholderEmail,
              ShareholderType: unique[index].ShareholderType,
              unrestrictedShares: unique[index].unrestrictedShares,
              restrictedShares: unique[index].restrictedShares,
              vestedOptions: unique[index].vestedOptions,
              unvestedOptions: unique[index].unvestedOptions,
              shares: parseFloat(
                unique[index].unrestrictedShares +
                  unique[index].restrictedShares
              ),
              options: parseFloat(
                unique[index].vestedOptions + unique[index].unvestedOptions
              )
            };
            totalShares += parseFloat(unique[index].shares.replace(/,/g, ""));
            totalOptions += parseFloat(unique[index].options.replace(/,/g, ""));
            shareholdingsCollection.push(obj);
          }

          // let s = new Intl.NumberFormat("en", {
          //   style: "decimal",
          //   useGrouping: true
          // }).format(Number(totalShares));
          // let o = new Intl.NumberFormat("en", {
          //   style: "decimal",
          //   useGrouping: true
          // }).format(Number(totalOptions));

          //  s = (totalShares.toFixed(2));
          //  o = (totalOptions.toFixed(2));

        //   let s = totalShares.toLocaleString(undefined,{ minimumFractionDigits: 2 });
        //   let o = totalOptions.toLocaleString(undefined,{ minimumFractionDigits: 2 });

        //   s = new Intl.NumberFormat("en", {
        //    style: "decimal",
        //    useGrouping: true
        //  }).format(Number(s));
        //  o = new Intl.NumberFormat("en", {
        //    style: "decimal",
        //    useGrouping: true
        //  }).format(Number(o));

          this.setState(prevState => ({
            ...prevState,
            shareholdingsCollection: shareholdingsCollection,
            shareholdingsCollection_filter: shareholdingsCollection,
            totalSharesOwned: totalShares.toLocaleString(undefined,{ minimumFractionDigits: 2 }),
            totalOptions: totalOptions.toLocaleString(undefined,{ minimumFractionDigits: 2 })
          }));
        }
        else {
          this.setState(prevState => ({
            ...prevState,
            shareholdingsCollection: [],
            shareholdingsCollection_filter: []
          }));
        }
      });
  }

  public getAnnouncements(newWeb): any {
    newWeb.lists
      .getByTitle("Shareholding Announcements")
      .items.select(
        "Title",
        "date",
        "details",
        "ID",
        "Expire",
        "Modified",
        "Created"
      )
      .filter("Expire eq 'No'")
      .orderBy("date", false)
      .get()
      .then(d => {
        if (d.length > 0) {
          this.setState(prevState => ({
            ...prevState,
            announcementsCollection: d
          }));
        }
      });
  }

  public getEvents(newWeb) {
    newWeb.lists
      .getByTitle("Shareholding Events")
      .items.select(
        "Title",
        "date",
        "details",
        "ID",
        "Expire",
        "Modified",
        "Created"
      )
      .filter("Expire eq 'No'")
      .orderBy("date", false)
      .get()
      .then(d => {
        if (d.length > 0) {
          this.setState(prevState => ({
            ...prevState,
            eventCollection: d
          }));
        }
      });
  }

  public getShareholdingStockDistributions(newWeb) {
    newWeb.lists
      .getByTitle("Shareholding Stock Distributions")
      .items.select("Title", "Quarter", "YTD", "ID", "Date")
      .orderBy("Date", false)
      .get()
      .then(d => {
        if (d.length > 0) {
          this.setState(prevState => ({
            ...prevState,
            stockDistributions: d
          }));
        }
      });
  }

  public getDocuments(newWeb): any {
    newWeb.lists
      .getByTitle("Community Documents")
      .items.select(
        "Title",
        "BaseName",
        "EncodedAbsUrl",
        "ID",
        "Modified",
        "Created"
      )
      .orderBy("Created", false)
      //.filter("AccountID eq '" + id + "'")
      .top(10)
      .get()
      .then(d => {
        if (d.length > 0) {
          console.log(d);
          this.setState(prevState => ({
            ...prevState,
            DocCollection: d
          }));
        }
      });
  }

  public handleSort(sortType, column) {
    let column_Value = column;
    let sortCol = this.state.shareholdingsCollection;
    switch (column_Value) {
      case "shareholderID":
        if (sortType === "asc" || sortType === "NA") {
          sortCol = _.orderBy(sortCol, column, sortType);
          this.setState({
            shareholdingsCollection: sortCol,
            sortShareholderID: "desc"
          });
        } else {
          sortCol = _.orderBy(sortCol, column, sortType);
          this.setState({
            shareholdingsCollection: sortCol,
            sortShareholderID: "asc"
          });
        }
        break;
      case "options":
        if (sortType === "asc" || sortType === "NA") {
          sortCol = _.orderBy(sortCol, column, sortType);
          this.setState({
            shareholdingsCollection: sortCol,
            sortOptions: "desc"
          });
        } else {
          sortCol = _.orderBy(sortCol, column, sortType);
          this.setState({
            shareholdingsCollection: sortCol,
            sortOptions: "asc"
          });
        }
        break;
      case "shares":
        if (sortType === "asc" || sortType === "NA") {
          sortCol = _.orderBy(sortCol, column, sortType);
          this.setState({
            shareholdingsCollection: sortCol,
            sortShares: "desc"
          });
        } else {
          sortCol = _.orderBy(sortCol, column, sortType);
          this.setState({
            shareholdingsCollection: sortCol,
            sortShares: "asc"
          });
        }
        break;
    }
  }

  public render(): React.ReactElement<any> {
    return (
      <div className={styles.dashboard}>
        <div className={styles.contentHead}>
          <h2>Dashboard</h2>
        </div>
        {this.state.properties ? (
          this.state.shareholdingsCollection.length > 0 ? (
            <React.Fragment>
              <div
                className="row-fluid"
                style={{ padding: "20px", overflow: "hidden" }}
              >
                <div
                  className="row"
                  style={{ paddingTop: "10px", marginTop: "10px" }}
                >
                  <div className="col-md-12">
                    <div className="card">
                      <div className={`card-body`}>
                        <div
                          className={`${styles.cardHead_General} card-header`}
                        >
                          <Link
                            className={styles.adminOnlyLinks}
                            target="_blank"
                            onClick={() => {
                              window.open(
                                this.state.shareholderDocuments
                              );
                              return false;
                            }}
                          >
                            <h6 style={{ marginBottom: "0px!important" }}>
                              <ImportExportIcon  />{" "}
                              Shareholdings
                            </h6>
                          </Link>
                        </div>
                        <div
                          className="row-fluid"
                          style={{ marginTop: "10px" }}
                        >
                          <Router>
                            <Table style={{ border: "1px solid #e0e0e0" }}>
                              <colgroup>
                                <col width="55%" />
                                <col width="15%" />
                                <col width="15%" />
                                <col width="15%" />
                              </colgroup>
                              <TableHead style={{ background: "#e0e0e0" }}>
                                <TableRow>
                                  <TableCell className={styles.tblCell}>
                                    Shareholding Name
                                  </TableCell>
                                  <TableCell
                                    className={styles.tblCell}
                                    align="left"
                                  >
                                    <a
                                      style={{ cursor: "pointer" }}
                                      onClick={e => {
                                        this.handleSort(
                                          this.state.sortShareholderID,
                                          "shareholderID"
                                        );
                                      }}
                                    >
                                      {this.state.sortShareholderID ===
                                      "asc" ? (
                                        <ArrowDownwardIcon />
                                      ) : null}
                                      {this.state.sortShareholderID ===
                                      "desc" ? (
                                        <ArrowUpwardIcon />
                                      ) : null}
                                      Account ID
                                    </a>
                                  </TableCell>
                                  <TableCell
                                    className={styles.tblCell}
                                    align="right"
                                  >
                                    <a
                                      style={{ cursor: "pointer" }}
                                      onClick={e => {
                                        this.handleSort(
                                          this.state.sortOptions,
                                          "options"
                                        );
                                      }}
                                    >
                                      {this.state.sortOptions === "asc" ? (
                                        <ArrowDownwardIcon />
                                      ) : null}
                                      {this.state.sortOptions === "desc" ? (
                                        <ArrowUpwardIcon />
                                      ) : null}
                                      Options
                                    </a>
                                  </TableCell>
                                  <TableCell
                                    className={styles.tblCell}
                                    align="right"
                                  >
                                    <a
                                      style={{ cursor: "pointer" }}
                                      onClick={e => {
                                        this.handleSort(
                                          this.state.sortShares,
                                          "shares"
                                        );
                                      }}
                                    >
                                      {this.state.sortShares === "asc" ? (
                                        <ArrowDownwardIcon />
                                      ) : null}
                                      {this.state.sortShares === "desc" ? (
                                        <ArrowUpwardIcon />
                                      ) : null}
                                      Shares
                                    </a>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {this.state.shareholdingsCollection.map(
                                  (shareholdings, index) => {
                                    if (index <= 2)
                                      return (
                                        <TableRow key={shareholdings.ID}>
                                          <TableCell component="th" scope="row">
                                            {shareholdings.Title}
                                            <br />
                                            <NavLink
                                              style={{
                                                color: "#dc4848",
                                                cursor: "pointer",
                                                padding: "5px;"
                                              }}
                                              to={`/adminShareholdersDetails/${shareholdings.shareholderID}`}
                                            >
                                              <SearchIcon fontSize="default" />
                                              View Details
                                            </NavLink>
                                          </TableCell>
                                          <TableCell align="left">
                                            {shareholdings.shareholderID}
                                          </TableCell>
                                          <TableCell align="right">
                                            {shareholdings.options === 0
                                              ? "-"
                                              : shareholdings.options.toLocaleString(undefined,{ minimumFractionDigits: 2 })}
                                          </TableCell>
                                          <TableCell align="right">
                                            {shareholdings.shares.toLocaleString(undefined,{ minimumFractionDigits: 2 })}
                                          </TableCell>
                                        </TableRow>
                                      );
                                  }
                                )}
                                <TableRow key="01">
                                  <TableCell
                                    component="th"
                                    scope="row"
                                    align="left"
                                  >
                                    <NavLink
                                      style={{
                                        color: "#dc4848",
                                        cursor: "pointer",
                                        padding: "5px;"
                                      }}
                                      to="/adminShareholdings"
                                    >
                                      <ViewListIcon fontSize="default" />
                                      View All Shareholdings
                                    </NavLink>
                                  </TableCell>
                                  <TableCell
                                    component="th"
                                    align="left"
                                    scope="row"
                                  >
                                    {this.state.shareholdingsCollection
                                      .length >= 2 ? (
                                      <React.Fragment>
                                        Showing 1 to 3 of{" "}
                                        {
                                          this.state.shareholdingsCollection
                                            .length
                                        }
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment>
                                        Showing All
                                      </React.Fragment>
                                    )}
                                  </TableCell>
                                  <TableCell
                                    component="th"
                                    align="right"
                                    scope="row"
                                  >
                                    Total Options Owned:
                                    {this.state.totalOptions}
                                  </TableCell>
                                  <TableCell
                                    component="th"
                                    align="right"
                                    scope="row"
                                  >
                                    Total Shares Owned:
                                    {this.state.totalSharesOwned}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                            <Switch>
                              <Route
                                exact
                                path="/adminShareholdings"
                                render={props => (
                                  <AdminShareholdings
                                    properties={{
                                      tenentURL: this.state.tenentURL
                                    }}
                                  />
                                )}
                              />
                              <Route
                                exact
                                path="/myShareholdingsDetails/:shareholderID"
                                render={props => (
                                  <AdminShareholdersDetails
                                    properties={{
                                      tenentURL: this.state.tenentURL
                                    }}
                                  />
                                )}
                              />
                            </Switch>
                          </Router>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="row"
                  style={{ paddingTop: "10px", marginTop: "10px" }}
                >
                  <div className="col-md-6">
                    <div className="card">
                      <div className={`card-body`}>
                        <div
                          className={`${styles.cardHead_General} card-header`}
                        >
                          <Link
                            className={styles.adminOnlyLinks}
                            target="_blank"
                            onClick={() => {
                              window.open(
                                this.state.currentUpcomingEvents_Link
                              );
                              return false;
                            }}
                          >
                            <h6 style={{ marginBottom: "0px!important" }}>
                              <NoteAddIcon style={{ marginBottom: "5px" }} />{" "}
                              Current and Upcoming Events
                            </h6>
                          </Link>
                        </div>
                        <div
                          className="row-fluid"
                          style={{
                            marginTop: "10px",
                            maxHeight: "250px",
                            overflowY: "auto"
                          }}
                        >
                          {this.state.eventCollection.map(event => {
                            return (
                              <div className="col-md-12 border-bottom border-secoundry">
                                <div className="row">
                                  <p
                                    style={{
                                      margin: "0",
                                      padding: "5px 0px"
                                    }}
                                  >
                                    <strong>
                                      <Moment format="dddd, MMMM DD, YYYY">
                                        {event.date}
                                      </Moment>
                                    </strong>
                                  </p>
                                </div>
                                <div className="row">
                                  <p
                                    style={{
                                      margin: "0",
                                      padding: "5px 0px"
                                    }}
                                  >
                                    <em> {event.Title}</em>
                                  </p>
                                </div>
                                <div
                                  className="row"
                                  style={{ paddingRight: "5px 0px" }}
                                >
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: event.details
                                    }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card">
                      <div className={`card-body`}>
                        <div
                          className={`${styles.cardHead_General} card-header`}
                        >
                          <Link
                            className={styles.adminOnlyLinks}
                            target="_blank"
                            onClick={() => {
                              window.open(this.state.announcements_Link);
                              return false;
                            }}
                          >
                            <h6 style={{ marginBottom: "0px!important" }}>
                              <NoteAddIcon style={{ marginBottom: "5px" }} />{" "}
                              Announcements
                            </h6>
                          </Link>
                        </div>
                        <div
                          className="row-fluid"
                          style={{
                            marginTop: "10px",
                            maxHeight: "250px",
                            overflowY: "auto"
                          }}
                        >
                          {this.state.announcementsCollection.map(
                            announcements => {
                              return (
                                <div className="col-md-12 border-bottom border-secoundry">
                                  <div className="row">
                                    {/* style={{ margin: "0", padding: "5px" }} */}
                                    <p
                                      style={{
                                        margin: "0",
                                        padding: "5px 0px"
                                      }}
                                    >
                                      <strong> {announcements.Title}</strong>
                                    </p>
                                  </div>
                                  <div className="row">
                                    <p
                                      style={{
                                        margin: "0",
                                        padding: "5px 0px"
                                      }}
                                    >
                                      <em>
                                        <Moment format="dddd, MMMM Do, YYYY">
                                          {announcements.date}
                                        </Moment>
                                      </em>
                                    </p>
                                  </div>
                                  <div
                                    className="row"
                                    style={{ paddingRight: "5px 0px" }}
                                  >
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: announcements.details
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="row"
                  style={{ paddingTop: "10px", marginTop: "10px" }}
                >
                  <div className="col-md-6">
                    <div className="card">
                      <div className={`card-body`}>
                        <div
                          className={`${styles.cardHead_General} card-header`}
                        >
                          <Link
                            className={styles.adminOnlyLinks}
                            target="_blank"
                            onClick={() => {
                              window.open(this.state.communityDocuments_Link);
                              return false;
                            }}
                          >
                            <h6 style={{ marginBottom: "0px!important" }}>
                              <NoteAddIcon style={{ marginBottom: "5px" }} />{" "}
                              Recently Uploaded Documents
                            </h6>
                          </Link>
                        </div>
                        <div
                          className="row-fluid"
                          style={{
                            marginTop: "10px",
                            maxHeight: "250px",
                            overflowY: "auto"
                          }}
                        >
                          <Paper>
                            <Table aria-label="simple table">
                              <TableBody>
                                {this.state.DocCollection.map(doc => (
                                  <TableRow key={doc.ID}>
                                    <TableCell scope="td">
                                      <Link
                                        className={styles.docLink}
                                        target="_blank"
                                        //href={doc.EncodedAbsUrl}
                                        onClick={() => {
                                          window.open(doc.EncodedAbsUrl);
                                          return false;
                                        }}
                                      >
                                        <FontAwesomeIcon
                                          style={{
                                            marginLeft: "3px",
                                            color: "#dc4848",
                                            fontSize: "20px"
                                          }}
                                          icon={faFilePdf}
                                        />{" "}
                                        {doc.BaseName}
                                      </Link>
                                      {/* <a
                                        className={styles.docLink}
                                        target="_blank"
                                        href={doc.EncodedAbsUrl}
                                      >
                                        <FontAwesomeIcon
                                          style={{
                                            marginLeft: "3px",
                                            color: "#dc4848",
                                            fontSize: "20px"
                                          }}
                                          icon={faFilePdf}
                                        />{" "}
                                        {doc.BaseName}
                                      </a> */}
                                    </TableCell>
                                    <TableCell align="right" colSpan={1}>
                                      <Moment format="MMM Do, YYYY">
                                        {doc.Created}
                                      </Moment>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Paper>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card">
                      <div className={`card-body`}>
                        <div
                          className={`${styles.cardHead_General} card-header`}
                        >
                          <Link
                            className={styles.adminOnlyLinks}
                            onClick={() => {
                              window.open(this.state.stockDistributions_Link);
                              return false;
                            }}
                            target="_blank"
                          >
                            <h6 style={{ marginBottom: "0px!important" }}>
                              <NoteAddIcon style={{ marginBottom: "5px" }} />{" "}
                              Per Share Stock Distributions & Valuations
                            </h6>
                          </Link>
                        </div>
                        <div
                          className="row-fluid"
                          style={{
                            marginTop: "10px",
                            maxHeight: "250px",
                            overflowY: "auto"
                          }}
                        >
                          <Paper>
                            <Table style={{ border: "1px solid #e0e0e0" }}>
                              <TableHead>
                                <TableRow
                                  style={{
                                    backgroundColor: "#000",
                                    color: "#fff"
                                  }}
                                >
                                  <TableCell
                                    className={styles.stockTbleHeadCell}
                                  >
                                    {" "}
                                    Event
                                  </TableCell>
                                  <TableCell
                                    className={styles.stockTbleHeadCell}
                                  >
                                    {" "}
                                    Quarter
                                  </TableCell>
                                  <TableCell
                                    className={styles.stockTbleHeadCell}
                                  >
                                    {" "}
                                    YTD
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {this.state.stockDistributions.map(
                                  (stock, index) => (
                                    <TableRow
                                      key={stock.ID}
                                      style={{
                                        background:
                                          index % 2 ? "#e0e0e0" : "#fafafa"
                                      }}
                                    >
                                      <TableCell
                                        className={styles.stockTbleCell}
                                        component="th"
                                        scope="doc"
                                      >
                                        {stock.Title}
                                      </TableCell>
                                      <TableCell
                                        className={styles.stockTbleCell}
                                        component="th"
                                        scope="doc"
                                      >
                                        {stock.Quarter}
                                      </TableCell>
                                      <TableCell
                                        className={styles.stockTbleCell}
                                        component="th"
                                        scope="doc"
                                      >
                                        {stock.YTD}
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                              </TableBody>
                            </Table>
                          </Paper>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ) : null
        ) : null}
      </div>
    );
  }
}
