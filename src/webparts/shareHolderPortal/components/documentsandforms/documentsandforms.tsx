import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Divider,
  FormControl,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Link
} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import FolderIcon from "@material-ui/icons/Folder";
import { Web } from "@pnp/sp";
import * as _ from "lodash";
import * as React from "react";
import Moment from "react-moment";
import SwipeableViews from "react-swipeable-views";
import { CustomTextField, TabPanel } from "../common/common";
import styles from "./documentsandforms.module.scss";
export class DocumentsandForms extends React.Component<any, any> {
  public constructor(props: any, state: any) {
    super(props);
    this.state = {
      properties: this.props.properties,
      shareholderID: null,
      shareHoldingDocCollection: [],
      shareHoldingDocisNotAvilable: false,
      shareHoldingsDocTable: false,
      communitySelected: 0,
      communityContent: false,
      communityDocumentsCollection: [],
      communityDocuments_IsOpen: false,
      communityDocuments_IsSelected: false,
      communityFinancialInformationCollection: [],
      communityFinancialInformation_IsOpen: false,
      communityFinancialInformation_IsSelected: false,
      communityFormsCollection: [],
      communityForms_IsOpen: false,
      communityForms_IsSelected: false,
      communityDividendscollection: [],
      communityDividends_IsOpen: false,
      communityDividends_IsSelected: false,
      communityTaxNoticesCollection: [],
      communityTaxNotices_IsOpen: false,
      communityTaxNotices_IsSelected: false,
      tenentURL: this.props.properties.tenentURL,
      allShareHoldersAccounts: [],
      allShareHoldersAccounts_fliter: [],
      open: false,
      value: 0,
      setValue: 0,
      loadPage: false,
      sortOrder: false,
      page: 0,
      rowsPerPage: 10
    };
  }

  public handleSort = () => {
    let data = this.state.allShareHoldersAccounts;
    if (this.state.sortOrder !== true) {
      data.sort((a, b) => Number(b.shareholderID) - Number(a.shareholderID));
      this.setState({
        allShareHoldersAccounts: data,
        sortOrder: !this.state.sortOrder
      });
    } else {
      data.sort((a, b) => Number(a.shareholderID) - Number(b.shareholderID));
      this.setState({
        allShareHoldersAccounts: data,
        sortOrder: !this.state.sortOrder
      });
    }
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
    if (e.target.value !== "") {
      currentList = this.state.allShareHoldersAccounts_fliter;
      newList = currentList.filter(item => {
        const lc = item.shareholderID; //.toLowerCase();
        const filter = e.target.value; //.toLowerCase();
        return lc.includes(filter);
      });
    } else {
      newList = this.state.allShareHoldersAccounts_fliter;
    }
    // Set the filtered state based on what our rules added to newList
    this.setState({
      allShareHoldersAccounts: newList
    });
  }

  public getOnDemandShareHoldingDocs = id => {
    let newWeb = new Web(this.state.tenentURL);
    newWeb.lists
      .getByTitle("Shareholding Documents")
      .items.select(
        "Title",
        "BaseName",
        "EncodedAbsUrl",
        "ID",
        "AccountID",
        "Modified",
        "Created"
      )
      .orderBy("Title", true)
      .filter("AccountID eq '" + id + "'")
      .get()
      .then(d => {
        if (d.length > 0) {
          this.setState({
            shareHoldingDocCollection: d,
            //shareHoldingDocCollection_filter: d,
            shareHoldingDocisNotAvilable: false
          });
        } else {
          this.setState({
            shareHoldingDocCollection: [],
            //shareHoldingDocCollection_filter: d,
            shareHoldingDocisNotAvilable: true
          });
        }
      })
      .catch(e => {
        console.error(e);
      });
  }

  public componentDidMount() {
    this.getAllShareHolders();
    this.getAllCommunityDocuments();
  }

