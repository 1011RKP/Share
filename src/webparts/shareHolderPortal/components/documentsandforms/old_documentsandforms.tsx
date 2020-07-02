import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import * as React from "react";
import styles from "./documentsandforms.module.scss";
import { Web } from "@pnp/sp";
import Moment from "react-moment";

export class DocumentsandForms extends React.Component<any, any> {
  public constructor(props: any, state: any) {
    super(props);
    this.getShareHoldingDocuments = this.getShareHoldingDocuments.bind(this);
    this.getCommunityDividends = this.getCommunityDividends.bind(this);
    this.getCommunityDocuments = this.getCommunityDocuments.bind(this);
    this.getCommunityFinancialInformation = this.getCommunityFinancialInformation.bind(
      this
    );
    this.getCommunityForms = this.getCommunityForms.bind(this);
    this.getCommunityTaxNotices = this.getCommunityTaxNotices.bind(this);

    this.state = {
      properties: this.props.properties,
      shareHoldingDocCollection: [],
      shareHoldingSelected: 0,
      shareHoldingsContent: false,
      shareHoldingsAccountFolder: false,
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
      open: false
    };
  }

  public componentDidMount() {
    this.setState(
      {
        tenentURL: this.state.tenentURL + "/sites/vti_ww_00_9292_spfx/"
      },
      () => {
        this.getShareHoldingDocuments();
        this.getCommunityDividends();
        this.getCommunityDocuments();
        this.getCommunityFinancialInformation();
        this.getCommunityForms();
        this.getCommunityTaxNotices();
      }
    );
  }
  public getCommunityDividends() {
    let newWeb = new Web(this.state.tenentURL);
    newWeb.lists
      .getByTitle("Community Dividends")
      .items.select(
        "Title",
        "BaseName",
        "EncodedAbsUrl",
        "ID",
        "Modified",
        "Created"
      )
      .orderBy("Title", true)
      //.filter("AccountID eq '" + this.state.properties.accountID + "'")
      .get()
      .then(d => {
        if (d.length > 0) {
          this.setState({
            communityDividendscollection: d
          });
        }
      })
      .catch(e => {
        console.error(e);
      });
  }

  public getCommunityDocuments() {
    let newWeb = new Web(this.state.tenentURL);
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
      .orderBy("Title", true)
      //.filter("AccountID eq '" + this.state.properties.accountID + "'")
      .get()
      .then(d => {
        if (d.length > 0) {
          this.setState({
            communityDocumentsCollection: d
          });
        }
      })
      .catch(e => {
        console.error(e);
      });
  }

  public getCommunityFinancialInformation() {
    let newWeb = new Web(this.state.tenentURL);
    newWeb.lists
      .getByTitle("Community Financial Information")
      .items.select(
        "Title",
        "BaseName",
        "EncodedAbsUrl",
        "ID",
        "Modified",
        "Created"
      )
      .orderBy("Title", true)
      //.filter("AccountID eq '" + this.state.properties.accountID + "'")
      .get()
      .then(d => {
        if (d.length > 0) {
          this.setState({
            communityFinancialInformationCollection: d
          });
        }
      })
      .catch(e => {
        console.error(e);
      });
  }

  public getCommunityForms() {
    let newWeb = new Web(this.state.tenentURL);
    newWeb.lists
      .getByTitle("Community Forms")
      .items.select(
        "Title",
        "BaseName",
        "EncodedAbsUrl",
        "ID",
        "Modified",
        "Created"
      )
      .orderBy("Title", true)
      //.filter("AccountID eq '" + this.state.properties.accountID + "'")
      .get()
      .then(d => {
        if (d.length > 0) {
          this.setState({
            communityFormsCollection: d
          });
        }
      })
      .catch(e => {
        console.error(e);
      });
  }

  public getCommunityTaxNotices() {
    let newWeb = new Web(this.state.tenentURL);
    newWeb.lists
      .getByTitle("Community Tax Notices")
      .items.select(
        "Title",
        "BaseName",
        "EncodedAbsUrl",
        "ID",
        "Modified",
        "Created"
      )
      .orderBy("Title", true)
      //.filter("AccountID eq '" + this.state.properties.accountID + "'")
      .get()
      .then(d => {
        if (d.length > 0) {
          this.setState({
            communityTaxNoticesCollection: d
          });
        }
      })
      .catch(e => {
        console.error(e);
      });
  }

