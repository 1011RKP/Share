import * as React from "react";
import styles from "./dashboard.module.scss";
import {
  Dialog,
  DialogType,
  DialogFooter
} from "office-ui-fabric-react/lib/Dialog";
import {
  Modal,
  IModalProps,
  IDragOptions
} from "office-ui-fabric-react/lib/Modal";
import { getId } from "office-ui-fabric-react/lib/Utilities";
import {
  hiddenContentStyle,
  mergeStyles
} from "office-ui-fabric-react/lib/Styling";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExternalLinkSquareAlt,
  faCheckCircle,
  faTimesCircle,
  faFilePdf
} from "@fortawesome/free-solid-svg-icons";
import { IDialogBasicExampleState } from "../common/common";
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";
import { sp, Items } from "@pnp/sp";
import * as jQuery from "jquery";
import Moment from "react-moment";

const screenReaderOnly = mergeStyles(hiddenContentStyle);
export class DashBoard extends React.Component<any, any> {
  public constructor(props: any, state: any) {
    super(props);
    this.upComingEvents_Announcements_HTML = this.upComingEvents_Announcements_HTML.bind(
      this
    );
    this._showRecentlyUploadedDocuments = this._showRecentlyUploadedDocuments.bind(
      this
    );
    this.shareHolders_HTML = this.shareHolders_HTML.bind(this);
    this.upComingEvents_Announcements_Data = this.upComingEvents_Announcements_Data.bind(
      this
    );
    this.documents_StockDistributions_Data = this.documents_StockDistributions_Data.bind(
      this
    );
    this.state = {
      hideDialog: true,
      viewMoreData: null,
      dialogTitle: null,
      upComingEvents_Data: [],
      announcements_Data: [],
      recentlyUploadedDocuments_Data: []
    };
  }

  public componentDidMount() {
    this.upComingEvents_Announcements_Data();
    this.documents_StockDistributions_Data();
  }

  private _showDialogforAnnouncements = (): void => {
    this.setState({
      hideDialog: false,
      dialogTitle: "Announcements",
      viewMoreData: (
        <div className="row-fluid">
          {this.state.announcements_Data.map((item, i) => {
            return (
              <div className="col-md-12 border-bottom border-primary">
                <div className="row">
                  <p className={styles.upcomingEventsP}>
                    <strong>
                      <Moment format="MMMM, Do, YYYY">{item.Date}</Moment>
                    </strong>
                  </p>
                </div>
                <div className="row">
                  <p className={styles.upcomingEventsP}>
                    <em> {item.Title}</em>
                  </p>
                </div>
                <div className="row">
                  <p
                    className={styles.upcomingEventsP}
                    dangerouslySetInnerHTML={{ __html: item.Description }}
                  ></p>
                </div>
              </div>
            );
          })}
        </div>
      )
    });
  };

  private _showRecentlyUploadedDocuments = (): void => {
    this.setState({
      hideDialog: false,
      dialogTitle: "Recently Uploaded Documents",
      viewMoreData: (
        <div className="row-fluid">
          <div className="col-md-12">
            <table className={`${styles.tblAlign} table table-hover`}>
              {this.state.recentlyUploadedDocuments_Data.map((item, i) => {
                return (
                  <tr>
                    <td>
                      <a
                        className={styles.DocLink}
                        target="_blank"
                        href={item.EncodedAbsUrl}
                      >
                        <FontAwesomeIcon
                          icon={faFilePdf}
                          className={styles.pdfIcon}
                        />
                        {item.Title}
                      </a>
                    </td>
                    <td>
                      <p className={styles.upcomingEventsP}>
                        <strong>
                          <Moment format="MMM D, YYYY">{item.Created}</Moment>
                        </strong>
                      </p>
                    </td>
                  </tr>
                );
              })}
            </table>
          </div>
        </div>
      )
    });
  };

  private _showDialogforEvents = (): void => {
    this.setState({
      hideDialog: false,
      dialogTitle: "Upcoming Events",
      viewMoreData: (
        <div className="row-fluid">
          {this.state.upComingEvents_Data.map((item, i) => {
            return (
              <div className="col-md-12 border-bottom border-primary">
                <div className="row">
                  <p className={styles.upcomingEventsP}>
                    <strong>
                      <Moment format="MMMM, Do, YYYY">{item.Date}</Moment>
                    </strong>
                  </p>
                </div>
                <div className="row">
                  <p className={styles.upcomingEventsP}>
                    <em> {item.Title}</em>
                  </p>
                </div>
                <div className="row">
                  <p
                    className={styles.upcomingEventsP}
                    dangerouslySetInnerHTML={{ __html: item.Description }}
                  ></p>
                </div>
              </div>
            );
          })}
        </div>
      )
    });
  };

