import {
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField
} from "@material-ui/core";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import SearchIcon from "@material-ui/icons/Search";
import { Web } from "@pnp/pnpjs";
import * as _ from "lodash";
import * as React from "react";
import { HashRouter as Router, Link, Route, Switch } from "react-router-dom";
import { outerTheme, CustomTextField } from "../common/common";
import { MyShareholdingsDetails } from "./MyShareholdingsDetails";
import styles from "./shareholders.module.scss";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";




export class MyShareholdings extends React.Component<any, any> {
  public constructor(props: any, state: any) {
    super(props);
    this.mainHTML = this.mainHTML.bind(this);
    this.state = {
      properties: this.props.properties,
      shareholdingsCollection: [],
      shareholdingsCollection_filter: [],
      shareholdingTitle: "Shareholdings",
      sortShareholderID: "NA", //desc
      sortShares: "NA",
      sortOptions: "NA",
      totalSharesOwned: 0,
      isOptionsExist:[],
      totalOptions:0,
      page: 0,
      rowsPerPage: 3
    };
  }
  public componentDidMount() {
    console.log(this.props);
    let newWeb = new Web(this.state.properties.tenentURL);
    this.getShareholdings(newWeb);
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
        "ShareholderType",
        "unrestrictedShares",
        "restrictedShares",
        "vestedOptions",
        "unvestedOptions"
      )
      .orderBy("shareholderID", true)
      .filter("shareholderEmail eq '" + this.state.properties.accountEmail + "'")
      .get()
      .then(d => {
        let unique = []; let isOptionsExist = [];
        unique = _.uniqBy(d, e => {
          return e.shareholderID;
        });
        isOptionsExist =  _.filter(d, (val) => {
          return val.options === "0";
        });
        let totalShares = 0;  let totalOptions = 0;
        this.setState(prevState => ({
          ...prevState,
          shareholdingsCollection: unique,
          shareholdingsCollection_filter: unique,
          isOptionsExist: isOptionsExist
        }));
        for (let index = 0; index < unique.length; index++) {
          totalShares += parseFloat(unique[index].shares.replace(/,/g, ""));
          totalOptions += parseFloat(d[index].options.replace(/,/g, ""));
        }
        // let s = (totalShares.toLocaleString(undefined, {minimumFractionDigits: 2}));
        // let o = (totalOptions.toLocaleString(undefined, {minimumFractionDigits: 2}));
        // s = new Intl.NumberFormat("en", {
        //   style: "decimal",
        //   useGrouping: true
        // }).format(Number(s));
        // o = new Intl.NumberFormat("en", {
        //   style: "decimal",
        //   useGrouping: true
        // }).format(Number(o));
        this.setState(prevState => ({
          ...prevState,
          totalSharesOwned: totalShares.toLocaleString(undefined, {minimumFractionDigits: 2}),
          totalOptions: totalOptions.toLocaleString(undefined, {minimumFractionDigits: 2})
        }));
      });
  }

  public handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    this.setState({
      page: newPage
    });
  }

  public handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    this.setState({
      rowsPerPage: parseInt(event.target.value)
    });
  }

  public handleSearch = e => {
    console.log(e.target.value);
    let currentList = [];
    let newList = [];
    let totalShares = 0;
    if (e.target.value !== "") {
      currentList = this.state.shareholdingsCollection_filter;
      newList = currentList.filter(item => {
        const lc = item.shareholderID;
        const filter = e.target.value;
        return lc.includes(filter);
      });
    } else {
      newList = this.state.shareholdingsCollection_filter;
    }
    // for (let index = 0; index < newList.length; index++) {
    //   totalShares += parseFloat(newList[index].shares.replace(/,/g, ""));
    //   totalSharesOwned: totalShares.toLocaleString();
    // }
    this.setState({
      shareholdingsCollection: newList
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

  public mainHTML = () => {
    let mainHTML = (
      <React.Fragment>
        <div
          className="row-fluid"
          style={{ padding: "20px", overflow: "hidden" }}
        >
          <div className="row" style={{ paddingTop: "10px" }}>
            <div className=" col-md-12">
              <div className="card">
                <div className={`card-body`}>
                  <div className={`${styles.cardHead_General} card-header`}>
                    <h6>Shareholdings</h6>
                  </div>
                  <div className="row-fluid" style={{ marginTop: "10px" }}>
                    <div className="row-fluid" style={{ marginBottom: "15px" }}>
                      <FormControl fullWidth>
                        <CustomTextField
                          onChange={this.handleSearch}
                          label="Search by Account ID..."
                        />
                      </FormControl>
                      <br />
                    </div>
                    <Router>
                      <Table
                        style={{
                          background: "rgb(224, 224, 224)",
                          borderBottom: "2px solid white"
                        }}
                      >
                        <TableFooter>
                          <TableRow>
                            <TablePagination
                              rowsPerPageOptions={[
                                5,
                                10,
                                { label: "All", value: -1 }
                              ]}
                              colSpan={4}
                              count={this.state.shareholdingsCollection.length}
                              rowsPerPage={this.state.rowsPerPage}
                              page={this.state.page}
                              onChangePage={this.handleChangePage}
                              onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            />
                          </TableRow>
                        </TableFooter>
                      </Table>
                      <Table style={{ border: "1px solid #e0e0e0" }}>
                        <colgroup>
                          {this.state.isOptionsExist.length !== 0 ? (
                            <React.Fragment>
                              <col width="60%" />
                              <col width="20%" />
                              <col width="20%" />
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <col width="55%" />
                              <col width="15%" />
                              <col width="15%" />
                              <col width="15%" />
                            </React.Fragment>
                          )}
                        </colgroup>
                        <TableHead style={{ background: "#e0e0e0" }}>
                          <TableRow>
                            <TableCell className={styles.tblCell}>
                              Shareholding Name
                            </TableCell>
                            <TableCell className={styles.tblCell} align="right">
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
                            <TableCell className={styles.tblCell} align="right">
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
                          {(this.state.rowsPerPage > 0
                            ? this.state.shareholdingsCollection.slice(
                                this.state.page * this.state.rowsPerPage,
                                this.state.page * this.state.rowsPerPage +
                                  this.state.rowsPerPage
                              )
                            : this.state.shareholdingsCollection
                          ).map(shareholdings => (
                            <TableRow key={shareholdings.ID}>
                              <TableCell component="th" scope="row">
                                {shareholdings.Title}
                                <br />
                                <Link
                                  style={{
                                    color: "#dc4848",
                                    cursor: "pointer",
                                    padding: "5px;"
                                  }}
                                  to={`/myShareholdingsDetails/${shareholdings.shareholderID}`}
                                >
                                  <SearchIcon fontSize="default" />
                                  View Details
                                </Link>
                              </TableCell>
                              <TableCell align="right">
                                {shareholdings.shareholderID}
                              </TableCell>
                              {this.state.isOptionsExist.length === 0 ? (
                                <React.Fragment>
                                  <TableCell align="right">
                                    {shareholdings.options === 0
                                      ? "-"
                                      : (
                                          shareholdings.vestedOptions +
                                          shareholdings.unvestedOptions
                                        ).toLocaleString(undefined, {
                                          minimumFractionDigits: 2
                                        })}
                                  </TableCell>
                                </React.Fragment>
                              ) : null}
                              <TableCell align="right">
                                {(
                                  shareholdings.unrestrictedShares +
                                  shareholdings.restrictedShares
                                ).toLocaleString(undefined, {
                                  minimumFractionDigits: 2
                                })}
                              </TableCell>
                            </TableRow>
                          ))}
                          {this.state.shareholdingsCollection[0]
                            .ShareholderType !== "Delegate" ? (
                            <TableRow key="001">
                              <TableCell component="th" scope="row">
                                {" "}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {" "}
                              </TableCell>
                              {this.state.isOptionsExist.length === 0 ? (
                                <React.Fragment>
                                  <TableCell
                                    component="th"
                                    scope="row"
                                    align="right"
                                  >
                                    Total Options Owned:
                                    {this.state.totalOptions}
                                  </TableCell>
                                </React.Fragment>
                              ) : null}
                              <TableCell
                                component="th"
                                scope="row"
                                align="right"
                              >
                                Total Shares Owned:{" "}
                                {this.state.totalSharesOwned}
                              </TableCell>
                            </TableRow>
                          ) : (
                            <TableRow key="001">
                              <TableCell component="th" scope="row">
                                {" "}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {" "}
                              </TableCell>
                              {this.state.isOptionsExist.length === 0 ? (
                                <React.Fragment>
                                  <TableCell
                                    component="th"
                                    scope="row"
                                    align="right"
                                  >
                                    Options Delegated:
                                    {this.state.totalOptions}
                                  </TableCell>
                                </React.Fragment>
                              ) : (
                                <TableCell component="th" scope="row">
                                  {" "}
                                </TableCell>
                              )}
                              <TableCell
                                component="th"
                                scope="row"
                                align="right"
                              >
                                Shares Delegated: {this.state.totalSharesOwned}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TablePagination
                              rowsPerPageOptions={[
                                5,
                                10,
                                { label: "All", value: -1 }
                              ]}
                              colSpan={4}
                              count={this.state.shareholdingsCollection.length}
                              rowsPerPage={this.state.rowsPerPage}
                              page={this.state.page}
                              onChangePage={this.handleChangePage}
                              onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            />
                          </TableRow>
                        </TableFooter>
                      </Table>
                      <Switch>
                        <Route
                          exact
                          path="/myShareholdingsDetails/:accountID"
                          render={props => (
                            <MyShareholdingsDetails
                              properties={{
                                tenentURL: this.state.properties.tenentURL,
                                accountID: this.state.properties.accountID
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
        </div>
      </React.Fragment>
    );
    return mainHTML;
  }

  public render(): React.ReactElement<any> {
    return (
      <React.Fragment>
        <div className={styles.shareholders}>
          <div className={styles.contentHead}>
            <h2>{this.state.shareholdingTitle}</h2>
          </div>
          {this.state.shareholdingsCollection.length > 0
            ? this.mainHTML()
            : null}
        </div>
      </React.Fragment>
    );
  }
}
