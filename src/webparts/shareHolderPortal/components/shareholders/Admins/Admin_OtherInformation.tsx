import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  RadioGroup,
  Select,
  TextField
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputAdornment from "@material-ui/core/InputAdornment";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import EventIcon from "@material-ui/icons/Event";
import { SPComponentLoader } from "@microsoft/sp-loader";
import { Web } from "@pnp/sp";
import * as moment from "moment";
import * as React from "react";
import PickyDateTime from "react-picky-date-time";
import {
  CEOGroup,
  CustomButton,
  CustomRadio,
  CustomTextField,
  MDAGroup,
  ProxyGroup,
  outerTheme
} from "../../common/common";
import styles from "../shareholders.module.scss";
import { ThemeProvider } from "@material-ui/styles";
SPComponentLoader.loadCss(
  "https://wawadev.sharepoint.com/sites/RatnaDev/SiteAssets/ShareHolders/react-picky-date-time.css"
);

export class AdminOtherInformation extends React.Component<any, any> {
  public MDAGroupDD = MDAGroup;
  public ProxyGroupDD = ProxyGroup;
  public CEOGroupDD = CEOGroup;
  public constructor(props: any, state: any) {
    super(props);
    this.state = {
      properties: this.props.properties,
      shareholderID: this.props.properties.shareholderID,
      otherInfoCollection: [],
      dividendPaymentType: "NA",
      dividendPaymentType_Error: false,
      taxDistributionPaymentType: "NA",
      taxDistributionPaymentType_Error: false,
      dividendPaymentAccount: "",
      dividendPaymentAccount_Error: false,
      taxDistributionPaymentAccount: "",
      taxDistributionPaymentAccount_Error: false,
      taxDistributionID: "",
      submitted: false,
      otherInformationSnackbar_open: false,
      dateBecameVestedSCorpShareholder: moment(new Date()).format("MM/DD/YYYY"),
      dateBecameShareholder: moment(new Date()).format("MM/DD/YYYY"),
      dateBecameShareholder_Error: false,
      dateCeasedToBeAShareholder: null,
      callRightDate: null,
      shareholderAgreement: "NA",
      shareholderAgreement_Error: false,
      accreditedInvestor: "",
      accreditedInvestor_Error: false,
      callRightNo: "",
      calendarDialog: false,
      calendarInput: "",
      mdaGroup: "NA",
      mdaGroup_Error: false,
      proxyGroup: "NA",
      proxyGroup_Error: false,
      CEOGroup: "NA",
      CEOGroup_Error: false,
      shareholderAgreementTypes: [],
      ceoReportGroupTypes:[],
      mdaGroupTypes:[],
      proxyGroupTypes:[],
      shareholderAgreementLink:
        this.props.properties.tenentURL + "ShareholderAgreement/Allitemsg.aspx",
        mdaGroupLink:
        this.props.properties.tenentURL + "MDAGroup/Allitemsg.aspx",
        proxyGroupLink:
        this.props.properties.tenentURL + "ProxyGroup/Allitemsg.aspx",
        ceoReportGroupLink:
        this.props.properties.tenentURL + "CEOReportGroup/Allitemsg.aspx",
    };
  }

  public onDateSelected = (res, slectedInput) => {
    let d = res.month + "-" + res.date + "-" + res.year;
    d = moment(d).format("MM/DD/YYYY");
    this.setState(
      {
        calendarDialog: false
      },
      () => {
        switch (slectedInput) {
          case "dateBecameVestedSCorpShareholder":
            this.setState({
              dateBecameVestedSCorpShareholder: d
            });
            break;
          case "dateBecameShareholder":
            this.setState({
              dateBecameShareholder: d
            });
            break;
          case "dateCeasedToBeAShareholder":
            this.setState({
              dateCeasedToBeAShareholder: d
            });
            break;
          case "callRightDate":
            this.setState({
              callRightDate: d
            });
            break;
        }
      }
    );
  }

  public componentDidMount() {
    if (this.state.shareholderID !== undefined) {
      this.ShareholderAgreementTypes();
      this.CEOReportGroupTypes();
      this.MDAGroup();
      this.ProxyGroup();
    }
  }

  public ShareholderAgreementTypes = () => {
    let newWeb = new Web(this.state.properties.tenentURL);
    newWeb.lists
      .getByTitle("Shareholder Agreement")
      .items.select("Title", "ID", "fullName")
      .get()
      .then(d => {
        if (d.length > 0) {
          let obj = [
            {
              key: "NA",
              text: "-- Please Select Shareholder Agreement --"
            }
          ];
          for (let index = 0; index < d.length; index++) {
            obj.push({
              key: d[index].Title,
              text: d[index].fullName
            });
          }
          this.setState({
            shareholderAgreementTypes: obj
          });
        }
      });
  }