  public getAllCommunityDocuments = () =>{
    let newWeb = new Web(this.state.tenentURL);
    newWeb.lists
      .getByTitle("Community Documents")
      .items.select(
        "Title",
        "BaseName",
        "EncodedAbsUrl",
        "ID",
        "Modified",
        "DocumentType",
        "Created"
      )
      .orderBy("ID", false)
      .get()
      .then(d => {
        let TaxNotice = []; let Forms = []; let FinancialInformation = []; let Dividends = []; let CommunityDocuments = [];

        if (d.length > 0) {
          for (let index = 0; index < d.length; index++) {
            let key = d[index].DocumentType
            switch (key) {
              case "Tax Notice":
                TaxNotice.push(d[index]);
                break;
              case "Forms":
                Forms.push(d[index]);
                break;
              case "Financial Information":
                FinancialInformation.push(d[index]);
                break;
              case "Dividends":
                Dividends.push(d[index]);
                break;
              case "Community Documents":
                CommunityDocuments.push(d[index]);
                break;
            }
          }
          this.setState({
            communityDividendscollection: Dividends,
            communityDocumentsCollection: CommunityDocuments,
            communityFinancialInformationCollection: FinancialInformation,
            communityFormsCollection: Forms,
            communityTaxNoticesCollection: TaxNotice
          });
        }
      })
      .catch(e => {
        console.error(e);
      });
  }

  public getAllShareHolders = () => {
    let newWeb = new Web(this.state.tenentURL);
    newWeb.lists
      .getByTitle("Shareholdings")
      .items.select("shareholderID", "ID", "shareholderEmail")
      .filter(
        "shareholderEmail eq '" + this.state.properties.accountEmail + "'"
      )
      .orderBy("ID", true)
      .get()
      .then(d => {
        let unique = _.uniqBy(d, e => {
          return e.shareholderID;
        });
        if (unique.length > 1) {
          this.setState({
            allShareHoldersAccounts: unique,
            allShareHoldersAccounts_fliter: unique,
            loadPage: true
          });
        } else {
          this.setState({
            shareholderID: unique[0].shareholderID,
            allShareHoldersAccounts: unique,
            allShareHoldersAccounts_fliter: unique,
            loadPage: true
          });
          this.getSingleShareholderDocuments(unique[0].shareholderID);
        }
        console.log(this.state.allShareHoldersAccounts);
      })
      .catch(e => {
        console.error(e);
      });
  }

  public tab_handleChange = (
    event: React.ChangeEvent<{}>,
    newValue: number
  ) => {
    this.setState({
      setValue: newValue,
      value: newValue
    });
    console.log(this.state);
  }

  public tab_handleChangeIndex = (index: number) => {
    this.setState({
      setValue: index,
      value: index
    });
  }