  public getShareHoldingDocuments(): any {
    let newWeb = new Web(this.state.tenentURL);
    if (this.state.properties.accountID !== "NA") {
      newWeb.lists
        .getByTitle("Shareholding Documents")
        .items.select(
          "Title",
          "BaseName",
          "EncodedAbsUrl",
          "AccountID",
          "ID",
          "Modified",
          "Created"
        )
        .orderBy("Title", true)
        .filter("AccountID eq '" + this.state.properties.accountID + "'")
        .get()
        .then(d => {
          if (d.length > 0) {
            this.setState({
              shareHoldingDocCollection: d
            });
          }
        })
        .catch(e => {
          console.error(e);
        });
    }
    // else
    // {

    // }
  }

  public render(): React.ReactElement<any> {
    return (
      <div className={styles.documentsandforms}>
        <div className={styles.contentHead}>
          <h2>Documents and Forms</h2>
        </div>
        <div
          className="row-fluid"
          style={{ padding: "20px", overflow: "hidden" }}
        >
          <div className="row" style={{ paddingTop: "10px" }}>
            <div className="col-md-12">
              <div className="card">
                <div className={`card-body`}>
                  <div className={`${styles.cardHead_General} card-header`}>
                    <h6>Documents Folder Structure </h6>
                  </div>
                  <div className="row-fluid">
                    <div className="col-md-12">
                      <div>
                        <List component="nav">
                          <ListItem
                            button
                            selected={this.state.shareHoldingSelected === 1}
                            onClick={event => {
                              this.setState({
                                shareHoldingsContent: !this.state
                                  .shareHoldingsContent,
                                shareHoldingSelected: 1,
                                communitySelected: 0,
                                communityContent: false
                              });
                            }}
                          >
                            <ListItemIcon>
                              <Avatar>
                                <FolderIcon />
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText primary="Shareholding Documents Folder" />
                          </ListItem>
                        </List>
                        {this.state.properties.accountID !== "NA" ? (
                          <React.Fragment>
                            {this.state.shareHoldingsContent !== false ? (
                              <React.Fragment>
                                <Divider />
                                <List
                                  style={{ marginLeft: "25px" }}
                                  component="nav"
                                >
                                  <ListItem
                                    button
                                    selected={
                                      this.state.shareHoldingsAccountFolder
                                    }
                                    onClick={event => {
                                      this.setState({
                                        shareHoldingsAccountFolder: !this.state
                                          .shareHoldingsAccountFolder,
                                        shareHoldingsDocTable: !this.state
                                          .shareHoldingsDocTable
                                      });
                                    }}
                                  >
                                    <ListItemIcon>
                                      <Avatar>
                                        <FolderIcon />
                                      </Avatar>
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={this.state.properties.accountID}
                                    />
                                  </ListItem>
                                </List>
                                {this.state.shareHoldingsDocTable !== false ? (
                                  <div
                                    style={{
                                      marginLeft: "50px",
                                      marginBottom: "10px"
                                    }}
                                  >
                                    {this.state.shareHoldingDocCollection
                                      .length > 0 ? (
                                      <Paper>
                                        <Table aria-label="simple table">
                                          <TableHead
                                            style={{
                                              backgroundColor: "#0c69cc",
                                              color: "white"
                                            }}
                                          >
                                            <TableRow>
                                              <TableCell
                                                className={styles.tblHeadCell}
                                              >
                                                Name
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
                                            {this.state.shareHoldingDocCollection.map(
                                              doc => (
                                                <TableRow key={doc.ID}>
                                                  <TableCell
                                                    component="th"
                                                    scope="doc"
                                                  >
                                                    <a
                                                      className={styles.docLink}
                                                      target="_blank"
                                                      href={doc.EncodedAbsUrl}
                                                    >
                                                      <PictureAsPdfIcon
                                                        className={
                                                          styles.docPDF
                                                        }
                                                      />
                                                      {doc.BaseName}
                                                    </a>
                                                  </TableCell>
                                                  <TableCell align="right">
                                                    <Moment format="MMMM, Do, YYYY">
                                                      {doc.Created}
                                                    </Moment>
                                                  </TableCell>
                                                </TableRow>
                                              )
                                            )}
                                          </TableBody>
                                        </Table>
                                      </Paper>
                                    ) : (
                                      <Paper>
                                        <div className="alert alert-danger">
                                          <h5 style={{ fontSize: "16px" }}>
                                            No Documents found on the given
                                            account Number{" "}
                                            {this.state.properties.accountID}
                                          </h5>
                                        </div>
                                      </Paper>
                                    )}
                                  </div>
                                ) : null}
                              </React.Fragment>
                            ) : null}
                          </React.Fragment>
                        ) : (
                          <Paper>
                            <div className="alert alert-danger">
                              <h5 style={{ fontSize: "16px" }}>
                                Unable to find the Shareholding Documents please
                                contact
                                <a href="mailto:ShareholderServices@wawa.com​">
                                  {" "}
                                  ShareholderServices@wawa.com​{" "}
                                </a>
                                or 484-840-1813 at any time
                              </h5>
                            </div>
                          </Paper>
                        )}

                        <Divider />
                        <List component="nav">
                          <ListItem
                            button
                            selected={this.state.communitySelected === 2}
                            onClick={event => {
                              this.setState({
                                communityContent: !this.state.communityContent,
                                shareHoldingSelected: 0,
                                communitySelected: 2,
                                shareHoldingsContent: false
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
                            <List
                              style={{ marginLeft: "25px" }}
                              component="nav"
                            >
                              <ListItem
                                button
                                selected={
                                  this.state.communityTaxNotices_IsSelected
                                }
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
                                        style={{
                                          backgroundColor: "#0c69cc",
                                          color: "white"
                                        }}
                                      >
                                        <TableRow>
                                          <TableCell
                                            className={styles.tblHeadCell}
                                          >
                                            Name
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
                                              <TableCell
                                                component="th"
                                                scope="doc"
                                              >
                                                <a
                                                  className={styles.docLink}
                                                  target="_blank"
                                                  href={doc.EncodedAbsUrl}
                                                >
                                                  <PictureAsPdfIcon
                                                    className={styles.docPDF}
                                                  />
                                                  {doc.BaseName}
                                                </a>
                                              </TableCell>
                                              <TableCell align="right">
                                                <Moment format="MMMM, Do, YYYY">
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
                            <List
                              style={{ marginLeft: "25px" }}
                              component="nav"
                            >
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
                                        style={{
                                          backgroundColor: "#0c69cc",
                                          color: "white"
                                        }}
                                      >
                                        <TableRow>
                                          <TableCell
                                            className={styles.tblHeadCell}
                                          >
                                            Name
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
                                        {this.state.communityFormsCollection.map(
                                          doc => (
                                            <TableRow key={doc.ID}>
                                              <TableCell
                                                component="th"
                                                scope="doc"
                                              >
                                                <a
                                                  className={styles.docLink}
                                                  target="_blank"
                                                  href={doc.EncodedAbsUrl}
                                                >
                                                  <PictureAsPdfIcon
                                                    className={styles.docPDF}
                                                  />
                                                  {doc.BaseName}
                                                </a>
                                              </TableCell>
                                              <TableCell align="right">
                                                <Moment format="MMMM, Do, YYYY">
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
                            <List
                              style={{ marginLeft: "25px" }}
                              component="nav"
                            >
                              <ListItem
                                button
                                selected={
                                  this.state
                                    .communityFinancialInformation_IsSelected
                                }
                                onClick={event => {
                                  this.setState({
                                    communityFinancialInformation_IsOpen: !this
                                      .state
                                      .communityFinancialInformation_IsOpen,
                                    communityFinancialInformation_IsSelected: !this
                                      .state
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
                            {this.state.communityFinancialInformation_IsOpen !==
                            false ? (
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
                                        style={{
                                          backgroundColor: "#0c69cc",
                                          color: "white"
                                        }}
                                      >
                                        <TableRow>
                                          <TableCell
                                            className={styles.tblHeadCell}
                                          >
                                            Name
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
                                        {this.state.communityFormsCollection.map(
                                          doc => (
                                            <TableRow key={doc.ID}>
                                              <TableCell
                                                component="th"
                                                scope="doc"
                                              >
                                                <a
                                                  className={styles.docLink}
                                                  target="_blank"
                                                  href={doc.EncodedAbsUrl}
                                                >
                                                  <PictureAsPdfIcon
                                                    className={styles.docPDF}
                                                  />
                                                  {doc.BaseName}
                                                </a>
                                              </TableCell>
                                              <TableCell align="right">
                                                <Moment format="MMMM, Do, YYYY">
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
                            <List
                              style={{ marginLeft: "25px" }}
                              component="nav"
                            >
                              <ListItem
                                button
                                selected={
                                  this.state.communityDividends_IsSelected
                                }
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
                                        style={{
                                          backgroundColor: "#0c69cc",
                                          color: "white"
                                        }}
                                      >
                                        <TableRow>
                                          <TableCell
                                            className={styles.tblHeadCell}
                                          >
                                            Name
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
                                              <TableCell
                                                component="th"
                                                scope="doc"
                                              >
                                                <a
                                                  className={styles.docLink}
                                                  target="_blank"
                                                  href={doc.EncodedAbsUrl}
                                                >
                                                  <PictureAsPdfIcon
                                                    className={styles.docPDF}
                                                  />
                                                  {doc.BaseName}
                                                </a>
                                              </TableCell>
                                              <TableCell align="right">
                                                <Moment format="MMMM, Do, YYYY">
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
                            <List
                              style={{ marginLeft: "25px" }}
                              component="nav"
                            >
                              <ListItem
                                button
                                selected={
                                  this.state.communityDocuments_IsSelected
                                }
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
                                        style={{
                                          backgroundColor: "#0c69cc",
                                          color: "white"
                                        }}
                                      >
                                        <TableRow>
                                          <TableCell
                                            className={styles.tblHeadCell}
                                          >
                                            Name
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
                                              <TableCell
                                                component="th"
                                                scope="doc"
                                              >
                                                <a
                                                  className={styles.docLink}
                                                  target="_blank"
                                                  href={doc.EncodedAbsUrl}
                                                >
                                                  <PictureAsPdfIcon
                                                    className={styles.docPDF}
                                                  />
                                                  {doc.BaseName}
                                                </a>
                                              </TableCell>
                                              <TableCell align="right">
                                                <Moment format="MMMM, Do, YYYY">
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container">&nbsp;</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

{
  // <div
  //                             style={{
  //                               marginLeft: "75px",
  //                               marginBottom: "10px",
  //                               marginTop: "20px"
  //                             }}
  //                           >
  //                             <Paper>
  //                               <Table aria-label="simple table">
  //                                 <TableHead
  //                                   style={{
  //                                     backgroundColor: "#0c69cc",
  //                                     color: "white"
  //                                   }}
  //                                 >
  //                                   <TableRow>
  //                                     <TableCell className={styles.tblHeadCell}>
  //                                       Name
  //                                     </TableCell>
  //                                     <TableCell
  //                                       className={styles.tblHeadCell}
  //                                       align="right"
  //                                     >
  //                                       Last Modified
  //                                     </TableCell>
  //                                   </TableRow>
  //                                 </TableHead>
  //                                 <TableBody>
  //                                   {this.state.communityDocumentsCollection.map(
  //                                     doc => (
  //                                       <TableRow key={doc.ID}>
  //                                         <TableCell component="th" scope="doc">
  //                                           <a
  //                                             className={styles.docLink}
  //                                             target="_blank"
  //                                             href={doc.EncodedAbsUrl}
  //                                           >
  //                                             <PictureAsPdfIcon
  //                                               className={styles.docPDF}
  //                                             />
  //                                             {doc.BaseName}
  //                                           </a>
  //                                         </TableCell>
  //                                         <TableCell align="right">
  //                                           <Moment format="MMMM, Do, YYYY">
  //                                             {doc.Created}
  //                                           </Moment>
  //                                         </TableCell>
  //                                       </TableRow>
  //                                     )
  //                                   )}
  //                                 </TableBody>
  //                               </Table>
  //                             </Paper>
  //                           </div>
  /* <Table aria-label="simple table">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>
                                        Dessert (100g serving)
                                      </TableCell>
                                      <TableCell align="right">
                                        Calories
                                      </TableCell>
                                      <TableCell align="right">
                                        Fat&nbsp;(g)
                                      </TableCell>
                                      <TableCell align="right">
                                        Carbs&nbsp;(g)
                                      </TableCell>
                                      <TableCell align="right">
                                        Protein&nbsp;(g)
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell component="th" scope="row">
                                        Frozen yoghurt
                                      </TableCell>
                                      <TableCell align="right">159</TableCell>
                                      <TableCell align="right">6</TableCell>
                                      <TableCell align="right">124</TableCell>
                                      <TableCell align="right">4</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell component="th" scope="row">
                                        Ice cream sandwich
                                      </TableCell>
                                      <TableCell align="right">237</TableCell>
                                      <TableCell align="right">9</TableCell>
                                      <TableCell align="right">37</TableCell>
                                      <TableCell align="right">4.3</TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table> */
}