  private _closeDialog = (): void => {
    this.setState({ hideDialog: true });
  };

  public shareHolders_HTML() {
    let shareHolders = (
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12">
          <div className="card">
            <div className={`${styles.cardbgwarning} text-black rounded-top`}>
              <div className={`${styles.cardheadpadding} card-header`}>
                <h6 className={styles.shareHolderTitle}>Shareholdings</h6>
              </div>
            </div>
            <div className={`${styles.cardheadpadding} card-body`}>
              <div className="row-fluid">
                <table className={`${styles.tblAll} table`}>
                  <thead className="thead-light">
                    <tr>
                      <th>Shareholding Name</th>
                      <th>Account ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={styles.shareHoldertd}>
                        <span>John</span>
                        <br />
                        <Router>
                          <div>
                            <Link to="/shareholders">View Details</Link>
                          </div>
                        </Router>
                        {/* <span className={styles.viewDetails}>{modelHtml}</span> */}
                      </td>
                      <td>156854</td>
                    </tr>
                    <tr>
                      <td className={styles.shareHoldertd}>
                        <span>Mary</span>
                        <br />
                        <Router>
                          <div>
                            <Link to="/shareholders">View Details</Link>
                          </div>
                        </Router>
                        {/* <span className={styles.viewDetails}>{modelHtml}</span> */}
                      </td>
                      <td>874532</td>
                    </tr>
                    <tr>
                      <td className={styles.shareHoldertd}>
                        <span>July</span>
                        <br />
                        <Router>
                          <div>
                            <Link to="/shareholders">View Details</Link>
                          </div>
                        </Router>
                        {/* <span className={styles.viewDetails}>{modelHtml}</span> */}
                      </td>
                      <td>452189</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    return shareHolders;
  }

  public upComingEvents_Announcements_HTML() {
    let upcomingevents = (
      <div className="row">
        <div className="col-lg-6 col-md-6 col-sm-6">
          <div className="card">
            <div className={`${styles.cardbgwarning} text-black rounded-top`}>
              <div className={`${styles.cardheadpadding} card-header`}>
                <h6 className={styles.shareHolderTitle}>Upcoming Events</h6>
                <a className={`${styles.upcomingEventsAdminLink} float-right`}>
                  <FontAwesomeIcon
                    icon={faExternalLinkSquareAlt}
                    className={styles.awesomeIconStyle}
                  />
                </a>
              </div>
            </div>
            <div className={`${styles.cardbdypadding} card-body`}>
              <div className="row-fluid">
                {this.state.upComingEvents_Data.map((item, i) => {
                  if (i < 2) {
                    return (
                      <div className="col-md-12 border-bottom border-primary">
                        <div className="row">
                          <p className={styles.upcomingEventsP}>
                            <strong>
                              <Moment format="MMMM, Do, YYYY">
                                {item.Date}
                              </Moment>
                            </strong>
                          </p>
                        </div>
                        <div className="row">
                          <p className={styles.upcomingEventsP}>
                            <em> {item.Title}</em>
                          </p>
                        </div>
                        <div className="row">
                          <p
                            className={styles.upcomingEventsP}
                            dangerouslySetInnerHTML={{
                              __html: item.Description
                            }}
                          ></p>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
              <div className="row-fluid">
                <div className="container-fluid">
                  <button
                    onClick={this._showDialogforEvents}
                    style={{ cursor: "pointer" }}
                    className={`${styles.viewMorebtn} btn`}
                  >
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span> View Details</span>
                  </button>
                  <Dialog
                    hidden={this.state.hideDialog}
                    onDismiss={this._closeDialog}
                    containerClassName={styles.textDialog}
                    className={styles.textDialog}
                    dialogContentProps={{
                      type: DialogType.largeHeader,
                      title: this.state.dialogTitle
                    }}
                    modalProps={{
                      isBlocking: false,
                      //className:{styles.textDialog},
                      styles: { main: { maxWidth: "700px!important" } }
                    }}
                  >
                    {this.state.viewMoreData}
                    <DialogFooter>
                      <button
                        type="button"
                        className={`${styles.customBtn} btn btn-danger`}
                        onClick={this._closeDialog}
                      >
                        <FontAwesomeIcon icon={faTimesCircle} />
                        <span> Close</span>
                      </button>
                    </DialogFooter>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-6">
          <div className="card">
            <div className={`${styles.cardbgwarning} text-black rounded-top`}>
              <div className={`${styles.cardheadpadding} card-header`}>
                <h6 className={styles.shareHolderTitle}>Announcements </h6>
                <a className={`${styles.upcomingEventsAdminLink} float-right`}>
                  <FontAwesomeIcon
                    icon={faExternalLinkSquareAlt}
                    className={styles.awesomeIconStyle}
                  />
                </a>
              </div>
            </div>
            <div className={`${styles.cardbdypadding} card-body`}>
              <div className="row-fluid">
                {this.state.announcements_Data.map((item, i) => {
                  if (i < 2) {
                    return (
                      <div className="col-md-12 border-bottom border-primary">
                        <div className="row">
                          <p className={styles.upcomingEventsP}>
                            <strong>
                              <Moment format="MMMM, Do, YYYY">
                                {item.Date}
                              </Moment>
                            </strong>
                          </p>
                        </div>
                        <div className="row">
                          <p className={styles.upcomingEventsP}>
                            <em> {item.Title}</em>
                          </p>
                        </div>
                        <div className="row">
                          <p
                            className={styles.upcomingEventsP}
                            dangerouslySetInnerHTML={{
                              __html: item.Description
                            }}
                          ></p>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
              <div className="row-fluid">
                <div className="container-fluid">
                  <button
                    onClick={e => this._showDialogforAnnouncements()}
                    style={{ cursor: "pointer" }}
                    className={`${styles.viewMorebtn} btn`}
                  >
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span> View Details</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    return upcomingevents;
  }

  public upComingEvents_Announcements_Data() {
    sp.web.lists
      .getByTitle("Upcoming Events")
      .items.select("ID", "Title", "Date", "Description")
      .orderBy("Date", true)
      .get()
      .then(d => {
        this.setState({
          upComingEvents_Data: d
        });
        console.log(this.state.upComingEvents_Data);
      });
    sp.web.lists
      .getByTitle("Announcements")
      .items.select("ID", "Title", "Date", "Description")
      .orderBy("Date", true)
      .get()
      .then(d => {
        this.setState({
          announcements_Data: d
        });
        console.log(this.state.announcements_Data);
      });
  }

  public documents_StockDistributions_HTML() {
    let upcomingevents = (
      <div className="row">
        <div className="col-lg-6 col-md-6 col-sm-6">
          <div className="card">
            <div className={`${styles.cardbgwarning} text-black rounded-top`}>
              <div className={`${styles.cardheadpadding} card-header`}>
                <h6 className={styles.shareHolderTitle}>
                  Recently Uploaded Documents
                </h6>
                <a className={`${styles.upcomingEventsAdminLink} float-right`}>
                  <FontAwesomeIcon
                    icon={faExternalLinkSquareAlt}
                    className={styles.awesomeIconStyle}
                  />
                </a>
              </div>
            </div>
            <div className={`${styles.cardbdypadding} card-body`}>
              <div className="row-fluid">
                <div className="col-md-12">
                  <table className={`${styles.tblAlign} table table-hover`}>
                    {this.state.recentlyUploadedDocuments_Data.map(
                      (item, i) => {
                        if (i < 4) {
                          return (
                            <tr>
                              <td>
                                <a
                                  className={styles.DocLink}
                                  target="_blank"
                                  href={item.EncodedAbsUrl}
                                >
                                  <FontAwesomeIcon
                                    icon={faFilePdf}
                                    className={styles.pdfIcon}
                                  />
                                  {item.Title}
                                </a>
                              </td>
                              <td>
                                <p className={styles.upcomingEventsP}>
                                  <strong>
                                    <Moment format="MMM D, YYYY">
                                      {item.Created}
                                    </Moment>
                                  </strong>
                                </p>
                              </td>
                            </tr>
                          );
                        }
                      }
                    )}
                  </table>
                </div>
              </div>
              <div className="row-fluid">
                <div className="container-fluid">
                  <button
                    onClick={this._showRecentlyUploadedDocuments}
                    style={{ cursor: "pointer" }}
                    className={`${styles.viewMorebtn} btn`}
                  >
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span> View Details</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-6"></div>
      </div>
    );
    return upcomingevents;
  }

  public documents_StockDistributions_Data() {
    sp.web.lists
      .getByTitle("Shareholders Documents")
      .items.select(
        "EncodedAbsUrl",
        "ID",
        "Title",
        "EncodedAbsUrl",
        "File_x0020_Type",
        "Created"
      )
      .orderBy("ID", true)
      .get()
      .then(d => {
        this.setState({
          recentlyUploadedDocuments_Data: d
        });
        console.log(this.state.recentlyUploadedDocuments_Data);
      });
    // sp.web.lists
    //   .getByTitle("Announcements")
    //   .items.select("ID", "Title", "Date", "Description")
    //   .orderBy("Date", true)
    //   .get()
    //   .then(d => {
    //     this.setState({
    //       announcements_Data: d
    //     });
    //     console.log(this.state.announcements_Data);
    //   });
  }

  public render(): React.ReactElement<any> {
    let upcomingevents = this.upComingEvents_Announcements_HTML();
    let shareHolders = this.shareHolders_HTML();
    let documents_StockDistributions = this.documents_StockDistributions_HTML();
    return (
      <div className={styles.dashboard}>
        <div className="row-fluid">
          <div className={`${styles.dashBoardHead} row`}>
            <h2>Dashboard</h2>
          </div>
          <div className={`${styles.dashBoardBody} row`}>
            <div className="container-fluid">
              <div className="row-fluid">{shareHolders}</div>
            </div>
            <div className="container">&nbsp;</div>
            <div className="container-fluid">{upcomingevents}</div>
            <div className="container">&nbsp;</div>
            <div className="container-fluid">
              {documents_StockDistributions}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
{
  // private _showMoreAnnouncements = (): void => {
  //   this.setState({
  //     hideMoreAnnouncements: false,
  //     viewMoreAnnouncementsData: (
  //       <div className="row-fluid">
  //         {this.state.announcements_Data.map((item, i) => {
  //           return (
  //             <div className="col-md-12 border-bottom border-primary">
  //               <div className="row">
  //                 <p className={styles.upcomingEventsP}>
  //                   <strong>
  //                     <Moment format="MMMM, Do, YYYY">{item.Date}</Moment>
  //                   </strong>
  //                 </p>
  //               </div>
  //               <div className="row">
  //                 <p className={styles.upcomingEventsP}>
  //                   <em> {item.Title}</em>
  //                 </p>
  //               </div>
  //               <div className="row">
  //                 <p className={styles.upcomingEventsP} dangerouslySetInnerHTML={{ __html: item.Description }}></p>
  //               </div>
  //             </div>
  //           );
  //         })}
  //       </div>
  //     )
  //   });
  // };
  // private _closeMoreAnnouncements = (): void => {
  //   this.setState({ hideMoreAnnouncements: true });
  // };
  // private _showUpComingEvents = (): void => {
  //   this.setState({
  //     hideUpComingEvents: false,
  //     viewMoreData: (
  //       <div className="row-fluid">
  //         {this.state.upComingEvents_Data.map((item, i) => {
  //           return (
  //             <div className="col-md-12 border-bottom border-primary">
  //               <div className="row">
  //                 <p className={styles.upcomingEventsP}>
  //                   <strong>
  //                     <Moment format="MMMM, Do, YYYY">{item.Date}</Moment>
  //                   </strong>
  //                 </p>
  //               </div>
  //               <div className="row">
  //                 <p className={styles.upcomingEventsP}>
  //                   <em> {item.Title}</em>
  //                 </p>
  //               </div>
  //               <div className="row">
  //                 <p className={styles.upcomingEventsP} dangerouslySetInnerHTML={{ __html: item.Description }}></p>
  //               </div>
  //             </div>
  //           );
  //         })}
  //       </div>
  //     )
  //   });
  // };
  // private _closeUpComingEvents = (): void => {
  //   this.setState({ hideUpComingEvents: true });
  // };
  // public viewMore_dialog(type) {
  //   let subject;
  //   if (type == "upComingEvents") {
  //     subject = (
  //       <div className="row-fluid">
  //         {this.state.upComingEvents_Data.map((item, i) => {
  //           return (
  //             <div className="col-md-12 border-bottom border-primary">
  //               <div className="row">
  //                 <p className={styles.upcomingEventsP}>
  //                   <strong>
  //                     <Moment format="MMMM, Do, YYYY">{item.Date}</Moment>
  //                   </strong>
  //                 </p>
  //               </div>
  //               <div className="row">
  //                 <p className={styles.upcomingEventsP}>
  //                   <em> {item.Title}</em>
  //                 </p>
  //               </div>
  //               <div className="row">
  //                 <p className={styles.upcomingEventsP} dangerouslySetInnerHTML={{ __html: item.Description }}></p>
  //               </div>
  //             </div>
  //           );
  //         })}
  //       </div>
  //     );
  //   } else {
  //     subject = (
  //       <div className="row-fluid">
  //         {this.state.announcements_Data.map((item, i) => {
  //           return (
  //             <div className="col-md-12 border-bottom border-primary">
  //               <div className="row">
  //                 <p className={styles.upcomingEventsP}>
  //                   <strong>
  //                     <Moment format="MMMM, Do, YYYY">{item.Date}</Moment>
  //                   </strong>
  //                 </p>
  //               </div>
  //               <div className="row">
  //                 <p className={styles.upcomingEventsP}>
  //                   <em> {item.Title}</em>
  //                 </p>
  //               </div>
  //               <div className="row">
  //                 <p className={styles.upcomingEventsP} dangerouslySetInnerHTML={{ __html: item.Description }}></p>
  //               </div>
  //             </div>
  //           );
  //         })}
  //       </div>
  //     );
  //   }
  //   let l = (
  //     <div className="container-fluid">
  //       <button onClick={this._showDialog} style={{ cursor: "pointer" }} className={`${styles.viewMorebtn} btn`}>
  //         <FontAwesomeIcon icon={faCheckCircle} />
  //         <span> View Details</span>
  //       </button>
  //       <Dialog
  //         hidden={this.state._hideDialog}
  //         onDismiss={this._closeDialog}
  //         containerClassName={styles.textDialog}
  //         dialogContentProps={{
  //           type: DialogType.normal,
  //           title: "Upcoming Events"
  //         }}
  //         modalProps={{
  //           isBlocking: false,
  //           styles: { main: { maxWidth: "700px!important" } }
  //         }}
  //       >
  //         {subject}
  //         <DialogFooter>
  //           <button type="button" className={`${styles.customBtn} btn btn-primary`}>
  //             <FontAwesomeIcon icon={faCheckCircle} />
  //             <span> Send</span>
  //           </button>
  //           <button type="button" className={`${styles.customBtn} btn btn-danger`}>
  //             <FontAwesomeIcon icon={faTimesCircle} />
  //             <span> Close</span>
  //           </button>
  //         </DialogFooter>
  //       </Dialog>
  //     </div>
  //   );
  //   return l;
  // }
  // public announcements_Data() {
  //   sp.web.lists
  //     .getByTitle("Announcements")
  //     .items.select("ID", "Title", "Date", "Description")
  //     .orderBy("Date", true)
  //     .get()
  //     .then(d => {
  //       this.setState({
  //         announcements_Data: d
  //       });
  //       console.log(this.state.announcements_Data);
  //     });
  // }
  // public announcements_HTML() {
  //   //let viewMore_dialog = this.viewMore_dialog("announcements");
  //   let announcements = (
  //     <div className="card">
  //       <div className={`${styles.cardbgwarning} text-black rounded-top`}>
  //         <div className={`${styles.cardheadpadding} card-header`}>
  //           <h6 className={styles.shareHolderTitle}>Announcements </h6>
  //           <a className={`${styles.upcomingEventsAdminLink} float-right`}>
  //             <FontAwesomeIcon icon={faExternalLinkSquareAlt} className={styles.awesomeIconStyle} />
  //           </a>
  //         </div>
  //       </div>
  //       <div className={`${styles.cardbdypadding} card-body`}>
  //         <div className="row-fluid">
  //           {this.state.announcements_Data.map((item, i) => {
  //             if (i < 2) {
  //               return (
  //                 <div className="col-md-12 border-bottom border-primary">
  //                   <div className="row">
  //                     <p className={styles.upcomingEventsP}>
  //                       <strong>
  //                         <Moment format="MMMM, Do, YYYY">{item.Date}</Moment>
  //                       </strong>
  //                     </p>
  //                   </div>
  //                   <div className="row">
  //                     <p className={styles.upcomingEventsP}>
  //                       <em> {item.Title}</em>
  //                     </p>
  //                   </div>
  //                   <div className="row">
  //                     <p className={styles.upcomingEventsP} dangerouslySetInnerHTML={{ __html: item.Description }}>
  //                       {/* {escape(item.Description).replace(/[\n\r]/g, "<br>")} */}
  //                       {/* {item.Description} */}
  //                     </p>
  //                   </div>
  //                 </div>
  //               );
  //             }
  //           })}
  //         </div>
  //         <div className="row-fluid">
  //           <div className="container-fluid">
  //             <button onClick={this._showDialog} style={{ cursor: "pointer" }} className={`${styles.viewMorebtn} btn`}>
  //               <FontAwesomeIcon icon={faCheckCircle} />
  //               <span> View Details</span>
  //             </button>
  //             <Dialog
  //               hidden={this.state.hideDialog}
  //               onDismiss={this._closeDialog}
  //               containerClassName={styles.textDialog}
  //               dialogContentProps={{
  //                 type: DialogType.normal,
  //                 title: "Announcements"
  //               }}
  //               modalProps={{
  //                 isBlocking: false,
  //                 styles: { main: { maxWidth: "700px!important" } }
  //               }}
  //             >
  //               <div className="row-fluid">
  //                 {this.state.announcements_Data.map((item, i) => {
  //                   return (
  //                     <div className="col-md-12 border-bottom border-primary">
  //                       <div className="row">
  //                         <p className={styles.upcomingEventsP}>
  //                           <strong>
  //                             <Moment format="MMMM, Do, YYYY">{item.Date}</Moment>
  //                           </strong>
  //                         </p>
  //                       </div>
  //                       <div className="row">
  //                         <p className={styles.upcomingEventsP}>
  //                           <em> {item.Title}</em>
  //                         </p>
  //                       </div>
  //                       <div className="row">
  //                         <p className={styles.upcomingEventsP} dangerouslySetInnerHTML={{ __html: item.Description }}></p>
  //                       </div>
  //                     </div>
  //                   );
  //                 })}
  //               </div>
  //               <DialogFooter>
  //                 <button type="button" className={`${styles.customBtn} btn btn-primary`} onClick={this._closeDialog}>
  //                   <FontAwesomeIcon icon={faCheckCircle} />
  //                   <span> Send</span>
  //                 </button>
  //                 <button type="button" className={`${styles.customBtn} btn btn-danger`} onClick={this._closeDialog}>
  //                   <FontAwesomeIcon icon={faTimesCircle} />
  //                   <span> Close</span>
  //                 </button>
  //               </DialogFooter>
  //             </Dialog>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  //   return announcements;
  // }
  /* <div className="container">{modelHtml}</div> */
  //! Multiple Class Names and a custom Class Name all together
  //!    className={`${[styles.cardbgwarning, styles.carpadding].join(' ')} text-black`}
  /*{
   <div className="col-md-12 border-bottom border-primary">
              <div className="row">
                <p className={styles.upcomingEventsP}>
                  <strong>Third quarter Financial Statement</strong>
                </p>
              </div>
              <div className="row">
                <p className={styles.upcomingEventsP}>
                  <em>Friday, November 16, 2018</em>
                </p>
              </div>
              <div className="row">
                <p className={styles.upcomingEventsP}>Lorem ipsum dolor sit amet, consectetur adipiscing elit consectetur adipiscing elit</p>
              </div>
            </div>
            <div className="col-md-12 border-bottom border-primary">
              <div className="row">
                <p className={styles.upcomingEventsP}>
                  <strong> Third quarter Wawa owner's Reports</strong>
                </p>
              </div>
              <div className="row">
                <p className={styles.upcomingEventsP}>
                  <em> Monday, November 12, 2018</em>
                </p>
              </div>
              <div className="row">
                <p className={styles.upcomingEventsP}>Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit</p>
              </div>
            </div>
          
}*/
  /* {<div className="col-md-12 border-bottom border-primary">
                  <div className="row">
                    <p className={styles.upcomingEventsP}>
                      <strong>Friday, December 21, 2018</strong>
                    </p>
                  </div>
                  <div className="row">
                    <p className={styles.upcomingEventsP}>
                      <em> Wawa Fourth Quarter Tender Offer Closes</em>
                    </p>
                  </div>
                  <div className="row">
                    <p className={styles.upcomingEventsP}>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                  </div>
                </div>
                <div className="col-md-12 border-bottom border-primary"> 
                  <div className="row">
                    <p className={styles.upcomingEventsP}>
                      <strong> Sunday, December 30, 2018</strong>
                    </p>
                  </div>
                  <div className="row">
                    <p className={styles.upcomingEventsP}>
                      <em> Wawa Fisical Year End</em>
                    </p>
                  </div>
                  <div className="row">
                    <p className={styles.upcomingEventsP}>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                  </div>
                </div>
}*/
}