  public a11yProps = (index: any) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`
    };
  }

  public communityDocumentsHTML = () => {
    let communityDocumentsHTML = (
      <div
        className="row-fluid"
        style={{ paddingTop: "10px", overflow: "hidden" }}
      >
        <div className="row">
          <div className="col-md-12">
            <Divider />
            <List component="nav">
              <ListItem
                button
                selected={this.state.communitySelected === 2}
                onClick={event => {
                  this.setState({
                    communityContent: !this.state.communityContent,
                    communitySelected: 2
                  });
                }}
              >
                <ListItemIcon>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary="Community Documents Folder" />
              </ListItem>
            </List>
            {this.state.communityContent !== false ? (
              <React.Fragment>
                <Divider />
                <List style={{ marginLeft: "25px" }} component="nav">
                  <ListItem
                    button
                    selected={this.state.communityTaxNotices_IsSelected}
                    onClick={event => {
                      this.setState({
                        communityTaxNotices_IsOpen: !this.state
                          .communityTaxNotices_IsOpen,
                        communityTaxNotices_IsSelected: !this.state
                          .communityTaxNotices_IsSelected,
                        communityForms_IsSelected: false,
                        communityForms_IsOpen: false,
                        communityFinancialInformation_IsOpen: false,
                        communityFinancialInformation_IsSelected: false,
                        communityDividends_IsSelected: false,
                        communityDividends_IsOpen: false,
                        communityDocuments_IsSelected: false,
                        communityDocuments_IsOpen: false
                      });
                    }}
                  >
                    <ListItemIcon>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="Tax Notice" />
                  </ListItem>
                </List>
                {this.state.communityTaxNotices_IsOpen !== false ? (
                  <React.Fragment>
                    <Divider />
                    <div
                      style={{
                        marginLeft: "50px",
                        marginBottom: "10px",
                        marginTop: "10px"
                      }}
                    >
                      <Paper>
                        <Table aria-label="simple table">
                          <TableHead
                            className={styles.selectedDocTableHead}
                          >
                            <TableRow>
                              <TableCell className={styles.tblHeadCell}>
                                Document Name
                              </TableCell>
                              <TableCell
                                className={styles.tblHeadCell}
                                align="right"
                              >
                                Last Modified
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {this.state.communityTaxNoticesCollection.map(
                              doc => (
                                <TableRow key={doc.ID}>
                                  <TableCell component="th" scope="doc">
                                    <Link
                                      className={styles.docLink}
                                      target="_blank"
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
                                  </TableCell>
                                  <TableCell align="right">
                                    <Moment format="MMMM Do, YYYY">
                                      {doc.Created}
                                    </Moment>
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </Paper>
                    </div>
                  </React.Fragment>
                ) : null}
                <Divider />
                <List style={{ marginLeft: "25px" }} component="nav">
                  <ListItem
                    button
                    selected={this.state.communityForms_IsSelected}
                    onClick={event => {
                      this.setState({
                        communityForms_IsSelected: !this.state
                          .communityForms_IsSelected,
                        communityForms_IsOpen: !this.state
                          .communityForms_IsOpen,
                        communityTaxNotices_IsOpen: false,
                        communityTaxNotices_IsSelected: false,
                        communityFinancialInformation_IsOpen: false,
                        communityFinancialInformation_IsSelected: false,
                        communityDividends_IsSelected: false,
                        communityDividends_IsOpen: false,
                        communityDocuments_IsSelected: false,
                        communityDocuments_IsOpen: false
                      });
                    }}
                  >
                    <ListItemIcon>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="Forms" />
                  </ListItem>
                </List>
                {this.state.communityForms_IsOpen !== false ? (
                  <React.Fragment>
                    <Divider />
                    <div
                      style={{
                        marginLeft: "50px",
                        marginBottom: "10px",
                        marginTop: "10px"
                      }}
                    >
                      <Paper>
                        <Table aria-label="simple table">
                          <TableHead
                           className={styles.selectedDocTableHead}
                          >
                            <TableRow>
                              <TableCell className={styles.tblHeadCell}>
                                Document Name
                              </TableCell>
                              <TableCell
                                className={styles.tblHeadCell}
                                align="right"
                              >
                                Last Modified
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {this.state.communityFormsCollection.map(doc => (
                              <TableRow key={doc.ID}>
                                <TableCell component="th" scope="doc">
                                  <Link
                                    className={styles.docLink}
                                    target="_blank"
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
                                </TableCell>
                                <TableCell align="right">
                                  <Moment format="MMMM Do, YYYY">
                                    {doc.Created}
                                  </Moment>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Paper>
                    </div>
                  </React.Fragment>
                ) : null}
                <Divider />
                <List style={{ marginLeft: "25px" }} component="nav">
                  <ListItem
                    button
                    selected={
                      this.state.communityFinancialInformation_IsSelected
                    }
                    onClick={event => {
                      this.setState({
                        communityFinancialInformation_IsOpen: !this.state
                          .communityFinancialInformation_IsOpen,
                        communityFinancialInformation_IsSelected: !this.state
                          .communityFinancialInformation_IsSelected,
                        communityForms_IsSelected: false,
                        communityForms_IsOpen: false,
                        communityTaxNotices_IsOpen: false,
                        communityTaxNotices_IsSelected: false,
                        communityDividends_IsSelected: false,
                        communityDividends_IsOpen: false,
                        communityDocuments_IsSelected: false,
                        communityDocuments_IsOpen: false
                      });
                    }}
                  >
                    <ListItemIcon>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="Financial Information" />
                  </ListItem>
                </List>
                {this.state.communityFinancialInformation_IsOpen !== false ? (
                  <React.Fragment>
                    <Divider />
                    <div
                      style={{
                        marginLeft: "50px",
                        marginBottom: "10px",
                        marginTop: "10px"
                      }}
                    >
                      <Paper>
                        <Table aria-label="simple table">
                          <TableHead
                            className={styles.selectedDocTableHead}
                          >
                            <TableRow>
                              <TableCell className={styles.tblHeadCell}>
                                Document Name
                              </TableCell>
                              <TableCell
                                className={styles.tblHeadCell}
                                align="right"
                              >
                                Last Modified
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {this.state.communityFinancialInformationCollection.map(doc => (
                              <TableRow key={doc.ID}>
                                <TableCell component="th" scope="doc">
                                  <Link
                                    className={styles.docLink}
                                    target="_blank"
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
                                </TableCell>
                                <TableCell align="right">
                                  <Moment format="MMMM Do, YYYY">
                                    {doc.Created}
                                  </Moment>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Paper>
                    </div>
                  </React.Fragment>
                ) : null}
                <Divider />
                <List style={{ marginLeft: "25px" }} component="nav">
                  <ListItem
                    button
                    selected={this.state.communityDividends_IsSelected}
                    onClick={event => {
                      this.setState({
                        communityDividends_IsSelected: !this.state
                          .communityDividends_IsSelected,
                        communityDividends_IsOpen: !this.state
                          .communityDividends_IsOpen,
                        communityFinancialInformation_IsOpen: false,
                        communityFinancialInformation_IsSelected: false,
                        communityForms_IsSelected: false,
                        communityForms_IsOpen: false,
                        communityTaxNotices_IsOpen: false,
                        communityTaxNotices_IsSelected: false,
                        communityDocuments_IsSelected: false,
                        communityDocuments_IsOpen: false
                      });
                    }}
                  >
                    <ListItemIcon>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="Dividends" />
                  </ListItem>
                </List>
                {this.state.communityDividends_IsOpen !== false ? (
                  <React.Fragment>
                    <Divider />
                    <div
                      style={{
                        marginLeft: "50px",
                        marginBottom: "10px",
                        marginTop: "10px"
                      }}
                    >
                      <Paper>
                        <Table aria-label="simple table">
                          <TableHead
                           className={styles.selectedDocTableHead}
                          >
                            <TableRow>
                              <TableCell className={styles.tblHeadCell}>
                                Document Name
                              </TableCell>
                              <TableCell
                                className={styles.tblHeadCell}
                                align="right"
                              >
                                Last Modified
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {this.state.communityDividendscollection.map(
                              doc => (
                                <TableRow key={doc.ID}>
                                  <TableCell component="th" scope="doc">
                                    <Link
                                      className={styles.docLink}
                                      target="_blank"
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
                                  </TableCell>
                                  <TableCell align="right">
                                    <Moment format="MMMM Do, YYYY">
                                      {doc.Created}
                                    </Moment>
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </Paper>
                    </div>
                  </React.Fragment>
                ) : null}
                <Divider />
                <List style={{ marginLeft: "25px" }} component="nav">
                  <ListItem
                    button
                    selected={this.state.communityDocuments_IsSelected}
                    onClick={event => {
                      this.setState({
                        communityDocuments_IsSelected: !this.state
                          .communityDocuments_IsSelected,
                        communityDocuments_IsOpen: !this.state
                          .communityDocuments_IsOpen,
                        communityDividends_IsSelected: false,
                        communityDividends_IsOpen: false,
                        communityFinancialInformation_IsOpen: false,
                        communityFinancialInformation_IsSelected: false,
                        communityForms_IsSelected: false,
                        communityForms_IsOpen: false,
                        communityTaxNotices_IsOpen: false,
                        communityTaxNotices_IsSelected: false
                      });
                    }}
                  >
                    <ListItemIcon>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="Community Documents" />
                  </ListItem>
                </List>
                {this.state.communityDocuments_IsOpen !== false ? (
                  <React.Fragment>
                    <Divider />
                    <div
                      style={{
                        marginLeft: "50px",
                        marginBottom: "10px",
                        marginTop: "10px"
                      }}
                    >
                      <Paper>
                        <Table aria-label="simple table">
                          <TableHead
                           className={styles.selectedDocTableHead}
                          >
                            <TableRow>
                              <TableCell className={styles.tblHeadCell}>
                                Document Name
                              </TableCell>
                              <TableCell
                                className={styles.tblHeadCell}
                                align="right"
                              >
                                Last Modified
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {this.state.communityDocumentsCollection.map(
                              doc => (
                                <TableRow key={doc.ID}>
                                  <TableCell component="th" scope="doc">
                                    <Link
                                      className={styles.docLink}
                                      target="_blank"
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
                                  </TableCell>
                                  <TableCell align="right">
                                    <Moment format="MMMM Do, YYYY">
                                      {doc.Created}
                                    </Moment>
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </Paper>
                    </div>
                  </React.Fragment>
                ) : null}
                <Divider />
              </React.Fragment>
            ) : null}
            <Divider />
          </div>
        </div>
      </div>
    );
    return communityDocumentsHTML;
  }

  public getSingleShareholderDocuments = id => {
    let newWeb = new Web(this.state.tenentURL);
    newWeb.lists
      .getByTitle("Shareholding Documents")
      .items.select(
        "Title",
        "BaseName",
        "EncodedAbsUrl",
        "ID",
        "AccountID",
        "Modified",
        "Created"
      )
      .orderBy("Title", true)
      .filter("AccountID eq '" + id + "'")
      .get()
      .then(d => {
        if (d.length > 0) {
          this.setState({
            shareHoldingDocCollection: d,
            shareHoldingDocisNotAvilable: false
          });
        } else {
          this.setState({
            shareHoldingDocCollection: [],
            shareHoldingDocisNotAvilable: true
          });
        }
      })
      .catch(e => {
        console.error(e);
      });
  }

  public singleShareholdingsHTML = () => {
    let _html = (
      <React.Fragment>
        <Divider />
        <List style={{ marginLeft: "25px" }} component="nav">
          <ListItem
            button
            selected={this.state.shareHoldingsAccountFolder}
            onClick={event => {
              this.setState({
                shareHoldingsAccountFolder: !this.state
                  .shareHoldingsAccountFolder,
                shareHoldingsDocTable: !this.state.shareHoldingsDocTable
              });
            }}
          >
            <ListItemIcon>
              <Avatar>
                <FolderIcon />
              </Avatar>
            </ListItemIcon>
            <ListItemText primary={this.state.shareholderID} />
          </ListItem>
          <Divider />
          {this.state.shareHoldingsDocTable !== false ? (
            <div
              style={{
                marginLeft: "50px",
                marginBottom: "10px",
                marginTop: "10px"
              }}
            >
              {this.state.shareHoldingDocCollection.length > 0 ? (
                <Paper>
                  <Table aria-label="simple table">
                    <TableHead
                    style={{background:"#f4c55c"}}
                    >
                      <TableRow>
                        <TableCell className={styles.tblHeadCell}>
                          Document Name
                        </TableCell>
                        <TableCell className={styles.tblHeadCell} align="right">
                          Last Modified
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.shareHoldingDocCollection.map(doc => (
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
                          </TableCell>
                          <TableCell align="right">
                            <Moment format="MMMM Do, YYYY">
                              {doc.Created}
                            </Moment>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              ) : (
                <Paper>
                  <div className="alert alert-danger">
                    <h5 style={{ fontSize: "16px" }}>
                      No Documents found on the given account Number{" "}
                      {this.state.properties.accountID}
                    </h5>
                  </div>
                </Paper>
              )}
            </div>
          ) : null}
        </List>
      </React.Fragment>
    );
    return _html;
  }

  public multipleShareholdingsHTML = () => {
    let _html = (
      <React.Fragment>
        <div className="row">
          <div
            className="col-lg-4 col-md-5 col-sm-6 col-xs-6"
            style={{ marginTop: "-10px" }}
          >
            <Paper>
              <Table aria-label="simple table" style={{ marginTop: "10px" }}>
                <TableHead style={{ backgroundColor: "#275458" }}>
                  <TableRow>
                    <TableCell>
                      <a
                        className={styles.tblHeadSortLink}
                        onClick={this.handleSort}
                        style={{ cursor: "pointer" }}
                      >
                        {this.state.sortOrder === true ? (
                          <ArrowUpwardIcon />
                        ) : (
                          <ArrowDownwardIcon />
                        )}{" "}
                        AccountID
                      </a>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.allShareHoldersAccounts.map(row => (
                    <TableRow key={row.ID}>
                      <TableCell component="th" scope="doc">
                        <a
                          style={{ cursor: "pointer" }}
                          className={styles.accountIDLink}
                          onClick={() => {
                            this.getOnDemandShareHoldingDocs(row.shareholderID);
                          }}
                        >
                          <FolderIcon /> {row.shareholderID}
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </div>
          <div className="col-lg-8 col-md-7 col-sm-6 col-xs-6">
            {this.state.shareHoldingDocCollection.length > 0 ? (
              <Paper>
                <div
                  style={{
                    padding: "10px",
                    background: "#275458",
                    color: "white"
                  }}
                >
                  <h4>
                    Shareholding Documents with Account ID{" "}
                    {this.state.shareHoldingDocCollection[0].AccountID}
                  </h4>
                </div>
                <div style={{ padding: "10px" }}>
                  <React.Fragment>
                    <Table aria-label="simple table">
                      <TableHead style={{ backgroundColor: "#e0e0e0" }}>
                        <TableRow>
                          <TableCell style={{ color: "black" }}>
                            Title
                          </TableCell>
                          <TableCell align="right" style={{ color: "black" }}>
                            Created
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.state.shareHoldingDocCollection.map(doc => (
                          <TableRow key={doc.ID}>
                            <TableCell component="th" scope="doc">
                              <Link
                                className={styles.docLink}
                                target="_blank"
                                //href={doc.EncodedAbsUrl}
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
                        ))}
                      </TableBody>
                    </Table>
                  </React.Fragment>
                </div>
              </Paper>
            ) : null}
            <div style={{ padding: "10px" }}>
              {this.state.shareHoldingDocisNotAvilable !== false ? (
                <React.Fragment>
                  <div className="alert alert-danger">
                    <h5 style={{ fontSize: "16px" }}>
                      No Documents found on the given account Number{" "}
                      {/* {this.state.properties.accountID} */}
                    </h5>
                  </div>
                </React.Fragment>
              ) : null}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
    return _html;
  }

  public render(): React.ReactElement<any> {
    return (
      <div className={styles.documentsandforms}>
        <div className={styles.contentHead}>
          <h2>Documents and Forms</h2>
        </div>
        <div>
          <AppBar
            position="static"
            style={{ background: "#b5bdb2", color: "black" }}
          >
            <Tabs
              value={this.state.value}
              onChange={this.tab_handleChange}
              className={styles.tabsStyles}
              TabIndicatorProps={{
                style: {
                  backgroundColor: "#275458"
                }
              }}
            >
              <Tab label="Shareholding Documents" {...this.a11yProps(0)} />
              <Tab label="Community Documents" {...this.a11yProps(1)} />
            </Tabs>
          </AppBar>
          <SwipeableViews
            index={this.state.value}
            onChangeIndex={this.tab_handleChangeIndex}
          >
            <TabPanel value={this.state.value} index={0}>
              <div style={{ padding: "20px", overflow: "hidden" }}>
                {this.state.loadPage !== false &&
                this.state.allShareHoldersAccounts.length > 1
                  ? this.multipleShareholdingsHTML()
                  : this.singleShareholdingsHTML()}
              </div>
              {/* <div style={{ padding: "20px", overflow: "hidden" }}>
                {this.state.loadPage !== false &&
                this.state.allShareHoldersAccounts.length === 1
                  ?
                  : null}
              </div>*/}
            </TabPanel>
            <TabPanel value={this.state.value} index={1}>
              {this.state.loadPage !== false
                ? this.communityDocumentsHTML()
                : null}
            </TabPanel>
          </SwipeableViews>
        </div>
      </div>
    );
  }
}

  // public getCommunityDividends = () => {
  //   let newWeb = new Web(this.state.tenentURL);
  //   newWeb.lists
  //     .getByTitle("Community Dividends")
  //     .items.select(
  //       "Title",
  //       "BaseName",
  //       "EncodedAbsUrl",
  //       "ID",
  //       "Modified",
  //       "Created"
  //     )
  //     .orderBy("Title", true)
  //     //.filter("AccountID eq '" + this.state.properties.accountID + "'")
  //     .get()
  //     .then(d => {
  //       if (d.length > 0) {
  //         this.setState({
  //           communityDividendscollection: d
  //         });
  //       }
  //     })
  //     .catch(e => {
  //       console.error(e);
  //     });
  // }

  // public getCommunityDocuments = () => {
  //   let newWeb = new Web(this.state.tenentURL);
  //   newWeb.lists
  //     .getByTitle("Community Documents")
  //     .items.select(
  //       "Title",
  //       "BaseName",
  //       "EncodedAbsUrl",
  //       "ID",
  //       "Modified",
  //       "Created"
  //     )
  //     .orderBy("Title", true)
  //     //.filter("AccountID eq '" + this.state.properties.accountID + "'")
  //     .get()
  //     .then(d => {
  //       if (d.length > 0) {
  //         this.setState({
  //           communityDocumentsCollection: d
  //         });
  //       }
  //     })
  //     .catch(e => {
  //       console.error(e);
  //     });
  // }

  // public getCommunityFinancialInformation = () => {
  //   let newWeb = new Web(this.state.tenentURL);
  //   newWeb.lists
  //     .getByTitle("Community Financial Information")
  //     .items.select(
  //       "Title",
  //       "BaseName",
  //       "EncodedAbsUrl",
  //       "ID",
  //       "Modified",
  //       "Created"
  //     )
  //     .orderBy("Title", true)
  //     //.filter("AccountID eq '" + this.state.properties.accountID + "'")
  //     .get()
  //     .then(d => {
  //       if (d.length > 0) {
  //         this.setState({
  //           communityFinancialInformationCollection: d
  //         });
  //       }
  //     })
  //     .catch(e => {
  //       console.error(e);
  //     });
  // }

  // public getCommunityForms = () => {
  //   let newWeb = new Web(this.state.tenentURL);
  //   newWeb.lists
  //     .getByTitle("Community Forms")
  //     .items.select(
  //       "Title",
  //       "BaseName",
  //       "EncodedAbsUrl",
  //       "ID",
  //       "Modified",
  //       "Created"
  //     )
  //     .orderBy("Title", true)
  //     //.filter("AccountID eq '" + this.state.properties.accountID + "'")
  //     .get()
  //     .then(d => {
  //       if (d.length > 0) {
  //         this.setState({
  //           communityFormsCollection: d
  //         });
  //       }
  //     })
  //     .catch(e => {
  //       console.error(e);
  //     });
  // }

  // public getCommunityTaxNotices = () => {
  //   let newWeb = new Web(this.state.tenentURL);
  //   newWeb.lists
  //     .getByTitle("Community Tax Notices")
  //     .items.select(
  //       "Title",
  //       "BaseName",
  //       "EncodedAbsUrl",
  //       "ID",
  //       "Modified",
  //       "Created"
  //     )
  //     .orderBy("Title", true)
  //     //.filter("AccountID eq '" + this.state.properties.accountID + "'")
  //     .get()
  //     .then(d => {
  //       if (d.length > 0) {
  //         this.setState({
  //           communityTaxNoticesCollection: d
  //         });
  //       }
  //     })
  //     .catch(e => {
  //       console.error(e);
  //     });
  // }
