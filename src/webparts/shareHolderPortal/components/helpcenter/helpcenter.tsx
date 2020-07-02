import {
  Button,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  FormControl,
  FormLabel,
  Snackbar,
  TextareaAutosize,
  TextField,
  Typography,
  FormHelperText,
  SnackbarContent
} from "@material-ui/core";
import Popover from "@material-ui/core/Popover";
import CancelIcon from "@material-ui/icons/Cancel";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SaveIcon from "@material-ui/icons/Save";
import { sp, EmailProperties } from "@pnp/sp";
import { ItemAddResult, Web } from "@pnp/sp";
import { CustomTextField, CustomButton } from "../common/common";
import * as React from "react";
import styles from "./helpcenter.module.scss";
import { devURL, SSOEmail } from "../common/common";
import { CurrentUser } from "@pnp/sp/src/siteusers";
import pnp from "@pnp/pnpjs";
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from "@microsoft/sp-http";

// export const reqOptions: ISPHttpClientOptions  = {
//   headers: {
//     "Accept": "application/json;odata=verbose",
//     "Content-Type": "application/json;odata=verbose",
//     "odata-version":"3.0",
//   },
//   // rest of your code
// }

export class HelpCenter extends React.Component<any, any> {
  public constructor(props: any, state: any) {
    super(props);
    this.state = {
      properties: this.props.properties,
      faqCollection: [],
      currentUserName: "",
      expanded: "",
      isExpanded: false,
      subject: "",
      message: "",
      error: false,
      tenentURL: this.props.properties.tenentURL,
      shareholdingHelpCenter_Link :this.props.properties.tenentURL + devURL + "/ShareholdingHelpCenter/Allitemsg.aspx",
      open: false,
      openPopover: false,
      subject_Error: false,
      message_Error: false,

      catchException: false,

      pageContext:this.props.properties.pageContext
    };
  }

  public componentDidMount() {
    console.log(this.state.pageContext);
    this.setState(
      {
        tenentURL: this.state.tenentURL + devURL
      },
      () => {
        let newWeb = new Web(this.state.tenentURL);
        this.getFAQS(newWeb);
      }
    );
  }

  public getFAQS = newWeb => {
    newWeb.lists
      .getByTitle("Shareholding Help Center")
      .items.select("Title", "answer", "ID")
      .orderBy("ID", true)
      .get()
      .then(d => {
        if (d.length > 0) {
          this.setState(prevState => ({
            ...prevState,
            faqCollection: d
          }));
        }
      })
      .catch(e => {
        console.error(e);
      });
  }

  public handleChange = (panel: string) => (
    event: React.ChangeEvent<{}>,
    isitExpanded: boolean
  ) => {
    console.log(panel, isitExpanded);
    this.setState({
      expanded: panel,
      isExpanded: isitExpanded
    });
  }

  public handleSubmit = () => {
    let error = {
      subject_Error: this.state.subject_Error,
      message_Error: this.state.message_Error
    };

    if (this.state.subject === "") {
      this.setState({ subject_Error: true });
      error.subject_Error = true;
    } else {
      error.subject_Error = false;
    }
    if (this.state.message === "") {
      this.setState({ message_Error: true });
      error.message_Error = true;
    } else {
      error.message_Error = false;
    }
    const identifiers = Object.keys(error);
    const activeError = identifiers.filter(id => {
      return error[id];
    });
    if (activeError.length === 0) {
      this.postNewQuestion();
    }
  }

  public postNewQuestion = () => {
    let newWeb = new Web(this.state.tenentURL);
    console.log(newWeb);
    newWeb.lists
      .getByTitle("Shareholding Help Request")
      .items.add({
        Title: this.state.subject,
        message: this.state.message
      })
      .then((iar: ItemAddResult) => {
        this.sendEmail();
      })
      .catch(e => {
        console.error(e);
        this.setState(
          {
            catchException: true
          },
          () => {
            setTimeout(() => {
              this.setState({ catchException: false });
            }, 5000);
          }
        );
      });
  }

