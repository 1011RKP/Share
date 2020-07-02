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
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import SearchIcon from "@material-ui/icons/Search";
import ViewListIcon from "@material-ui/icons/ViewList";
import { Web } from "@pnp/sp";
import * as _ from "lodash";
import * as React from "react";
import Moment from "react-moment";
import { HashRouter as Router, Route, Switch, NavLink } from "react-router-dom";//Link
import { MyShareholdings } from "../shareholders/MyShareholdings";
import { MyShareholdingsDetails } from "../shareholders/MyShareholdingsDetails";
import styles from "./dashboard.module.scss";

export class DashBoard extends React.Component<any, any> {
  public constructor(props: any, state: any) {
    super(props);
    this.state = {
      eventCollection: [],
      DocCollection: [],
      announcementsCollection: [],
      shareholdingsCollection: [],
      stockDistributions: [],
      tenentURL: this.props.properties.tenentURL,
      accountEmail: this.props.properties.accountEmail,
      totalSharesOwned: 0,
      totalOptions:0,
      sortShareholderID: "NA", //desc
      isOptionsExist:[],
      sortShares: "NA",
      sortOptions: "NA"
    };
  }

  public componentDidMount() {
    if (this.state.accountEmail !== null) {
      let newWeb = new Web(this.state.tenentURL);
      this.getShareholdings(newWeb);
      this.getEvents(newWeb);
      this.getAnnouncements(newWeb);
      this.getShareholdingStockDistributions(newWeb);
      this.getDocuments(newWeb);
    }
  }

  public getShareholdings = newWeb => {
    newWeb.lists
      .getByTitle("Shareholdings")
      .items.select(
        "ID",
        "Title",
        "shares",
        "options",
        "shareholderID",
        "shareholderEmail",
        "unrestrictedShares",
        "restrictedShares",
        "vestedOptions",
        "unvestedOptions",
        "aceessType"
      )
      .orderBy("Title", true)
      .filter("shareholderEmail eq '" + this.state.accountEmail + "'")
      .get()
      .then(d => {
        if (d.length > 0) {
          let unique = [];let isOptionsExist = [];
          unique = _.uniqBy(d, e => {
            return e.shareholderID;
          });
          isOptionsExist =  _.filter(d, (val) => {
            return val.options === "0";
          });
          let totalShares = 0;
          let totalOptions = 0;
          this.setState(prevState => ({
            ...prevState,
            shareholdingsCollection: unique,
            isOptionsExist: isOptionsExist
          }));
          for (let index = 0; index < unique.length; index++) {
            totalShares += parseFloat(unique[index].shares.replace(/,/g, ""));
            totalOptions += parseFloat(unique[index].options.replace(/,/g, ""));
          }
          // let s = (totalShares.toLocaleString(undefined,{ minimumFractionDigits: 2 }));
          // let o = (totalOptions.toLocaleString(undefined,{ minimumFractionDigits: 2 }));
          //  s = new Intl.NumberFormat("en", {
          //   style: "decimal",
          //   useGrouping: true
          // }).format(Number(s));
          //  o = new Intl.NumberFormat("en", {
          //   style: "decimal",
          //   useGrouping: true
          // }).format(Number(o));



          this.setState(prevState => ({
            ...prevState,
            totalSharesOwned:totalShares.toLocaleString(undefined,{ minimumFractionDigits: 2 }),
            totalOptions:totalOptions.toLocaleString(undefined,{ minimumFractionDigits: 2 })
          }));
        }
        else {
          this.setState(prevState => ({
            ...prevState,
            shareholdingsCollection: []
          }));
        }
        console.log(this.state);
      })
      .catch(e => {
        console.error(e);
      });
  }

