import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormControl,
  TextField,
  TableFooter
} from "@material-ui/core";
import TablePagination from "@material-ui/core/TablePagination";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import SearchIcon from "@material-ui/icons/Search";
import { Web } from "@pnp/sp";
import * as _ from "lodash";
import * as React from "react";
import { HashRouter as Router, Link, Route, Switch } from "react-router-dom";
import styles from "../../shareholders/shareholders.module.scss";
import { AdminShareholdersDetails } from "../Admins/Admin_ShareholdersDetails";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { outerTheme } from "../../common/common";

export class AdminShareholdings extends React.Component<any, any> {
  public constructor(props: any, state: any) {
    super(props);
    this.mainHTML = this.mainHTML.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.state = {
      properties: this.props.properties,
      shareholdingsCollection: [],
      shareholdingsCollection_filter: [],
      shareholdingTitle: "Shareholdings",
      sortShareholderID: "NA", //desc
      sortShares: "NA",
      sortOptions: "NA",
      totalSharesOwned: 0,
      totalOptions: 0,
      page: 0,
      rowsPerPage: 20
    };
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

  public componentDidMount() {
    let newWeb = new Web(this.state.properties.tenentURL);
    this.getShareholdings(newWeb);
  }

  public getShareholdings(newWeb) {
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
      .filter("ShareholderType eq 'Shareholder'")
      .top(500)
      .get()
      .then(d => {
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
              unique[index].unrestrictedShares + unique[index].restrictedShares
            ),
            options: parseFloat(
              unique[index].vestedOptions + unique[index].unvestedOptions
            )
          };
          totalShares += parseFloat(unique[index].shares.replace(/,/g, ""));
          totalOptions += parseFloat(unique[index].options.replace(/,/g, ""));
          shareholdingsCollection.push(obj);
        }
        // let s = totalShares.toLocaleString(undefined, {minimumFractionDigits: 2});
        // let o = totalOptions.toLocaleString(undefined, {minimumFractionDigits: 2});
        //   s = new Intl.NumberFormat("en", {
        //     style: "decimal",
        //     useGrouping: true
        //   }).format(Number(s));
        //   o = new Intl.NumberFormat("en", {
        //     style: "decimal",
        //     useGrouping: true
        //   }).format(Number(o));
        this.setState(prevState => ({
          ...prevState,
          shareholdingsCollection: shareholdingsCollection,
          shareholdingsCollection_filter: shareholdingsCollection,
          totalSharesOwned: totalShares.toLocaleString(undefined, {minimumFractionDigits: 2}),
          totalOptions: totalOptions.toLocaleString(undefined, {minimumFractionDigits: 2})
        }));
      });
  }

  public handleSearch(e) {
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

  public handleSort(sortType, column) {
    let column_Value = column;
    let sortCol = this.state.shareholdingsCollection_filter;
    switch (column_Value) {
      case "shareholderID":
        if (sortType === "asc" || sortType === "NA") {
          //var shareholdingsColSidAsc = this.state.shareholdingsCollection_filter;
          sortCol = _.orderBy(sortCol, column, sortType);
          this.setState({
            shareholdingsCollection: sortCol,
            sortShareholderID: "desc"
          });
        } else {
          //var shareholdingsColSidDec = this.state.shareholdingsCollection_filter;
          sortCol = _.orderBy(sortCol, column, sortType);
          this.setState({
            shareholdingsCollection: sortCol,
            sortShareholderID: "asc"
          });
        }
        break;
      case "options":
        if (sortType === "asc" || sortType === "NA") {
          //var sortColOpAsc = this.state.shareholdingsCollection_filter;
          sortCol = _.orderBy(sortCol, column, sortType);
          this.setState({
            shareholdingsCollection: sortCol,
            sortOptions: "desc"
          });
        } else {
          //var sortColOpDesc = this.state.shareholdingsCollection_filter;
          sortCol = _.orderBy(sortCol, column, sortType);
          this.setState({
            shareholdingsCollection: sortCol,
            sortOptions: "asc"
          });
        }
        break;
      case "shares":
        if (sortType === "asc" || sortType === "NA") {
          //var sortCol = this.state.shareholdingsCollection_filter;
          sortCol = _.orderBy(sortCol, column, sortType);
          this.setState({
            shareholdingsCollection: sortCol,
            sortShares: "desc"
          });
        } else {
          //var sortCol = this.state.shareholdingsCollection_filter;
          sortCol = _.orderBy(sortCol, column, sortType);
          this.setState({
            shareholdingsCollection: sortCol,
            sortShares: "asc"
          });
        }
        break;
    }
  }

  public mainHTML() {
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
                      <ThemeProvider theme={outerTheme}>
                        <FormControl fullWidth>
                          <TextField
                            onChange={this.handleSearch}
                            label="Search by Account ID..."
                          />
                        </FormControl>
                      </ThemeProvider>
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
                            <TableCell className={styles.tblCell} align="right">
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
                                  to={`/adminShareholdersDetails/${shareholdings.shareholderID}`}
                                >
                                  <SearchIcon fontSize="default" />
                                  View Details
                                </Link>
                              </TableCell>
                              <TableCell align="right">
                                {shareholdings.shareholderID}
                              </TableCell>
                              <TableCell align="right">
                                {shareholdings.options === 0
                                  ? "-"
                                  : shareholdings.options.toLocaleString(undefined, {minimumFractionDigits: 2})}
                              </TableCell>
                              <TableCell align="right">
                                {shareholdings.shares.toLocaleString(undefined, {minimumFractionDigits: 2})}
                              </TableCell>
                            </TableRow>
                          ))}

                          <TableRow key="001">
                            <TableCell component="th" scope="row" colSpan={2}>
                              {" "}
                            </TableCell>
                            <TableCell component="th" scope="row" align="right">
                              Total Options Owned:
                              {this.state.totalOptions}
                            </TableCell>
                            <TableCell component="th" scope="row" align="right">
                              Total Shares Owned: {this.state.totalSharesOwned}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TablePagination
                              rowsPerPageOptions={[
                                5,
                                10,
                                25,
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
                          path={`/adminShareholdersDetails/:shareholderID}`}
                          render={props => (
                            <AdminShareholdersDetails {...props} />
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
    const mainHTML = this.mainHTML();
    return (
      <React.Fragment>
        <div className={styles.shareholders}>
          <div className={styles.contentHead}>
            <h2>{this.state.shareholdingTitle}</h2>
          </div>
          {mainHTML}
        </div>
      </React.Fragment>
    );
  }
}

// let unique = [];
// unique = _.uniqBy(d, (e)=> {
//   return e.shareholderID;
// });
// let totalShares = 0;
// this.setState(prevState => ({
//   ...prevState,
//   shareholdingsCollection: unique,
//   shareholdingsCollection_filter: unique
// }));
// for (let index = 0; index < unique.length; index++) {
//   totalShares += parseFloat(unique[index].shares.replace(/,/g, ""));
// }
// this.setState(prevState => ({
//   ...prevState,
//   totalSharesOwned: totalShares.toLocaleString()
// }));