  public CEOReportGroupTypes = () => {
    let newWeb = new Web(this.state.properties.tenentURL);
    newWeb.lists
      .getByTitle("CEO Report Group")
      .items.select("Title", "ID", "fullName")
      .get()
      .then(d => {
        if (d.length > 0) {
          let obj = [
            {
              key: "NA",
              text: "-- Please CEO Report Group --"
            }
          ];
          for (let index = 0; index < d.length; index++) {
            obj.push({
              key: d[index].Title,
              text: d[index].fullName
            });
          }
          this.setState({
            ceoReportGroupTypes: obj
          });
        }
      });
  }

  public MDAGroup = () => {
    let newWeb = new Web(this.state.properties.tenentURL);
    newWeb.lists
      .getByTitle("MDA Group")
      .items.select("Title", "ID", "fullName")
      .get()
      .then(d => {
        if (d.length > 0) {
          let obj = [
            {
              key: "NA",
              text: "-- Please Select MDA Group --"
            }
          ];
          for (let index = 0; index < d.length; index++) {
            obj.push({
              key: d[index].Title,
              text: d[index].fullName
            });
          }
          this.setState({
            mdaGroupTypes: obj
          });
        }
      });
  }

  public ProxyGroup = () => {
    let newWeb = new Web(this.state.properties.tenentURL);
    newWeb.lists
      .getByTitle("Proxy Group")
      .items.select("Title", "ID", "fullName")
      .get()
      .then(d => {
        if (d.length > 0) {
          let obj = [
            {
              key: "NA",
              text: "-- Please Proxy Group --"
            }
          ];
          for (let index = 0; index < d.length; index++) {
            obj.push({
              key: d[index].Title,
              text: d[index].fullName
            });
          }
          this.setState({
            proxyGroupTypes: obj
          }, ()=>{
            this.getOtherInformation(this.state.shareholderID);
          });
        }
      });
  }