  public getAnnouncements = (newWeb: any) => {
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

  public getEvents = newWeb => {
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

  public getShareholdingStockDistributions = newWeb => {
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

  public getDocuments = newWeb => {
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
      .top(10)
      .get()
      .then(d => {
        console.log(d);
        if (d.length > 0) {
          this.setState(prevState => ({
            ...prevState,
            DocCollection: d
          }));
        }
      });
  }

  public handleSort = (sortType, column) => {
    let column_Value = column; let sortCol = this.state.shareholdingsCollection;
    switch (column_Value) {
      case "shareholderID":
        if (sortType === "asc" || sortType === "NA") {
          //var shareholdingsCol = this.state.shareholdingsCollection;
          sortCol = _.orderBy(sortCol, column, sortType);
          this.setState({
            shareholdingsCollection: sortCol,
            sortShareholderID: "desc"
          });
        } else {
          //var shareholdingsCol = this.state.shareholdingsCollection;
          sortCol = _.orderBy(sortCol, column, sortType);
          this.setState({
            shareholdingsCollection: sortCol,
            sortShareholderID: "asc"
          });
        }
        break;
        case "options":
          if (sortType === "asc" || sortType === "NA") {
            //var sortCol = this.state.shareholdingsCollection;
            sortCol = _.orderBy(sortCol, column, sortType);
            this.setState({
              shareholdingsCollection: sortCol,
              sortOptions: "desc"
            });
          } else {
            //var sortCol = this.state.shareholdingsCollection;
            sortCol = _.orderBy(sortCol, column, sortType);
            this.setState({
              shareholdingsCollection: sortCol,
              sortOptions: "asc"
            });
          }
          break;
      case "shares":
        if (sortType === "asc" || sortType === "NA") {
          //var sortCol = this.state.shareholdingsCollection;
          sortCol = _.orderBy(sortCol, column, sortType);
          this.setState({
            shareholdingsCollection: sortCol,
            sortShares: "desc"
          });
        } else {
          //var sortCol = this.state.shareholdingsCollection;
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
        {this.state.accountEmail ? (
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
                      <div className={`${styles.cardHead_General} card-header`}>
                        <h6>Shareholdings</h6>
                      </div>
                      <div className="row-fluid" style={{ marginTop: "10px" }}>
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
                                    {this.state.sortShareholderID === "asc" ? (
                                      <ArrowDownwardIcon />
                                    ) : null}
                                    {this.state.sortShareholderID === "desc" ? (
                                      <ArrowUpwardIcon />
                                    ) : null}
                                    Account ID
                                  </a>
                                </TableCell>
                                {this.state.isOptionsExist.length === 0 ? (
                                  <React.Fragment>
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
                                  </React.Fragment>
                                ) : null}
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
                                            to={`/myShareholdingsDetails/${shareholdings.shareholderID}`}
                                          >
                                            <SearchIcon fontSize="default" />
                                            View Details
                                          </NavLink>
                                        </TableCell>
                                        <TableCell align="left">
                                          {shareholdings.shareholderID}
                                        </TableCell>
                                        {this.state.isOptionsExist.length ===
                                        0 ? (
                                          <React.Fragment>
                                            <TableCell align="right">
                                              {/* {shareholdings.options === 0
                                                ? "-"
                                                : shareholdings.options
                                                    .toString()
                                                    .slice(
                                                      0,
                                                      shareholdings.options
                                                        .toString()
                                                        .indexOf(".") + 3
                                                    )} */}
                                              {shareholdings.options === 0
                                                ? "-"
                                                : (shareholdings.vestedOptions + shareholdings.unvestedOptions).toLocaleString(undefined,{ minimumFractionDigits: 2 })}
                                            </TableCell>
                                          </React.Fragment>
                                        ) : null}
                                        <TableCell align="right">
                                          {(shareholdings.unrestrictedShares + shareholdings.restrictedShares).toLocaleString(undefined,{ minimumFractionDigits: 2 })}
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
                                    to="/myShareholdings"
                                  >
                                    <ViewListIcon fontSize="default" />
                                    View All Shareholdings
                                  </NavLink>
                                </TableCell>
                                <TableCell component="th" align="left" scope="row">
                                  {this.state.shareholdingsCollection.length >=
                                  2 ? (
                                    <React.Fragment>
                                      Showing 1 to 3 of{" "}
                                      {
                                        this.state.shareholdingsCollection
                                          .length
                                      }
                                    </React.Fragment>
                                  ) : (
                                    <React.Fragment>Showing All</React.Fragment>
                                  )}
                                </TableCell>
                                {this.state.isOptionsExist.length === 0 ? (
                                  <React.Fragment>
                                    <TableCell component="th" align="right" scope="row">
                                      Total Options Owned:
                                      {this.state.totalOptions}
                                    </TableCell>
                                  </React.Fragment>
                                ) : null}
                                <TableCell component="th" align="right" scope="row">
                                  Total Shares Owned:
                                  {this.state.totalSharesOwned}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                          <Switch>
                            <Route
                              exact
                              path="/myShareholdings"
                              render={props => (
                                <MyShareholdings
                                  properties={{
                                    tenentURL: this.state.tenentURL,
                                    shareholderEmail: this.state.accountEmail
                                  }}
                                />
                              )}
                            />
                            <Route
                              exact
                              path="/myShareholdingsDetails/:shareholderID"
                              render={props => (
                                <MyShareholdingsDetails
                                  properties={{
                                    tenentURL: this.state.tenentURL,
                                    shareholderEmail: this.state.accountEmail
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
                      <div className={`${styles.cardHead_General} card-header`}>
                        <h6>Current and Upcoming Events</h6>
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
                                {/* style={{ margin: "0", padding: "5px" }} */}
                                <p style={{ margin: "0", padding: "5px 0px" }}>
                                  <strong>
                                    <Moment format="dddd, MMMM DD, YYYY">
                                      {event.date}
                                    </Moment>
                                  </strong>
                                </p>
                              </div>
                              <div className="row">
                                <p style={{ margin: "0", padding: "5px 0px" }}>
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
                      <div className={`${styles.cardHead_General} card-header`}>
                        <h6>Announcements</h6>
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
                                    style={{ margin: "0", padding: "5px 0px" }}
                                  >
                                    <strong>
                                      {announcements.Title}
                                    </strong>
                                  </p>
                                </div>
                                <div className="row">
                                  <p
                                    style={{ margin: "0", padding: "5px 0px" }}
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
                      <div className={`${styles.cardHead_General} card-header`}>
                        <h6>Recently Uploaded Documents</h6>
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
                              {this.state.DocCollection.map((doc, index) => {
                                return (
                                  <TableRow key={doc.ID}>
                                    <TableCell component="th" scope="doc">
                                      <Link
                                        className={styles.docLink}
                                        target="_blank"
                                        // href={doc.EncodedAbsUrl}
                                        onClick={()=>{
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
                                    <TableCell align="right">
                                      <Moment format="MMMM Do, YYYY">
                                        {doc.Created}
                                      </Moment>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
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
                      <div className={`${styles.cardHead_General} card-header`}>
                        <h6>Per Share Stock Distributions & Valuations</h6>
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
                                <TableCell className={styles.stockTbleHeadCell}>
                                  {" "}
                                  Event
                                </TableCell>
                                <TableCell className={styles.stockTbleHeadCell}>
                                  {" "}
                                  Quarter
                                </TableCell>
                                <TableCell className={styles.stockTbleHeadCell}>
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
                                    <TableCell component="th" scope="doc">
                                      {stock.Title}
                                    </TableCell>
                                    <TableCell component="th" scope="doc">
                                      {stock.Quarter}
                                    </TableCell>
                                    <TableCell component="th" scope="doc">
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
        ) : null}
      </div>
    );
  }
}