  protected sendEmail = async () => {
    console.log("stated Sed Mail");
    let newWeb = new Web(this.state.tenentURL);
    newWeb.currentUser.get().then((r: CurrentUser) => {
      console.log(r);
      let e = r["Title"].toString();
      const reqOptions: ISPHttpClientOptions = {
        headers: {
          "Accept": "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
          "odata-version":"3.0",
        },
        body: JSON.stringify({
          properties: {
            __metadata: { type: "SP.Utilities.EmailProperties" },
            To: { results: [SSOEmail] },
            Body:
              e +
              " Submitted a Frequently Asked Questions. <br/>" +
              "<b> Subject: </b>" +
              this.state.subject +
              " <br/> <b> Message: </b>" +
              this.state.message,
            Subject: "New FAQ was submitted by " + e,
          },
        }),
      };
      this.props.properties.pageContext
        .post(
          this.state.tenentURL + "/_api/SP.Utilities.Utility.SendEmail",
          SPHttpClient.configurations.v1,
          reqOptions
        )
        .then((response: SPHttpClientResponse) => {
          console.log(`Status code: ${response.status}`);
          console.log(`Status text: ${response.statusText}`);
          response.json().then((responseJSON: JSON) => {
            console.log(responseJSON);
            this.setState(
              {
                open: !this.state.open,
                subject: "",
                message: "",
              },
              () => {}
            );
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  public adminLink = () => {
    let adminLink = (
      <React.Fragment>
        {this.state.openPopover === true ? (
          <div className={styles.popOverMessage}>
            Click to Add/Edit Help Center content
          </div>
        ) : null}
        <div style={{ marginTop: "-30px", float: "right" }}>
          <div
            onMouseEnter={() => {
              this.setState({
                openPopover: true
              });
            }}
            onMouseLeave={() => {
              this.setState({
                openPopover: false
              });
            }}
          >
            <a
              onClick={() => {
                window.open(this.state.shareholdingHelpCenter_Link);
                return false;
              }}
              target="_blank"
            >
              <VerifiedUserIcon style={{ color: "black" }} />
            </a>
          </div>
        </div>
      </React.Fragment>
    );

    return adminLink;
  }

  public callExceptionError = () => {
    let _html = (
      <React.Fragment>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          autoHideDuration={3000}
          open={this.state.catchException}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
        >
          <SnackbarContent
            style={{ backgroundColor: "#dc3545" }}
            message={
              <div id="message-id">
                <CheckCircleIcon
                  style={{
                    marginRight: "5px!important"
                  }}
                />
                Data that you entered is not valid Please contact Shareholder
                Services Office.
                <CancelIcon
                  style={{
                    marginLeft: "50px!important",
                    cursor: "pointer"
                  }}
                  onClick={e => {
                    this.setState({
                      catchException: false
                    });
                  }}
                />
              </div>
            }
          ></SnackbarContent>
        </Snackbar>
      </React.Fragment>
    );
    return _html;
  }

  public render(): React.ReactElement<any> {
    const error = this.state.error;
    let adminLink = this.adminLink();
    return (
      <div className={styles.helpCenter}>
        <div className={styles.contentHead}>
          <h2>Frequently Asked Questions</h2>
          {this.state.properties.isCurrentUserAdmin === true ? (
            <div>{adminLink}</div>
          ) : null}
        </div>
        <div className="row-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className={`card-body`}>
                  <div className="row-fluid" style={{ marginTop: "10px" }}>
                    {this.state.faqCollection.map(faqs => {
                      return (
                        <ExpansionPanel
                          expanded={this.state.expanded === faqs.ID}
                          onChange={this.handleChange(faqs.ID)}
                        >
                          <ExpansionPanelSummary
                            expandIcon={
                              <ExpandMoreIcon style={{ color: "#275458" }} />
                            }
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                          >
                            <Typography
                              style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                color: "#275458"
                              }}
                            >
                              {faqs.Title}
                            </Typography>
                          </ExpansionPanelSummary>
                          <ExpansionPanelDetails>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: faqs.answer
                              }}
                            ></div>
                            {/* <Typography>{faqs.answer}</Typography> */}
                          </ExpansionPanelDetails>
                        </ExpansionPanel>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12">&nbsp;</div>
          </div>
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
                    <h6>Still Have Questions or Concerns?</h6>
                  </div>
                  <div className="row-fluid">
                    <div className="col-md-12" style={{ marginTop: "10px" }}>
                      <div
                        className="alert alert-info"
                        style={{
                          margin: "0px",
                          padding: "10px 5px 0px 5px"
                        }}
                      >
                        <p>
                          Send us a note and we will get back to you through
                          your Profile email address as soon as possible.
                        </p>
                      </div>
                      <div
                        className="alert"
                        style={{ margin: "0px", padding: "0" }}
                      >
                        <div className="row-fluid">
                          <div className="col-md-12">
                            <FormControl fullWidth>
                              <CustomTextField
                                label="Subject*"
                                onChange={e => {
                                  if (e.target.value !== null) {
                                    this.setState({
                                      subject: e.target.value,
                                      subject_Error: false
                                    });
                                  } else {
                                    this.setState({
                                      subject: e.target.value,
                                      subject_Error: true
                                    });
                                  }
                                }}
                                name="subject"
                                value={this.state.subject}
                                helperText={
                                  this.state.subject_Error === true
                                    ? "Subject Cannot be Empty"
                                    : null
                                }
                                error={this.state.subject_Error}
                              />
                            </FormControl>
                            <FormControl
                              fullWidth
                              style={{ marginTop: "10px" }}
                            >
                              <FormLabel
                                style={{
                                  color:
                                    this.state.message_Error !== true
                                      ? "#275458"
                                      : "red"
                                }}
                              >
                                Message*
                              </FormLabel>
                              <TextareaAutosize
                                rows={6}
                                rowsMax={6}
                                onChange={e => {
                                  if (e.target.value !== null) {
                                    this.setState({
                                      message: e.target.value,
                                      message_Error: false
                                    });
                                  } else {
                                    this.setState({
                                      message: e.target.value,
                                      message_Error: true
                                    });
                                  }
                                }}
                                name="message"
                                value={this.state.message}
                                className={
                                  this.state.message_Error
                                    ? styles.errorTextarea
                                    : null
                                }
                              />
                              {this.state.message_Error !== false ? (
                                <FormHelperText style={{ color: "#f44336" }}>
                                  Message Cannot be Empty
                                </FormHelperText>
                              ) : (
                                false
                              )}
                            </FormControl>
                          </div>
                          <div className="col-md-12">&nbsp;</div>
                          <div className="col-md-12">
                            <p style={{ color: "red", float: "left" }}>
                              * Required Fields
                            </p>
                            <CustomButton
                              type="button"
                              className="float-right"
                              disabled={this.state.submitted}
                              onClick={this.handleSubmit.bind(this)}
                            >
                              <SaveIcon fontSize="default" /> {""}Submit
                            </CustomButton>
                            <Snackbar
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right"
                              }}
                              autoHideDuration={4000}
                              open={this.state.open}
                              ContentProps={{
                                "aria-describedby": "message-id"
                              }}
                            >
                              <SnackbarContent
                                className={styles.snackbarSucess}
                                message={
                                  <div id="message-id">
                                    <CheckCircleIcon
                                      style={{
                                        marginRight: "5px!important"
                                      }}
                                    />
                                    Your New Question was sent to Sharehlder
                                    Services Office Successfully
                                    <CancelIcon
                                      style={{
                                        marginLeft: "50px!important",
                                        cursor: "pointer"
                                      }}
                                      onClick={e => {
                                        this.setState({
                                          open: false
                                        });
                                      }}
                                    />
                                  </div>
                                }
                              ></SnackbarContent>
                            </Snackbar>
                            {this.state.catchException === true ? (
                              <React.Fragment>
                                {" "}
                                {this.callExceptionError()}{" "}
                              </React.Fragment>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


// protected sendEmail = async () => {
//   console.log("stated Sed Mail");
//   let newWeb = new Web(this.state.tenentURL);

//   //let addressString: string = await sp.utility.getCurrentUserEmailAddresses();
//   newWeb.currentUser.get().then((r: CurrentUser) => {
//     console.log(r);
//     let e = r["Title"].toString();
//     // const emailProps: EmailProperties = {
//     //   To: [SSOEmail],
//     //   Subject: "New FAQ was submitted by " + e,
//     //   Body:
//     //     e +
//     //     " Submitted a Frequently Asked Questions. <br/>" +
//     //     "<b> Subject: </b>" +
//     //     this.state.subject +
//     //     " <br/> <b> Message: </b>" +
//     //     this.state.message
//     // };
//     const reqOptions: ISPHttpClientOptions = {
//       headers: {
//         "Accept": "application/json;odata=verbose",
//         "Content-Type": "application/json;odata=verbose",
//         "odata-version":"3.0",
//       },
//       body: JSON.stringify({
//         properties: {
//           __metadata: { type: "SP.Utilities.EmailProperties" },
//           To: { results: [SSOEmail] },
//           Body:
//             e +
//             " Submitted a Frequently Asked Questions. <br/>" +
//             "<b> Subject: </b>" +
//             this.state.subject +
//             " <br/> <b> Message: </b>" +
//             this.state.message,
//           Subject: "New FAQ was submitted by " + e,
//         },
//       }),
//     };
//     this.props.properties.pageContext
//       .post(
//         this.state.tenentURL + "/_api/SP.Utilities.Utility.SendEmail",
//         SPHttpClient.configurations.v1,
//         reqOptions
//       )
//       .then((response: SPHttpClientResponse) => {
//         console.log(`Status code: ${response.status}`);
//         console.log(`Status text: ${response.statusText}`);
//         response.json().then((responseJSON: JSON) => {
//           console.log(responseJSON);
//           this.setState(
//             {
//               open: !this.state.open,
//               subject: "",
//               message: "",
//             },
//             () => {}
//           );
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//       });

//       // pnp.sp.utility
//       //     .sendEmail(emailProps)
//       //     .then(_ => {
//       //       console.log("Email Sent!");
//       //     })
//       //     .catch(e => {
//       //       console.error(e);
//       //     });
//       //}
//     //);
//   });



// }