  public getOtherInformation = id => {
    if (id) {
      let newWeb = new Web(this.state.properties.tenentURL);
      const filter = "Title eq '" + id + "'";
      newWeb.lists
        .getByTitle("Shareholding Other Information")
        .items.select(
          "Title",
          "dividendPaymentType",
          "taxDistributionPaymentType",
          "dividendPaymentAccount",
          "taxDistributionPaymentAccount",
          "taxDistributionID",
          "dateBecameShareholder",
          "dateBecameVestedSCorpShareholder",
          "dateCeasedToBeaShareholder",
          "shareholderAgreement",
          "callRightNo",
          "callRightDate",
          "accreditedInvestor",
          "proxyGroup",
          "ceoReportGroup",
          "mdaAndGroup",
          "ID"
        )
        .orderBy("Title", true)
        .filter(filter)
        .get()
        .then(d => {
          if (d.length > 0) {
            this.setState(prevState => ({
              ...prevState,
              otherInfoCollection: d,
              dividendPaymentType: d[0].dividendPaymentType,
              taxDistributionPaymentType: d[0].taxDistributionPaymentType,
              dividendPaymentAccount: d[0].dividendPaymentAccount,
              taxDistributionPaymentAccount: d[0].taxDistributionPaymentAccount,
              taxDistributionID:d[0].taxDistributionID,
              dateBecameVestedSCorpShareholder:
                d[0].dateBecameVestedSCorpShareholder === null
                  ? moment(new Date()).format("MM/DD/YYYY")
                  : moment(d[0].dateBecameVestedSCorpShareholder).format(
                      "MM/DD/YYYY"
                    ),
              dateBecameShareholder:
                d[0].dateBecameShareholder === null
                  ? moment(new Date()).format("MM/DD/YYYY")
                  : moment(d[0].dateBecameShareholder).format("MM/DD/YYYY"),
              dateCeasedToBeAShareholder:
                d[0].dateCeasedToBeaShareholder === null
                  ? null
                  : moment(d[0].dateCeasedToBeaShareholder).format(
                      "MM/DD/YYYY"
                    ),
              shareholderAgreement:
                d[0].shareholderAgreement === null
                  ? "NA"
                  : d[0].shareholderAgreement,
              callRightNo: d[0].callRightNo,
              callRightDate:
                d[0].callRightDate === null
                  ? null
                  : moment(d[0].callRightDate).format("MM/DD/YYYY"),
              accreditedInvestor: d[0].accreditedInvestor,
              proxyGroup: d[0].proxyGroup === null ? "NA" : d[0].proxyGroup,
              CEOGroup:
                d[0].ceoReportGroup === null ? "NA" : d[0].ceoReportGroup,
              mdaGroup: d[0].mdaAndGroup === null ? "NA" : d[0].mdaAndGroup
            }));
          } else {
            this.setState(prevState => ({
              ...prevState,
              otherInfoCollection: []
            }));
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  }

  public validateOtherInfromation = e => {
    let error = {
      dividendPaymentType_Error: this.state.dividendPaymentType_Error,
      taxDistributionPaymentType_Error: this.state
        .taxDistributionPaymentType_Error,
      dateBecameShareholder_Error: this.state.dateBecameShareholder_Error,
      shareholderAgreement_Error: this.state.shareholderAgreement_Error,
      accreditedInvestor_Error: this.state.accreditedInvestor_Error,
      mdaGroup_Error: this.state.mdaGroup_Error,
      proxyGroup_Error: this.state.proxyGroup_Error,
      CEOGroup_Error: this.state.CEOGroup_Error
    };
    if (this.state.dividendPaymentType === "NA") {
      this.setState({ dividendPaymentType_Error: true });
      error.dividendPaymentType_Error = true;
    } else {
      error.dividendPaymentType_Error = false;
    }
    if (this.state.taxDistributionPaymentType === "NA") {
      this.setState({ taxDistributionPaymentType_Error: true });
      error.taxDistributionPaymentType_Error = true;
    } else {
      error.taxDistributionPaymentType_Error = false;
    }
    if (this.state.dateBecameShareholder === "") {
      this.setState({ dateBecameShareholder_Error: true });
      error.dateBecameShareholder_Error = true;
    } else {
      error.dateBecameShareholder_Error = false;
    }
    if (this.state.shareholderAgreement === "NA") {
      this.setState({ shareholderAgreement_Error: true });
      error.shareholderAgreement_Error = true;
    } else {
      error.shareholderAgreement_Error = false;
    }
    if (this.state.accreditedInvestor === "") {
      this.setState({ accreditedInvestor_Error: true });
      error.accreditedInvestor_Error = true;
    } else {
      error.accreditedInvestor_Error = false;
    }
    if (this.state.mdaGroup === "NA") {
      this.setState({ mdaGroup_Error: true });
      error.mdaGroup_Error = true;
    } else {
      error.mdaGroup_Error = false;
    }
    if (this.state.proxyGroup === "NA") {
      this.setState({ proxyGroup_Error: true });
      error.proxyGroup_Error = true;
    } else {
      error.proxyGroup_Error = false;
    }
    if (this.state.CEOGroup === "NA") {
      this.setState({ CEOGroup_Error: true });
      error.CEOGroup_Error = true;
    } else {
      error.CEOGroup_Error = false;
    }
    const identifiers = Object.keys(error);
    const activeError = identifiers.filter((id) => {
      return error[id];
    });
    if (activeError.length === 0) {
      const isUpdate = this.state.otherInfoCollection.length;
      if (isUpdate > 0) {
        this.updateOtherInformation();
      } else {
        this.postOtherInformation();
      }
    }
  }

  public updateOtherInformation = () => {
    if (this.state.shareholderID) {
      let newWeb = new Web(this.state.properties.tenentURL);
      this.setState({ submitted: true }, () => {
        newWeb.lists
          .getByTitle("Shareholding Other Information")
          .items.getById(this.state.otherInfoCollection[0].ID)
          .update({
            Title: this.state.shareholderID,
            dividendPaymentType: this.state.dividendPaymentType,
            taxDistributionPaymentType: this.state.taxDistributionPaymentType,
            dividendPaymentAccount: this.state.dividendPaymentAccount,
            taxDistributionPaymentAccount: this.state
              .taxDistributionPaymentAccount,
            taxDistributionID:this.state.taxDistributionID,
            dateBecameShareholder: this.state.dateBecameShareholder,
            dateBecameVestedSCorpShareholder: this.state
              .dateBecameVestedSCorpShareholder,
            dateCeasedToBeaShareholder: this.state.dateCeasedToBeAShareholder,
            shareholderAgreement: this.state.shareholderAgreement,
            callRightNo: this.state.callRightNo,
            callRightDate: this.state.callRightDate,
            accreditedInvestor: this.state.accreditedInvestor,
            proxyGroup: this.state.proxyGroup,
            ceoReportGroup: this.state.CEOGroup,
            mdaAndGroup: this.state.mdaGroup
          })
          .then(d => {
            console.log(d);
            this.setState({ otherInformationSnackbar_open: true });
          })
          .catch(e => {
            console.log(e.toString());
          });
      });
      setTimeout(
        () =>
          this.setState({
            otherInformationSnackbar_open: false,
            submitted: false
          }),
        5000
      );
    }
  }

  public postOtherInformation = () => {
    if (this.state.shareholderID) {
      let newWeb = new Web(this.state.properties.tenentURL);
      this.setState({ submitted: true }, () => {
        newWeb.lists
          .getByTitle("Shareholding Other Information")
          .items.add({
            Title: this.state.shareholderID,
            dividendPaymentType: this.state.dividendPaymentType,
            taxDistributionPaymentType: this.state.taxDistributionPaymentType,
            dividendPaymentAccount: this.state.dividendPaymentAccount,
            taxDistributionPaymentAccount: this.state
              .taxDistributionPaymentAccount,
            taxDistributionID:this.state.taxDistributionID,
            dateBecameShareholder: this.state.dateBecameShareholder,
            dateBecameVestedSCorpShareholder: this.state
              .dateBecameVestedSCorpShareholder,
            dateCeasedToBeaShareholder: this.state.dateCeasedToBeAShareholder,
            shareholderAgreement: this.state.shareholderAgreement,
            callRightNo: this.state.callRightNo,
            callRightDate: this.state.callRightDate,
            accreditedInvestor: this.state.accreditedInvestor,
            proxyGroup: this.state.proxyGroup,
            ceoReportGroup: this.state.CEOGroup,
            mdaAndGroup: this.state.mdaGroup
          })
          .then(d => {
            console.log(d);
            this.setState({ otherInformationSnackbar_open: true });
          })
          .catch(e => {
            console.log(e.toString());
          });
      });
      setTimeout(
        () =>
          this.setState({
            otherInformationSnackbar_open: false,
            submitted: false
          }),
        5000
      );
    }
  }

  public shareholderAgreementInformation_HTML = () => {
    let _html = (
      <React.Fragment>
        <div className="card">
          <div className={`card-body`}>
            <div className={`${styles.cardHead_General} card-header`}>
              <h6>Shareholder Agreement Information</h6>
            </div>
            <div className="row-fluid">
              <div className="row">
                <div className="col-md-12">
                  <FormControl fullWidth style={{ margin: "10px" }}>
                    <CustomTextField
                      label="Date Became Vested SCorp Shareholder"
                      name="dateBecameVestedSCorpShareholder"
                      value={this.state.dateBecameVestedSCorpShareholder}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EventIcon
                              className={styles.eventIconStyles}
                              onClick={e => {
                                this.setState({
                                  calendarDialog: true,
                                  calendarInput:
                                    "dateBecameVestedSCorpShareholder"
                                });
                              }}
                            />
                          </InputAdornment>
                        )
                      }}
                    />
                  </FormControl>
                  <FormControl fullWidth style={{ margin: "10px" }}>
                    <CustomTextField
                      label="Date Became Shareholder"
                      name="dateBecameShareholder"
                      value={this.state.dateBecameShareholder}
                      helperText={
                        this.state.dateBecameShareholder_Error === true
                          ? "Date Became Vested SCorp Shareholder Cannot be Empty"
                          : null
                      }
                      error={this.state.dateBecameShareholder_Error}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EventIcon
                              className={styles.eventIconStyles}
                              onClick={e => {
                                this.setState({
                                  calendarDialog: true,
                                  calendarInput: "dateBecameShareholder"
                                });
                              }}
                            />
                          </InputAdornment>
                        )
                      }}
                    />
                  </FormControl>
                  <FormControl fullWidth style={{ margin: "10px" }}>
                    <CustomTextField
                      label="Date Ceased To Be A Shareholder"
                      name="dateCeasedToBeAShareholder"
                      value={this.state.dateCeasedToBeAShareholder}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EventIcon
                              className={styles.eventIconStyles}
                              onClick={e => {
                                this.setState({
                                  calendarDialog: true,
                                  calendarInput: "dateCeasedToBeAShareholder"
                                });
                              }}
                            />
                          </InputAdornment>
                        )
                      }}
                    />
                  </FormControl>
                  <div
                    className="row"
                    style={{
                      marginLeft: "-5px",
                      paddingTop: "3px"
                    }}
                  >
                    <div className="col-sm-11">
                      <FormControl
                        error={this.state.shareholderAgreement_Error}
                        fullWidth
                      >
                        <InputLabel
                          style={{
                            color: this.state.shareholderAgreement_Error !== true ? "#275458" : "red"
                          }}
                        >
                          Shareholder Agreement
                        </InputLabel>
                        <Select
                          name="shareholderAgreement"
                          value={this.state.shareholderAgreement}
                          onChange={e => {
                            if (e.target.value === "NA") {
                              this.setState({
                                shareholderAgreement: e.target.value,
                                shareholderAgreement_Error: true
                              });
                            } else {
                              this.setState({
                                shareholderAgreement: e.target.value,
                                shareholderAgreement_Error: false
                              });
                            }
                          }}
                          error={this.state.shareholderAgreement_Error}
                          fullWidth
                        >
                          {this.state.shareholderAgreementTypes.map(
                            (item, i) => {
                              return (
                                <MenuItem key={i} value={item.key}>
                                  {item.text}
                                </MenuItem>
                              );
                            }
                          )}
                        </Select>
                        {this.state.shareholderAgreement_Error !== false ? (
                          <FormHelperText>
                            Please Select Shareholder Agreement
                          </FormHelperText>
                        ) : (
                          false
                        )}
                      </FormControl>
                    </div>
                    <div className="col-sm-1 align-self-end" style={{marginBottom:"10px"}}>
                      <a
                        href={this.state.shareholderAgreementLink}
                        target="_blank"
                      >
                        <FontAwesomeIcon
                          style={{
                            marginLeft: "3px",
                            color: "#275458",
                            fontSize: "14px"
                          }}
                          icon={faExternalLinkAlt}
                        />
                      </a>
                    </div>
                  </div>
                  <FormControl fullWidth style={{ margin: "10px" }}>
                    <CustomTextField
                      label="Call Right No"
                      onChange={e => {
                        const re = /^[0-9\b]+$/;
                        if (e.target.value === "" || re.test(e.target.value)) {
                          if (e.target.value.length <= 3) {
                            this.setState({
                              callRightNo: e.target.value
                            });
                          }
                        }
                      }}
                      name="callRightNo"
                      value={this.state.callRightNo}
                    />
                  </FormControl>
                  <FormControl fullWidth style={{ margin: "10px" }}>
                    <CustomTextField
                      label="Call Right Date"
                      name="callRightDate"
                      value={this.state.callRightDate}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EventIcon
                              className={styles.eventIconStyles}
                              onClick={e => {
                                this.setState({
                                  calendarDialog: true,
                                  calendarInput: "callRightDate"
                                });
                              }}
                            />
                          </InputAdornment>
                        )
                      }}
                    />
                  </FormControl>
                  <FormControl
                    error={this.state.accreditedInvestor_Error}
                    fullWidth
                    style={{ margin: "10px" }}
                  >
                    <FormLabel
                      style={{
                        color:
                          this.state.accreditedInvestor_Error !== true ? "#275458" : "red",
                        cursor: "pointer!important"
                      }}
                      component="legend"
                    >
                      Accredited Investor
                      <RadioGroup
                        row
                        aria-label="accreditedInvestor"
                        name="accreditedInvestor"
                        value={this.state.accreditedInvestor}
                        onChange={e => {
                          if (e.target.value === "") {
                            this.setState({
                              accreditedInvestor: e.target.value,
                              accreditedInvestor_Error: true
                            });
                          } else {
                            this.setState({
                              accreditedInvestor: e.target.value,
                              accreditedInvestor_Error: false
                            });
                          }
                        }}
                      >
                        <FormControlLabel
                          labelPlacement="end"
                          value="Yes"
                          control={<CustomRadio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          labelPlacement="end"
                          value="No"
                          control={<CustomRadio />}
                          label="No"
                        />
                      </RadioGroup>
                      {this.state.accreditedInvestor_Error !== false ? (
                        <FormHelperText>
                          Accredited Investor Cannot be blank
                        </FormHelperText>
                      ) : (
                        false
                      )}
                    </FormLabel>
                  </FormControl>
                  <FormControl fullWidth style={{ margin: "10px" }}>
                    <Dialog
                      open={this.state.calendarDialog}
                      onClose={e => {
                        this.setState({
                          calendarDialog: false
                        });
                      }}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="calendar">
                        {this.state.calendarInput ===
                        "dateBecameVestedSCorpShareholder" ? (
                          <React.Fragment>
                            Date Became Vested SCorp Shareholder
                          </React.Fragment>
                        ) : null}
                        {this.state.calendarInput ===
                        "dateBecameShareholder" ? (
                          <React.Fragment>
                            Date Became Shareholder
                          </React.Fragment>
                        ) : null}
                        {this.state.calendarInput ===
                        "dateCeasedToBeAShareholder" ? (
                          <React.Fragment>
                            Date Ceased To Be A Shareholder
                          </React.Fragment>
                        ) : null}
                        {this.state.calendarInput === "callRightDate" ? (
                          <React.Fragment>Call Right Date</React.Fragment>
                        ) : null}
                      </DialogTitle>
                      <DialogContent>
                        <PickyDateTime
                          style={{
                            margin: "auto",
                            display: "block",
                            textAlign: "center"
                          }}
                          size="l"
                          mode={0}
                          locale="en-us"
                          show={true}
                          onDatePicked={res =>
                            this.onDateSelected(res, this.state.calendarInput)
                          }
                        />
                      </DialogContent>
                    </Dialog>
                  </FormControl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
    return _html;
  }

  public reportClassifications_HTML = () => {
    let _html = (
      <React.Fragment>
        <div className="card">
          <div className={`card-body`}>
            <div className={`${styles.cardHead_General} card-header`}>
              <h6>Report Classifications</h6>
            </div>
            <div className="row-fluid">
              <div className="row">
                <div className="col-sm-11">
                  <FormControl
                    error={this.state.mdaGroup_Error}
                    fullWidth
                    style={{ margin: "10px" }}
                  >
                    <InputLabel
                      style={{
                        color:
                          this.state.mdaGroup_Error !== true
                            ? "#275458"
                            : "red"
                      }}
                      error={this.state.mdaGroup_Error}
                    >
                      MD&A Group
                    </InputLabel>
                    <Select
                      name="mdaGroup"
                      value={this.state.mdaGroup}
                      onChange={e => {
                        if (e.target.value === "NA") {
                          this.setState({
                            mdaGroup: e.target.value,
                            mdaGroup_Error: true
                          });
                        } else {
                          this.setState({
                            mdaGroup: e.target.value,
                            mdaGroup_Error: false
                          });
                        }
                      }}
                      error={this.state.mdaGroup_Error}
                      fullWidth
                    >
                      {this.state.mdaGroupTypes.map((item, i) => {
                        return (
                          <MenuItem key={i} value={item.key}>
                            {item.text}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    {this.state.mdaGroup_Error !== false ? (
                      <FormHelperText>Please Select MD&A Group</FormHelperText>
                    ) : (
                      false
                    )}
                  </FormControl>
                </div>
                <div className="col-sm-1 align-self-end" style={{marginBottom:"10px"}}>
                  <a href={this.state.mdaGroupLink} target="_blank">
                    <FontAwesomeIcon
                      style={{
                        marginLeft: "3px",
                        color: "#275458",
                        fontSize: "14px"
                      }}
                      icon={faExternalLinkAlt}
                    />
                  </a>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-11">
                  <FormControl
                    error={this.state.proxyGroup_Error}
                    fullWidth
                    style={{ margin: "10px" }}
                  >
                    <InputLabel
                      style={{
                        color:
                          this.state.proxyGroup_Error !== true
                            ? "#275458"
                            : "red"
                      }}
                    >
                      Proxy Group
                    </InputLabel>
                    <Select
                      name="proxyGroup"
                      value={this.state.proxyGroup}
                      onChange={e => {
                        if (e.target.value === "NA") {
                          this.setState({
                            proxyGroup: e.target.value,
                            proxyGroup_Error: true
                          });
                        } else {
                          this.setState({
                            proxyGroup: e.target.value,
                            proxyGroup_Error: false
                          });
                        }
                      }}
                      error={this.state.proxyGroup_Error}
                      fullWidth
                    >
                      {this.state.proxyGroupTypes.map((item, i) => {
                        return (
                          <MenuItem key={i} value={item.key}>
                            {item.text}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    {this.state.proxyGroup_Error !== false ? (
                      <FormHelperText>Please Select Proxy Group</FormHelperText>
                    ) : (
                      false
                    )}
                  </FormControl>
                </div>
                <div className="col-sm-1 align-self-end" style={{marginBottom:"10px"}}>
                  <a href={this.state.proxyGroupLink} target="_blank">
                    <FontAwesomeIcon
                      style={{
                        marginLeft: "3px",
                        color: "#275458",
                        fontSize: "14px"
                      }}
                      icon={faExternalLinkAlt}
                    />
                  </a>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-11">
                  <FormControl
                    error={this.state.CEOGroup_Error}
                    fullWidth
                    style={{ margin: "10px" }}
                  >
                    <InputLabel
                      style={{
                        color:
                          this.state.CEOGroup_Error !== true ? "#275458" : "red"
                      }}
                    >
                      CEO Report Group
                    </InputLabel>
                    <Select
                      name="CEOGroup"
                      value={this.state.CEOGroup}
                      onChange={e => {
                        if (e.target.value === "NA") {
                          this.setState({
                            CEOGroup: e.target.value,
                            CEOGroup_Error: true
                          });
                        } else {
                          this.setState({
                            CEOGroup: e.target.value,
                            CEOGroup_Error: false
                          });
                        }
                      }}
                      error={this.state.CEOGroup_Error}
                      fullWidth
                    >
                      {this.state.ceoReportGroupTypes.map((item, i) => {
                        return (
                          <MenuItem key={i} value={item.key}>
                            {item.text}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    {this.state.proxyGroup_Error !== false ? (
                      <FormHelperText>
                        Please Select CEO Report Group
                      </FormHelperText>
                    ) : (
                      false
                    )}
                  </FormControl>
                </div>
                <div className="col-sm-1 align-self-end" style={{marginBottom:"10px"}}>
                  <a href={this.state.ceoReportGroupLink} target="_blank">
                    <FontAwesomeIcon
                      style={{
                        marginLeft: "3px",
                        color: "#275458",
                        fontSize: "14px"
                      }}
                      icon={faExternalLinkAlt}
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
    return _html;
  }

  public otherInformation_HTML = () => {
    let _html = (
      <React.Fragment>
        <div className="card">
          <div className={`card-body`}>
            <div className={`${styles.cardHead_General} card-header`}>
              <h6>Other Information</h6>
            </div>
            <div className="row-fluid">
              <div className="row">
                <div className="col-md-6">
                  <FormControl
                    error={this.state.dividendPaymentType_Error}
                    fullWidth
                    style={{ margin: "10px" }}
                  >
                    <InputLabel>Dividend Payment Type</InputLabel>
                    <Select
                      id="dividendPaymentType"
                      value={this.state.dividendPaymentType}
                      disabled={false}
                      error={this.state.dividendPaymentType_Error}
                      fullWidth
                      onChange={e => {
                        if (e.target.value === "NA") {
                          this.setState({
                            dividendPaymentType: e.target.value,
                            dividendPaymentType_Error: true
                          });
                        } else {
                          this.setState({
                            dividendPaymentType: e.target.value,
                            dividendPaymentType_Error: false
                          });
                        }
                      }}
                    >
                      <MenuItem value="NA">
                        -- Please Select Dividend Payment Type --
                      </MenuItem>
                      <MenuItem value="Payroll Process Direct Deposit">
                        Payroll Process Direct Deposit
                      </MenuItem>
                      <MenuItem value="ACH Direct Deposit">
                        ACH Direct Deposit
                      </MenuItem>
                      <MenuItem value="Wire Direct Deposit">
                        Wire Direct Deposit
                      </MenuItem>
                      <MenuItem value="Check">Check</MenuItem>
                    </Select>
                    {this.state.dividendPaymentType_Error !== false ? (
                      <FormHelperText>
                        Please Select Dividend Payment Type
                      </FormHelperText>
                    ) : (
                      false
                    )}
                  </FormControl>
                  <FormControl fullWidth style={{ margin: "10px" }}>
                    <CustomTextField
                      label="Dividend Payment Account"
                      onChange={e => {
                        if (e.target.value === "") {
                          this.setState({
                            dividendPaymentAccount: e.target.value,
                            dividendPaymentAccount_Error: false
                          });
                        } else {
                          const re = /^[0-9\b]+$/;
                          if (
                            e.target.value === "" ||
                            re.test(e.target.value)
                          ) {
                            if (e.target.value.length < 5) {
                              this.setState({
                                dividendPaymentAccount: e.target.value,
                                dividendPaymentAccount_Error: false
                              });
                            }
                          }
                        }
                      }}
                      helperText={
                        this.state.dividendPaymentAccount_Error === true
                          ? "Dividend Payment Account Cannot be Empty"
                          : null
                      }
                      error={this.state.dividendPaymentAccount_Error}
                      name="dividendPaymentAccount"
                      value={this.state.dividendPaymentAccount}
                    />
                  </FormControl>
                </div>
                <div className="col-md-6">
                  <FormControl
                    error={this.state.taxDistributionPaymentType_Error}
                    fullWidth
                    style={{ margin: "10px" }}
                  >
                    <InputLabel>Tax Distribution Payment Type</InputLabel>
                    <Select
                      error={this.state.taxDistributionPaymentType_Error}
                      fullWidth
                      labelId="Tax Distribution Payment Type"
                      id="taxDistributionPaymentType"
                      value={this.state.taxDistributionPaymentType}
                      disabled={false}
                      onChange={e => {
                        if (e.target.value === "NA") {
                          this.setState({
                            taxDistributionPaymentType: e.target.value,
                            taxDistributionPaymentType_Error: true
                          });
                        } else {
                          this.setState({
                            taxDistributionPaymentType: e.target.value,
                            taxDistributionPaymentType_Error: false
                          });
                        }
                      }}
                    >
                      <MenuItem value="NA">
                        -- Please Select Tax Distribution Payment Type --
                      </MenuItem>
                      <MenuItem value="ACH Direct Deposit">
                        ACH Direct Deposit
                      </MenuItem>
                      <MenuItem value="Wire Direct Deposit">
                        Wire Direct Deposit
                      </MenuItem>
                      <MenuItem value="Check">Check</MenuItem>
                    </Select>
                    {this.state.taxDistributionPaymentType_Error !== false ? (
                      <FormHelperText>
                        Please Select Tax Distribution Payment Type
                      </FormHelperText>
                    ) : (
                      false
                    )}
                  </FormControl>
                  <FormControl fullWidth style={{ margin: "10px" }}>
                    <CustomTextField
                      disabled={false}
                      label="Tax Distribution Payment Account"
                      name="taxDistributionPaymentAccount"
                      onChange={e => {
                        if (e.target.value === "") {
                          this.setState({
                            taxDistributionPaymentAccount: e.target.value,
                            taxDistributionPaymentAccount_Error: false
                          });
                        } else {
                          const re = /^[0-9\b]+$/;
                          if (
                            e.target.value === "" ||
                            re.test(e.target.value)
                          ) {
                            if (e.target.value.length < 5) {
                              this.setState({
                                taxDistributionPaymentAccount: e.target.value,
                                taxDistributionPaymentAccount_Error: false
                              });
                            }
                          }
                        }
                      }}
                      helperText={
                        this.state.taxDistributionPaymentAccount_Error === true
                          ? "Tax Distribution Payment Account Cannot be Empty"
                          : null
                      }
                      error={this.state.taxDistributionPaymentAccount_Error}
                      value={this.state.taxDistributionPaymentAccount}
                    />
                  </FormControl>
                  <FormControl fullWidth style={{ margin: "10px" }}>
                    <CustomTextField
                      disabled={false}
                      label="Tax Distribution ID"
                      name="taxDistributionID"
                      onChange={e => {
                        if (e.target.value === "") {
                          this.setState({
                            taxDistributionID: e.target.value,
                            taxDistributionID_Error: false
                          });
                        } else {
                          const re = /^[0-9\b]+$/;
                          if (
                            e.target.value === "" ||
                            re.test(e.target.value)
                          ) {
                            this.setState({
                              taxDistributionID: e.target.value,
                              taxDistributionID_Error: false
                            });
                          }
                        }
                      }}
                      helperText={
                        this.state.taxDistributionID_Error === true
                          ? "Tax Distribution Payment Account Cannot be Empty"
                          : null
                      }
                      error={this.state.taxDistributionID_Error}
                      value={this.state.taxDistributionID}
                    />
                  </FormControl>
                </div>
              </div>
              <div className="row">
                <div
                  className={`${styles.alignAlert} alert alert-info`}
                  role="alert"
                >
                  <p className={`${styles.electionsGeneralText} text-justify`}>
                    Due to the sensitive nature of the above information, please
                    contact the Shareholder Services Office to make any changes
                    or download, complete and sign the Direct Deposit Form in
                    the Documents library and mail it to the address listed on
                    the form.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
    return _html;
  }

  public render(): React.ReactElement<any> {
    const otherInformation = this.otherInformation_HTML();
    const reportClassifications = this.reportClassifications_HTML();
    const shareholderAgreementInformation = this.shareholderAgreementInformation_HTML();
    return (
      <div className={styles.shareholders}>
        <div className={styles.otherInformation}>
          <div className="row-fluid" style={{ overflow: "hidden" }}>
            <div className="row" style={{ marginTop: "10px" }}>
              <div className="col-md-12">{otherInformation}</div>
            </div>
            <div className="row" style={{ clear: "both" }}>
              &nbsp;
            </div>
            <div
              className="row"
              style={{ paddingTop: "10px", marginTop: "10px" }}
            >
              <div className="col-sm-6 col-xs-12">
                {shareholderAgreementInformation}
              </div>
              <div className="col-sm-6 col-xs-12">
                {reportClassifications}
                <div className="row">
                  <div className="col-sm-6">&nbsp;</div>
                  <div className="col-sm-6">
                    <CustomButton
                      style={{ marginTop: "10px" }}
                      type="button"
                      className="float-right"
                      onClick={this.validateOtherInfromation}
                    >
                      <CheckCircleIcon style={{ marginRight: "5px" }} />{" "}
                      {(!this.state.submitted && " Update") ||
                        (this.state.submitted && " Infromation Updated !")}
                    </CustomButton>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">&nbsp;</div>
                  <div className="col-sm-6">
                    {this.state.otherInformationSnackbar_open ? (
                      <div
                        style={{
                          float: "right",
                          marginTop: "10px"
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "#43a047",
                            padding: "3px 16px",
                            borderRadius: "5px",
                            color: "white"
                          }}
                        >
                          <CheckCircleIcon />
                          <span> Updated Successfully</span>
                          <IconButton
                            key="close"
                            aria-label="close"
                            color="inherit"
                            onClick={e => {
                              this.setState({
                                otherInformationSnackbar_open: false
                              });
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </div>
                      </div>
                    ) : null}
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
