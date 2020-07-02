import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Paper,
  RadioGroup,
  Select,
  Typography,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import pnp from "@pnp/pnpjs";
import { EmailProperties, sp, Web } from "@pnp/sp";
import { CurrentUser } from "@pnp/sp/src/siteusers";
import * as _ from "lodash";
import * as React from "react";
import { CustomRadio, SSOEmail, state_DD } from "../../common/common";
import styles from "../shareholders.module.scss";
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from "@microsoft/sp-http";


export class AdminElections extends React.Component<any, any> {
  public electionRef = React.createRef<HTMLFormElement>();
  public statesDD = state_DD;
  public constructor(props: any, state: any) {
    super(props);
    this.getAccountInfromation = this.getAccountInfromation.bind(this);
    this.state = {
      properties: this.props.properties,
      electionInformation: [],
      state_DD: state_DD,
      compositeElectionsInformation: [],
      getIDforUpdate: [],
      state_slected: "NA",
      state_slected_Error: false,
      years_DD: [],
      OwnershipType: "",
      ele_taxYear: "-- Please Select Tax Year --",
      ele_taxYear_Error: false,
      de_Val: "none",
      de_Val_Error: false,
      md_Val: "none",
      md_Val_Error: false,
      pa_Val: "none",
      pa_Val_Error: false,
      va_Val: "none",
      va_Val_Error: false,
      nj_Val: "none",
      nj_Val_Error: false,
      de_disabled: false,
      md_disabled: false,
      nj_disabled: false,
      pa_disabled: false,
      va_disabled: false,
      submitted: false,
      hasError: false,
      electionSnackbar_open: false,
      makeAvilable_Year: null,
      taxYearsTypesLink:
        this.props.properties.tenentURL + "/TaxYear/Allitemsg.aspx",
      CompositeElectionsInformationLink:
        this.props.properties.tenentURL +
        "/CompositeElectionsInformation/Allitemsg.aspx",
      catchException: false,

      pageContext:this.props.properties.pageContext
    };
  }

  protected sendEmail = async (data) => {
    //let addressString: string = await sp.utility.getCurrentUserEmailAddresses();
    let tbl =
      '<br/><table style="font-family: arial, sans-serif; border-collapse: collapse; width: 500px;"><tr style="background-color: #dddddd;"><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">State</td><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">' +
      data.state_slected +
      "</td></tr>" +
      '<tr><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Tax Year</td><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">' +
      data.ele_taxYear +
      "</td></tr>" +
      '<tr style="background-color: #dddddd;"><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">DE</td><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">' +
      data.de_Val +
      "</td></tr>" +
      '<tr><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">FL</td><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">' +
      "NA" +
      "</td></tr>" +
      '<tr style="background-color: #dddddd;"><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">MD</td><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">' +
      data.md_Val +
      "</td></tr>" +
      '<tr><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">NJ</td><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">' +
      data.nj_Val +
      "</td></tr>" +
      '<tr style="background-color: #dddddd;"><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">PA</td><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">' +
      data.pa_Val +
      "</td></tr>" +
      '<tr><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">VA</td><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">' +
      data.va_Val +
      "</td></tr></table>";
      let newWeb = new Web(this.state.properties.tenentURL);
      newWeb.currentUser.get().then((r: CurrentUser) => {

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
              Body: "Shareholder <b>" +
              data.properties.shareholderID +
              " – " +
              data.properties.shareholdingName.toString() +
              "<b/>" +
              " has updated their Composite Election information to the following:<br/>" +
              "<b>Updated By:<b/>" +
              e +
              "<br/>" +
              tbl,
              Subject: "Alert: Composite Election Update: Shareholder ID " +
              data.properties.shareholderID +
              " – " +
              data.properties.shareholdingName.toString() +
              ": has updated their " +
              data.properties.shareholdingName.toString() +
              " Composite Election and/or Resident State",
            },
          }),
        };
        this.props.properties.pageContext
          .post(
            this.state.properties.tenentURL + "/_api/SP.Utilities.Utility.SendEmail",
            SPHttpClient.configurations.v1,
            reqOptions
          )
          .then((response: SPHttpClientResponse) => {
            console.log(`Status code: ${response.status}`);
            console.log(`Status text: ${response.statusText}`);
            response.json().then((responseJSON: JSON) => {
              console.log(responseJSON);
              console.log("Email Sent!");
            });
          })
          .catch((err) => {
            console.log(err);
          });
      });



    //   let e = r["Title"].toString();
    //   const emailProps: EmailProperties = {
    //     To: [SSOEmail],
    //     Subject:
    //       "Alert: Composite Election Update: Shareholder ID " +
    //       data.properties.shareholderID +
    //       " – " +
    //       data.properties.shareholdingName.toString() +
    //       ": has updated their " +
    //       data.properties.shareholdingName.toString() +
    //       " Composite Election and/or Resident State",
    //     Body:
    //       "Shareholder <b>" +
    //       data.properties.shareholderID +
    //       " – " +
    //       data.properties.shareholdingName.toString() +
    //       "<b/>" +
    //       " has updated their Composite Election information to the following:<br/>" +
    //       "<b>Updated By:<b/>" +
    //       e +
    //       "<br/>" +
    //       tbl,
    //   };
    //   pnp.sp.utility
    //     .sendEmail(emailProps)
    //     .then((_) => {
    //       console.log("Email Sent!");
    //     })
    //     .catch((e) => {
    //       console.error(e);
    //     });
    // });
  }

  public validateElections = (e) => {
    let error = {
      ele_taxYear_Error: this.state.ele_taxYear_Error,
      state_slected_Error: this.state.state_slected_Error,
      de_Val_Error: this.state.de_Val_Error,
      md_Val_Error: this.state.md_Val_Error,
      pa_Val_Error: this.state.pa_Val_Error,
      va_Val_Error: this.state.va_Val_Error,
      nj_Val_Error: this.state.nj_Val_Error,
    };
    if (this.state.ele_taxYear === "-- Please Select Tax Year --") {
      this.setState({ ele_taxYear_Error: true });
      error.ele_taxYear_Error = true;
    } else {
      error.ele_taxYear_Error = false;
    }
    if (this.state.state_slected === "NA") {
      this.setState({ state_slected_Error: true });
      error.state_slected_Error = true;
    } else {
      error.state_slected_Error = false;
    }
    if (this.state.de_Val === "none") {
      this.setState({ de_Val_Error: true });
      error.de_Val_Error = true;
    } else {
      error.de_Val_Error = false;
    }
    if (this.state.md_Val === "none") {
      this.setState({ md_Val_Error: true });
      error.md_Val_Error = true;
    } else {
      error.md_Val_Error = false;
    }
    if (this.state.pa_Val === "none") {
      this.setState({ pa_Val_Error: true });
      error.pa_Val_Error = true;
    } else {
      error.pa_Val_Error = false;
    }
    if (this.state.va_Val === "none") {
      this.setState({ va_Val_Error: true });
      error.va_Val_Error = true;
    } else {
      error.va_Val_Error = false;
    }
    if (this.state.nj_Val === "none") {
      this.setState({ nj_Val_Error: true });
      error.nj_Val_Error = true;
    } else {
      error.nj_Val_Error = false;
    }
    const identifiers = Object.keys(error);
    const activeError = identifiers.filter((id) => {
      return error[id];
    });
    if (activeError.length === 0) {
      this.addElectiondataTolist();
    }
  }

  public callExceptionError = () => {
    let _html = (
      <React.Fragment>
        <div
          style={{
            backgroundColor: "#dc3545",
            padding: "3px 16px",
            borderRadius: "5px",
            color: "white",
            position: "absolute",
            zIndex: 1,
            right: 0,
          }}
        >
          <CheckCircleIcon />
          <span>
            {" "}
            Data that you entered is not valid Please contact Shareholder
            Services Office.{" "}
          </span>
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            onClick={(e) => {
              this.setState({
                catchException: false,
              });
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </React.Fragment>
    );
    return _html;
  }

  public onTaxYearChange = (e) => {
    let yr = e.target.value;
    this.setState({
      selectedYear: yr,
    });
    let taxYear = this.state.years_DD;
    let isYeatActive = [];
    isYeatActive = _.filter(taxYear, (val) => {
      return val.text === yr;
    });
    if (yr === "-- Please Select Tax Year --") {
      this.setState({
        ele_taxYear: yr,
        ele_taxYear_Error: true,
      });
    } else {
      if (isYeatActive[0].makeAvilabled === "Yes") {
        let electionInformation = [];
        electionInformation = _.filter(
          this.state.electionInformation,
          (val) => {
            return val.TaxYear === yr;
          }
        );
        console.log(this.state.electionInformation);
        if (electionInformation.length === 1) {
          this.setState({
            ele_taxYear: yr,
            ele_taxYear_Error: false,
            de_disabled: false,
            md_disabled: false,
            nj_disabled: false,
            pa_disabled: false,
            va_disabled: false,
            submitElection_Btn: false,
            state_slected_disabled: false,
            getIDforUpdate: electionInformation[0],
            va_Val: electionInformation[0].Virginia,
            de_Val: electionInformation[0].Delaware,
            md_Val: electionInformation[0].Maryland,
            pa_Val: electionInformation[0].Pennsylvania,
            nj_Val: electionInformation[0].NewJersey,
            state_slected: electionInformation[0].StateforStateTaxes,
          });
        } else {
          this.setState({
            getIDforUpdate: [],
            ele_taxYear: yr,
            ele_taxYear_Error: false,
            de_disabled: false,
            md_disabled: false,
            nj_disabled: false,
            pa_disabled: false,
            va_disabled: false,
            submitElection_Btn: false,
            state_slected_disabled: false,
            va_Val: "none",
            de_Val: "none",
            md_Val: "none",
            pa_Val: "none",
            nj_Val: "none",
            state_slected: "NA",
          });
        }
      } else {
        let electionInfo = this.state.electionInformation;
        let electionInformation = [];
        electionInformation = _.filter(electionInfo, (val) => {
          return val.TaxYear === yr;
        });
        console.log(electionInformation);
        if (electionInformation.length > 0) {
          this.setState({
            ele_taxYear: yr,
            ele_taxYear_Error: false,
            va_Val: electionInformation[0].Virginia,
            de_Val: electionInformation[0].Delaware,
            md_Val: electionInformation[0].Maryland,
            pa_Val: electionInformation[0].Pennsylvania,
            nj_Val: electionInformation[0].NewJersey,
            state_slected: electionInformation[0].StateforStateTaxes,
          });
        } else {
          this.setState({
            ele_taxYear: yr,
            ele_taxYear_Error: false,
            va_Val: "none",
            de_Val: "none",
            md_Val: "none",
            pa_Val: "none",
            nj_Val: "none",
            state_slected: "NA",
          });
        }
      }
    }
  }

  public getTaxyears = () => {
    let newWeb = new Web(this.state.properties.tenentURL);
    newWeb.lists
      .getByTitle("Tax Year")
      .items.select("Title", "ID", "MakeAvilable")
      .orderBy("Title", false)
      .get()
      .then((d) => {
        if (d.length > 0) {
          let obj = [
            {
              key: "NA",
              text: "-- Please Select Tax Year --",
              makeAvilabled: "",
            },
          ];
          let makeAvilableYear = "";
          for (let index = 0; index < d.length; index++) {
            if (d[index].MakeAvilable === "Yes") {
              makeAvilableYear = d[index].Title;
              obj.push({
                key: d[index].Title,
                text: d[index].Title,
                makeAvilabled: d[index].MakeAvilable,
              });
            } else {
              obj.push({
                key: d[index].Title,
                text: d[index].Title,
                makeAvilabled: d[index].MakeAvilable,
              });
            }
          }
          this.setState(
            {
              years_DD: obj,
              makeAvilable_Year: makeAvilableYear,
            },
            () => {
              if (this.state.properties.shareholderID !== undefined) {
                this.getAccountInfromation(this.state.properties.shareholderID);
              }
            }
          );
        }
      });
  }

  public defaultElections = (selectedState) => {
    switch (selectedState) {
      case "DE":
        this.setState({
          state_slected: selectedState,
          de_Val: "Out",
          md_Val: "none",
          pa_Val: "none",
          va_Val: "none",
          nj_Val: "none",
          de_disabled: true,
          md_disabled: false,
          nj_disabled: false,
          pa_disabled: false,
          va_disabled: false,
          de_Val_Error: false,
        });
        break;
      case "MD":
        this.setState({
          state_slected: selectedState,
          md_Val: "Out",
          de_Val: "none",
          pa_Val: "none",
          va_Val: "none",
          nj_Val: "none",
          md_disabled: true,
          de_disabled: false,
          nj_disabled: false,
          pa_disabled: false,
          va_disabled: false,
          md_Val_Error: false,
        });
        break;
      case "NJ":
        this.setState({
          state_slected: selectedState,
          nj_Val: "Out",
          de_Val: "none",
          md_Val: "none",
          pa_Val: "none",
          va_Val: "none",
          md_disabled: false,
          de_disabled: false,
          nj_disabled: true,
          pa_disabled: false,
          va_disabled: false,
          nj_Val_Error: false,
        });
        break;
      case "PA":
        this.setState({
          state_slected: selectedState,
          pa_Val: "Out",
          de_Val: "none",
          md_Val: "none",
          va_Val: "none",
          nj_Val: "none",
          md_disabled: false,
          de_disabled: false,
          nj_disabled: false,
          pa_disabled: true,
          va_disabled: false,
          pa_Val_Error: false,
        });
        break;
      case "VA":
        this.setState({
          state_slected: selectedState,
          va_Val: "Out",
          de_Val: "none",
          md_Val: "none",
          pa_Val: "none",
          nj_Val: "none",
          md_disabled: false,
          de_disabled: false,
          nj_disabled: false,
          pa_disabled: false,
          va_disabled: true,
          va_Val_Error: false,
        });
        break;
      default:
        this.setState({
          md_disabled: false,
          de_disabled: false,
          nj_disabled: false,
          pa_disabled: false,
          va_disabled: false,
          va_Val: "none",
          de_Val: "none",
          md_Val: "none",
          pa_Val: "none",
          nj_Val: "none",
        });
        console.log("default");
        break;
    }
  }

  public GRANTORandQSST = (selectedState) => {
    switch (selectedState) {
      case "DE":
        this.setState({
          state_slected: selectedState,
          de_Val: "Out",
          md_Val: "none",
          pa_Val: "Out",
          va_Val: "none",
          nj_Val: "none",
          de_disabled: true,
          md_disabled: false,
          nj_disabled: false,
          pa_disabled: true,
          va_disabled: false,
          de_Val_Error: false,
        });
        break;
      case "MD":
        this.setState({
          state_slected: selectedState,
          md_Val: "Out",
          de_Val: "none",
          pa_Val: "Out",
          va_Val: "none",
          nj_Val: "none",
          md_disabled: true,
          de_disabled: false,
          nj_disabled: false,
          pa_disabled: true,
          va_disabled: false,
          md_Val_Error: false,
        });
        break;
      case "NJ":
        this.setState({
          state_slected: selectedState,
          nj_Val: "Out",
          de_Val: "none",
          md_Val: "none",
          pa_Val: "Out",
          va_Val: "none",
          md_disabled: false,
          de_disabled: false,
          nj_disabled: true,
          pa_disabled: true,
          va_disabled: false,
          nj_Val_Error: false,
        });
        break;
      case "PA":
        this.setState({
          state_slected: selectedState,
          pa_Val: "Out",
          de_Val: "none",
          md_Val: "none",
          va_Val: "none",
          nj_Val: "none",
          md_disabled: false,
          de_disabled: false,
          nj_disabled: false,
          pa_disabled: true,
          va_disabled: false,
          pa_Val_Error: false,
        });
        break;
      case "VA":
        this.setState({
          state_slected: selectedState,
          va_Val: "Out",
          de_Val: "none",
          md_Val: "none",
          pa_Val: "Out",
          nj_Val: "none",
          md_disabled: false,
          de_disabled: false,
          nj_disabled: false,
          pa_disabled: true,
          va_disabled: true,
          va_Val_Error: false,
        });
        break;
      default:
        this.setState({
          md_disabled: false,
          de_disabled: false,
          nj_disabled: false,
          pa_disabled: true,
          va_disabled: false,
          va_Val: "none",
          de_Val: "none",
          md_Val: "none",
          pa_Val: "Out",
          nj_Val: "none",
        });
        console.log("default");
        break;
    }
  }

  public ESBTandTRUST = (selectedState) => {
    switch (selectedState) {
      case "DE":
        this.setState({
          state_slected: selectedState,
          de_Val: "Out",
          md_Val: "Out",
          pa_Val: "Out",
          va_Val: "none",
          nj_Val: "none",
          de_disabled: true,
          md_disabled: true,
          nj_disabled: false,
          pa_disabled: true,
          va_disabled: false,
          de_Val_Error: false,
        });
        break;
      case "MD":
        this.setState({
          state_slected: selectedState,
          md_Val: "Out",
          de_Val: "none",
          pa_Val: "Out",
          va_Val: "none",
          nj_Val: "none",
          md_disabled: true,
          de_disabled: false,
          nj_disabled: false,
          pa_disabled: true,
          va_disabled: false,
          md_Val_Error: false,
        });
        break;
      case "NJ":
        this.setState({
          state_slected: selectedState,
          nj_Val: "Out",
          de_Val: "none",
          md_Val: "Out",
          pa_Val: "Out",
          va_Val: "none",
          md_disabled: true,
          de_disabled: false,
          nj_disabled: true,
          pa_disabled: true,
          va_disabled: false,
          nj_Val_Error: false,
        });
        break;
      case "PA":
        this.setState({
          state_slected: selectedState,
          pa_Val: "Out",
          de_Val: "none",
          md_Val: "Out",
          va_Val: "none",
          nj_Val: "none",
          md_disabled: true,
          de_disabled: false,
          nj_disabled: false,
          pa_disabled: true,
          va_disabled: false,
          pa_Val_Error: false,
        });
        break;
      case "VA":
        this.setState({
          state_slected: selectedState,
          va_Val: "Out",
          de_Val: "none",
          md_Val: "Out",
          pa_Val: "Out",
          nj_Val: "none",
          md_disabled: true,
          de_disabled: false,
          nj_disabled: false,
          pa_disabled: true,
          va_disabled: true,
          va_Val_Error: false,
        });
        break;
      default:
        this.setState({
          md_disabled: true,
          de_disabled: false,
          nj_disabled: false,
          pa_disabled: true,
          va_disabled: false,
          va_Val: "none",
          de_Val: "none",
          md_Val: "Out",
          pa_Val: "Out",
          nj_Val: "none",
        });
        console.log("default");
        break;
    }
  }

  public onStateChange(e) {
    let selectedState = e.target.value;
    if (selectedState === "NA") {
      this.setState({
        state_slected: selectedState,
        state_slected_Error: true,
      });
    } else {
      this.setState(
        {
          state_slected: selectedState,
          state_slected_Error: false,
        },
        () => {
          let OwnershipType = this.state.OwnershipType;
          switch (OwnershipType) {
            case "Individual":
              this.defaultElections(selectedState);
              break;
            case "Joint":
              this.defaultElections(selectedState);
              break;
            case "UTMA":
              this.defaultElections(selectedState);
              break;
            case "Estate":
              this.defaultElections(selectedState);
              break;
            case "Grantor":
              // ! Chnages Need to be done
              this.GRANTORandQSST(selectedState);
              break;
            case "ESBT":
              // ! Chnages Need to be done
              this.ESBTandTRUST(selectedState);
              break;
            case "QSST":
              // ! Chnages Need to be done
              this.GRANTORandQSST(selectedState);
              break;
            case "Trust":
              // ! Chnages Need to be done
              this.ESBTandTRUST(selectedState);
              break;
            case "ESOP":
              this.defaultElections(selectedState);
              break;
            case "TEO":
              this.defaultElections(selectedState);
              break;
            default:
              this.defaultElections(selectedState);
              break;
          }
        }
      );
    }
  }

  public componentDidMount() {
    console.log(this.props.properties.pageContext);
    this.getTaxyears();
    if (this.state.properties.shareholderID !== undefined) {
      this.getCompositeElectionsInformation();
      this.getTrusteType(this.state.properties.shareholderID);
    }
  }

  public getTrusteType = (id) => {
    let newWeb = new Web(this.state.properties.tenentURL);
    newWeb.lists
      .getByTitle("Shareholding Account Details")
      .items.select("Id", "Title", "trustType")
      .orderBy("Title", true)
      .filter("Title eq '" + id + "'")
      .get()
      .then((d) => {
        if (d.length > 0) {
          this.setState({
            OwnershipType: d[0].trustType,
          });
        }
      });
  }

  public getAccountInfromation(id): any {
    if (id) {
      let newWeb = new Web(this.state.properties.tenentURL);
      newWeb.lists
        .getByTitle("Shareholding Elections")
        .items.select(
          "ID",
          "Title",
          "TaxYear",
          "StateforStateTaxes",
          "Delaware",
          "Maryland",
          "NewJersey",
          "Pennsylvania",
          "Virginia",
          //"OwnershipType",
          "Modified",
          "Created"
        )
        .orderBy("Title", true)
        .filter("Title eq '" + id + "'")
        .get()
        .then((d) => {
          if (d.length > 0) {
            let res = [];
            let isYeatActive = [];
            res = _.filter(d, (val) => {
              return val.TaxYear === this.state.makeAvilable_Year;
            });
            isYeatActive = _.filter(this.state.years_DD, (val) => {
              return val.text === this.state.makeAvilable_Year;
            });
            if (res.length === 1) {
              this.setState(
                {
                  electionInformation: d,
                  ele_taxYear: res[0].TaxYear !== null ? res[0].TaxYear : "NA",
                  state_slected:
                    res[0].StateforStateTaxes !== null
                      ? res[0].StateforStateTaxes
                      : "NA",
                  de_Val: res[0].Delaware !== null ? res[0].Delaware : "none",
                  md_Val: res[0].Maryland !== null ? res[0].Maryland : "none",
                  nj_Val: res[0].NewJersey !== null ? res[0].NewJersey : "none",
                  pa_Val:
                    res[0].Pennsylvania !== null ? res[0].Pennsylvania : "none",
                  va_Val: res[0].Virginia !== null ? res[0].Virginia : "none",
                  de_disabled: false,
                  md_disabled: false,
                  nj_disabled: false,
                  pa_disabled: false,
                  va_disabled: false,
                  //OwnershipType:res[0].OwnershipType,
                },
                () => {
                  this.onLoadSetStateOptions();
                }
              );
            } else {
              this.setState(
                {
                  electionInformation: d,
                  state_slected: "NA",
                  ele_taxYear: "-- Please Select Tax Year --",
                  de_Val: "none",
                  md_Val: "none",
                  nj_Val: "none",
                  pa_Val: "none",
                  va_Val: "none",
                  de_disabled: false,
                  md_disabled: false,
                  nj_disabled: false,
                  pa_disabled: false,
                  va_disabled: false,
                  //OwnershipType:res[0].OwnershipType,
                },
                () => {
                  this.onLoadSetStateOptions();
                }
              );
            }
          } else {
            this.setState({
              electionInformation: [],
              state_slected: "NA",
              ele_taxYear: "-- Please Select Tax Year --",
            });
          }
        });
    }
  }

  public getCompositeElectionsInformation = (): void => {
    let newWeb = new Web(this.state.properties.tenentURL);
    newWeb.lists
      .getByTitle("Composite Elections Information")
      .items.select("ID", "Title", "Information", "Modified", "Created")
      .orderBy("Title", true)
      .get()
      .then((d) => {
        console.log(d);
        this.setState({ compositeElectionsInformation: d });
      })
      .catch((e) => {
        console.log(e.toString());
      });
  }

  public onLoadSetStateOptions = () => {
    let selectedState = this.state.state_slected;
    switch (selectedState) {
      case "DE":
        this.setState({
          de_Val: "Out",
          de_disabled: true,
        });
        break;
      case "MD":
        this.setState({
          md_Val: "Out",
          md_disabled: true,
        });
        break;
      case "NJ":
        this.setState({
          nj_Val: "Out",
          nj_disabled: true,
        });
        break;
      case "PA":
        this.setState({
          pa_Val: "Out",
          pa_disabled: true,
        });
        break;
      case "VA":
        this.setState({
          va_Val: "Out",
          va_disabled: true,
        });
        break;
      default:
        this.setState({
          md_disabled: false,
          de_disabled: false,
          nj_disabled: false,
          pa_disabled: false,
          va_disabled: false,
        });
    }
  }

  public snackbar_handleClose = () => {
    this.setState({ ...this.state, snackbar_open: false });
  }

  public addElectiondataTolist = () => {
    let newWeb = new Web(this.state.properties.tenentURL);
    this.setState({ submitted: true }, () => {
      if (this.state.electionInformation.length > 0) {
        let getID = _.filter(this.state.electionInformation, (val) => {
          return val.TaxYear === this.state.ele_taxYear;
        });
        if (getID.length > 0) {
          newWeb.lists
            .getByTitle("Shareholding Elections")
            .items.getById(getID[0].ID)
            .update({
              Title: this.state.properties.shareholderID.toString(),
              TaxYear: this.state.ele_taxYear.toString(),
              StateforStateTaxes: this.state.state_slected.toString(),
              Delaware: this.state.de_Val.toString(),
              Maryland: this.state.md_Val.toString(),
              NewJersey: this.state.nj_Val.toString(),
              Pennsylvania: this.state.pa_Val.toString(),
              Virginia: this.state.va_Val.toString(),
              Florida: "N/A",
            })
            .then((i) => {
              this.sendEmail(this.state);
              this.setState({
                electionSnackbar_open: true,
                submitted: false,
              });
            })
            .catch((e) => {
              console.log(e.toString());
              this.setState(
                {
                  catchException: true,
                },
                () => {
                  setTimeout(() => {
                    this.setState({ catchException: false });
                  }, 5000);
                }
              );
            });
        } else if (getID.length === 0) {
          newWeb.lists
            .getByTitle("Shareholding Elections")
            .items.add({
              Title: this.state.properties.shareholderID.toString(),
              TaxYear: this.state.ele_taxYear.toString(),
              StateforStateTaxes: this.state.state_slected.toString(),
              Delaware: this.state.de_Val.toString(),
              Maryland: this.state.md_Val.toString(),
              NewJersey: this.state.nj_Val.toString(),
              Pennsylvania: this.state.pa_Val.toString(),
              Virginia: this.state.va_Val.toString(),
              Florida: "N/A",
            })
            .then((i) => {
              this.sendEmail(this.state);
              this.setState({
                electionSnackbar_open: true,
                submitted: false,
              });
            })
            .catch((e) => {
              console.log(e.toString());
              this.setState(
                {
                  catchException: true,
                },
                () => {
                  setTimeout(() => {
                    this.setState({ catchException: false });
                  }, 5000);
                }
              );
            });
        } else {
          this.setState({
            catchException: true,
          });
        }
      } else {
        // this.setState({
        //   catchException: true,
        // });
        newWeb.lists
        .getByTitle("Shareholding Elections")
        .items.add({
          Title: this.state.properties.shareholderID.toString(),
          TaxYear: this.state.ele_taxYear.toString(),
          StateforStateTaxes: this.state.state_slected.toString(),
          Delaware: this.state.de_Val.toString(),
          Maryland: this.state.md_Val.toString(),
          NewJersey: this.state.nj_Val.toString(),
          Pennsylvania: this.state.pa_Val.toString(),
          Virginia: this.state.va_Val.toString(),
          Florida: "N/A",
        })
        .then((i) => {
          this.sendEmail(this.state);
          this.setState({
            electionSnackbar_open: true,
            submitted: false,
          });
        })
        .catch((e) => {
          console.log(e.toString());
          this.setState(
            {
              catchException: true,
            },
            () => {
              setTimeout(() => {
                this.setState({ catchException: false });
              }, 5000);
            }
          );
        });
      }
    });
    setTimeout(
      () =>
        this.setState({
          electionSnackbar_open: false,
          submitted: false,
        }),
      5000
    );
  }

  public info_html = () => {
    let check = (
      <React.Fragment>
        <div className="row" style={{ margin: "15px 0px" }}>
          <div className="col-sm-5">
            <FormControl
              error={this.state.ele_taxYear_Error}
              fullWidth
              style={{ margin: "10px", color: "black" }}
            >
              <InputLabel
                error={this.state.ele_taxYear_Error}
                style={{
                  color:
                    this.state.ele_taxYear_Error !== true ? "#275458" : "red",
                }}
              >
                Tax Year*
              </InputLabel>
              <Select
                name="ele_taxYear"
                value={this.state.ele_taxYear}
                defaultValue={{
                  key: "NA",
                  text: "-- Please Select Tax Year --",
                }}
                onChange={(e) => {
                  this.onTaxYearChange(e);
                }}
                error={this.state.ele_taxYear_Error}
                fullWidth
              >
                {this.state.years_DD.map((item) => {
                  return (
                    <MenuItem key={item.length} value={item.text}>
                      {item.text}
                    </MenuItem>
                  );
                })}
              </Select>
              {this.state.ele_taxYear_Error !== false ? (
                <FormHelperText>Please Select Tax Year</FormHelperText>
              ) : (
                false
              )}
            </FormControl>
          </div>
          <div
            className="col-sm-1 align-self-end"
            style={{ marginBottom: "10px" }}
          >
            <a
              onClick={() => {
                window.open(this.state.taxYearsTypesLink);
                return false;
              }}
              target="_blank"
            >
              <FontAwesomeIcon
                style={{
                  marginLeft: "3px",
                  color: "#275458",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
                icon={faExternalLinkAlt}
              />
            </a>
          </div>
          <div className="col-sm-5">
            <FormControl
              fullWidth
              error={this.state.state_slected_Error}
              style={{ margin: "10px" }}
            >
              <InputLabel
                error={this.state.state_slected_Error}
                style={{
                  color:
                    this.state.state_slected_Error !== true ? "#275458" : "red",
                }}
              >
                Resident State for State Taxes*
              </InputLabel>
              <Select
                labelId="state-for-state-tax"
                input={<Input />}
                name="dma_State"
                onChange={this.onStateChange.bind(this)}
                value={this.state.state_slected}
              >
                {this.statesDD.map((item, i) => {
                  return (
                    <MenuItem key={i} value={item.key}>
                      {item.text}
                    </MenuItem>
                  );
                })}
              </Select>
              {this.state.state_slected_Error !== false ? (
                <FormHelperText>Please Select State</FormHelperText>
              ) : (
                false
              )}
            </FormControl>
          </div>
        </div>
        <div className="row" style={{ margin: "15px 0px" }}>
          <div className="col-md-4">
            <div style={{ margin: "0px 10px" }}>
              <FormControl
                error={this.state.de_Val_Error}
                fullWidth
                component="fieldset"
              >
                <FormLabel
                  error={this.state.de_Val_Error}
                  component="legend"
                  style={{
                    color: this.state.de_Val_Error !== true ? "#275458" : "red",
                  }}
                  //style={{ color: "#275458" }}
                >
                  Delaware*
                </FormLabel>
                <RadioGroup
                  row
                  aria-label="position"
                  name="position"
                  defaultValue="none"
                  value={this.state.de_Val}
                  onChange={(e) => {
                    if (e.target.value === "" || e.target.value === "none") {
                      this.setState({
                        de_Val: e.target.value,
                        de_Val_Error: true,
                      });
                    } else {
                      this.setState({
                        de_Val: e.target.value,
                        de_Val_Error: false,
                      });
                    }
                  }}
                >
                  <FormControlLabel
                    value="In"
                    control={<CustomRadio />}
                    label="In"
                    disabled={this.state.de_disabled}
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="Out"
                    control={<CustomRadio color="primary" />}
                    label="Out"
                    disabled={this.state.de_disabled}
                    labelPlacement="end"
                  />
                </RadioGroup>
                {this.state.de_Val_Error !== false ? (
                  <FormHelperText className={styles.formHelperTextStyles}>
                    Delaware Cannot be blank
                  </FormHelperText>
                ) : (
                  false
                )}
              </FormControl>
            </div>
          </div>
          <div className="col-md-4">
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" style={{ color: "#275458" }}>
                Florida*
              </FormLabel>
              <InputLabel disabled>Not applicable</InputLabel>
            </FormControl>
          </div>
          <div className="col-md-4">
            <FormControl
              component="fieldset"
              error={this.state.md_Val_Error}
              fullWidth
            >
              <FormLabel
                component="legend"
                style={{
                  color: this.state.de_Val_Error !== true ? "#275458" : "red",
                }}
                //style={{ color: "#275458" }}
              >
                Maryland*
              </FormLabel>
              <RadioGroup
                row
                aria-label="position"
                defaultValue="none"
                name="position"
                value={this.state.md_Val}
                onChange={(e) => {
                  if (e.target.value === "" || e.target.value === "none") {
                    this.setState({
                      md_Val: e.target.value,
                      md_Val_Error: true,
                    });
                  } else {
                    this.setState({
                      md_Val: e.target.value,
                      md_Val_Error: false,
                    });
                  }
                }}
              >
                <FormControlLabel
                  value="In"
                  control={<CustomRadio />}
                  label="In"
                  disabled={this.state.md_disabled}
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="Out"
                  control={<CustomRadio />}
                  label="Out"
                  disabled={this.state.md_disabled}
                  labelPlacement="end"
                />
              </RadioGroup>
              {this.state.md_Val_Error !== false ? (
                <FormHelperText className={styles.formHelperTextStyles}>
                  Maryland Cannot be blank
                </FormHelperText>
              ) : (
                false
              )}
            </FormControl>
          </div>
        </div>
        <div className="row" style={{ margin: "15px 0px" }}>
          <div className="col-md-4">
            <div style={{ margin: "0px 10px" }}>
              <FormControl
                error={this.state.nj_Val_Error}
                component="fieldset"
                fullWidth
              >
                <FormLabel
                  component="legend"
                  //style={{ color: "#275458" }}
                  style={{
                    color: this.state.nj_Val_Error !== true ? "#275458" : "red",
                  }}
                >
                  New Jersey *
                </FormLabel>
                <RadioGroup
                  row
                  aria-label="position"
                  name="position"
                  defaultValue="none"
                  value={this.state.nj_Val}
                  onChange={(e) => {
                    if (e.target.value === "" || e.target.value === "none") {
                      this.setState({
                        nj_Val: e.target.value,
                        nj_Val_Error: true,
                      });
                    } else {
                      this.setState({
                        nj_Val: e.target.value,
                        nj_Val_Error: false,
                      });
                    }
                  }}
                >
                  <FormControlLabel
                    value="In"
                    control={<CustomRadio />}
                    label="In"
                    disabled={this.state.nj_disabled}
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="Out"
                    control={<CustomRadio />}
                    label="Out"
                    disabled={this.state.nj_disabled}
                    labelPlacement="end"
                  />
                </RadioGroup>
                {this.state.nj_Val_Error !== false ? (
                  <FormHelperText className={styles.formHelperTextStyles}>
                    New Jersey Cannot be blank
                  </FormHelperText>
                ) : (
                  false
                )}
              </FormControl>
            </div>
          </div>
          <div className="col-md-4">
            <div style={{ margin: "0px 10px" }}>
              <FormControl
                component="fieldset"
                fullWidth
                error={this.state.pa_Val_Error}
              >
                <FormLabel
                  component="legend"
                  style={{
                    color: this.state.pa_Val_Error !== true ? "#275458" : "red",
                  }}
                >
                  Pennsylvania*
                </FormLabel>
                <RadioGroup
                  row
                  aria-label="position"
                  name="position"
                  defaultValue="none"
                  value={this.state.pa_Val}
                  onChange={(e) => {
                    if (e.target.value === "" || e.target.value === "none") {
                      this.setState({
                        pa_Val: e.target.value,
                        pa_Val_Error: true,
                      });
                    } else {
                      this.setState({
                        pa_Val: e.target.value,
                        pa_Val_Error: false,
                      });
                    }
                  }}
                >
                  <FormControlLabel
                    value="In"
                    control={<CustomRadio />}
                    label="In"
                    disabled={this.state.pa_disabled}
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="Out"
                    control={<CustomRadio />}
                    label="Out"
                    disabled={this.state.pa_disabled}
                    labelPlacement="end"
                  />
                </RadioGroup>
                {this.state.pa_Val_Error !== false ? (
                  <FormHelperText className={styles.formHelperTextStyles}>
                    Pennsylvania Cannot be blank
                  </FormHelperText>
                ) : (
                  false
                )}
              </FormControl>
            </div>
          </div>
          <div className="col-md-4">
            <FormControl
              component="fieldset"
              fullWidth
              error={this.state.va_Val_Error}
            >
              <FormLabel
                component="legend"
                style={{
                  color: this.state.va_Val_Error !== true ? "#275458" : "red",
                }}
              >
                Virginia*
              </FormLabel>
              <RadioGroup
                row
                aria-label="position"
                defaultValue="none"
                name="position"
                value={this.state.va_Val}
                onChange={(e) => {
                  if (e.target.value === "" || e.target.value === "none") {
                    this.setState({
                      va_Val: e.target.value,
                      va_Val_Error: true,
                    });
                  } else {
                    this.setState({
                      va_Val: e.target.value,
                      va_Val_Error: false,
                    });
                  }
                }}
              >
                <FormControlLabel
                  value="In"
                  control={<CustomRadio />}
                  label="In"
                  disabled={this.state.va_disabled}
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="Out"
                  control={<CustomRadio />}
                  label="Out"
                  disabled={this.state.va_disabled}
                  labelPlacement="end"
                />
              </RadioGroup>
              {this.state.va_Val_Error !== false ? (
                <FormHelperText className={styles.formHelperTextStyles}>
                  Virginia Cannot be blank
                </FormHelperText>
              ) : (
                false
              )}
            </FormControl>
          </div>
        </div>
        <div className="row" style={{ margin: "15px 0px" }}>
          <div className="col-md-4">
            <FormControl component="fieldset" fullWidth>
              <FormLabel className={styles.genralinputColor} component="legend">
                Federal*
              </FormLabel>
              <InputLabel className={styles.genralinputColor} disabled>
                Not applicable
              </InputLabel>
            </FormControl>
          </div>
        </div>
      </React.Fragment>
    );
    return check;
  }

  public render(): React.ReactElement<any> {
    const info_html = this.info_html();
    return (
      <div className={styles.shareholders}>
        <div className={styles.elections}>
          <form
            ref={(e) => this.electionRef}
            onSubmit={(e) => e.preventDefault()}
          >
            <Paper className={styles.paper}>
              <a
                style={{ cursor: "pointer" }}
                onClick={() => {
                  window.open(this.state.CompositeElectionsInformationLink);
                  return false;
                }}
                target="_blank"
              >
                <Typography variant="h5" className={styles.electionSubHeadings}>
                  <BorderColorIcon style={{ marginBottom: "5px" }} />{" "}
                  Shareholding Resident State for Taxes and Composite Elections
                </Typography>
              </a>
              <div className="alert" role="alert">
                {this.state.catchException === true ? (
                  <React.Fragment>{this.callExceptionError()}</React.Fragment>
                ) : null}
                <p className={`${styles.electionsGeneralText} text-justify`}>
                  {this.state.compositeElectionsInformation.length !== 0 ? (
                    <React.Fragment>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: this.state.compositeElectionsInformation[0]
                            .Information,
                        }}
                      ></span>
                    </React.Fragment>
                  ) : null}
                </p>
              </div>
              <div
                className={`${styles.alignAlert} alert alert-secondary`}
                role="alert"
              >
                <p className={`${styles.electionsGeneralText} text-justify`}>
                  <span className="text-danger border-bottom border-danger">
                    Trust shareholders please note:
                  </span>{" "}
                  {this.state.compositeElectionsInformation.length !== 0 ? (
                    <React.Fragment>
                      <React.Fragment>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: this.state.compositeElectionsInformation[1]
                              .Information,
                          }}
                        ></span>
                      </React.Fragment>
                    </React.Fragment>
                  ) : null}
                </p>
              </div>
              <div className={`${styles.alignAlert} alert`} role="alert">
                <p className={`${styles.electionsGeneralText} text-justify`}>
                  {this.state.compositeElectionsInformation.length !== 0 ? (
                    <React.Fragment>
                      <React.Fragment>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: this.state.compositeElectionsInformation[2]
                              .Information,
                          }}
                        ></span>
                      </React.Fragment>
                    </React.Fragment>
                  ) : null}
                  <br />
                </p>
              </div>

              <div className="col-lg-12 col-md-12 col-sm-12 col-sx-12">
                <div className="card">
                  <div className={`card-body`}>
                    <div className={`${styles.cardHead_General} card-header`}>
                      <h6>
                        Update your Current Resident State and Composite
                        Elections below and click "Submit Elections"
                      </h6>
                    </div>
                    <div className="row-fluid">
                      {info_html}
                      <div className="row">&nbsp;</div>
                      <div className="row">
                        <div className="col-lg-8 class-md-8 class-sm-12 class-xs-12">
                          <div className="alert alert-danger">
                            <p
                              className={`${styles.electionsGeneralText} text-justify`}
                            >
                              <strong
                                className={`${styles.electionsGeneralText}`}
                              >
                                * REQUIRED FIELDS – NOTE:{" "}
                              </strong>
                              If neither IN nor OUT are indicated above for any
                              state, the Company does NOT have an election on
                              record for this year and must treat those states
                              as if they were OUT elections by rule
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-4 class-md-4 class-sm-12 class-xs-12">
                          <Button
                            color="primary"
                            // variant="raised"
                            type="button"
                            className={`${styles.electionSubmitBtn} fixed-bottom`}
                            onClick={this.validateElections}
                          >
                            <CheckCircleIcon fontSize="default" />{" "}
                            {(this.state.submitted && "Election Submitted!") ||
                              (!this.state.submitted && "Submit Election")}
                          </Button>
                          <div
                            style={{
                              float: "right",
                              marginTop: "10px",
                            }}
                          >
                            {this.state.electionSnackbar_open ? (
                              <div
                                style={{
                                  backgroundColor: "#43a047",
                                  padding: "3px 16px",
                                  borderRadius: "5px",
                                  color: "white",
                                }}
                              >
                                <CheckCircleIcon />
                                <span> Updated Successfully</span>
                                <IconButton
                                  key="close"
                                  aria-label="close"
                                  color="inherit"
                                  onClick={(e) => {
                                    this.setState({
                                      electionSnackbar_open: false,
                                    });
                                  }}
                                >
                                  <CloseIcon />
                                </IconButton>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Paper>
          </form>
        </div>
      </div>
    );
  }
}

// public onStateChange(e) {
//   let selectedState = e.target.value;
//   if (selectedState === "NA") {
//     this.setState({
//       state_slected: selectedState,
//       state_slected_Error: true
//     });
//   } else {
//     this.setState({
//       state_slected: selectedState,
//       state_slected_Error: false
//     });
//     switch (selectedState) {
//       case "DE":
//         this.setState({
//           state_slected: selectedState,
//           de_Val: "Out",
//           md_Val: "none",
//           pa_Val: "none",
//           va_Val: "none",
//           nj_Val: "none",
//           de_disabled: true,
//           md_disabled: false,
//           nj_disabled: false,
//           pa_disabled: false,
//           va_disabled: false,
//           de_Val_Error: false
//         });
//         break;
//       case "MD":
//         this.setState({
//           state_slected: selectedState,
//           md_Val: "Out",
//           de_Val: "none",
//           pa_Val: "none",
//           va_Val: "none",
//           nj_Val: "none",
//           md_disabled: true,
//           de_disabled: false,
//           nj_disabled: false,
//           pa_disabled: false,
//           va_disabled: false,
//           md_Val_Error: false
//         });
//         break;
//       case "NJ":
//         this.setState({
//           state_slected: selectedState,
//           nj_Val: "Out",
//           de_Val: "none",
//           md_Val: "none",
//           pa_Val: "none",
//           va_Val: "none",
//           md_disabled: false,
//           de_disabled: false,
//           nj_disabled: true,
//           pa_disabled: false,
//           va_disabled: false,
//           nj_Val_Error: false
//         });
//         break;
//       case "PA":
//         this.setState({
//           state_slected: selectedState,
//           pa_Val: "Out",
//           de_Val: "none",
//           md_Val: "none",
//           va_Val: "none",
//           nj_Val: "none",
//           md_disabled: false,
//           de_disabled: false,
//           nj_disabled: false,
//           pa_disabled: true,
//           va_disabled: false,
//           pa_Val_Error: false
//         });
//         break;
//       case "VA":
//         this.setState({
//           state_slected: selectedState,
//           va_Val: "Out",
//           de_Val: "none",
//           md_Val: "none",
//           pa_Val: "none",
//           nj_Val: "none",
//           md_disabled: false,
//           de_disabled: false,
//           nj_disabled: false,
//           pa_disabled: false,
//           va_disabled: true,
//           va_Val_Error: false
//         });
//         break;
//       default:
//         this.setState({
//           md_disabled: false,
//           de_disabled: false,
//           nj_disabled: false,
//           pa_disabled: false,
//           va_disabled: false,
//           va_Val: "none",
//           de_Val: "none",
//           md_Val: "none",
//           pa_Val: "none",
//           nj_Val: "none"
//         });
//         console.log("default");
//         break;
//     }
//   }
// }

{
  /* The below items represent your current tax year’s recorded
                  Resident State and State Composite Tax Return Elections
                  (Composite Elections) on file with Wawa, Inc. If the elections
                  below are blank or don’t agree with your records or
                  intentions, please update them by completing and submitting
                  below. If you have any questions, please contact the
                  Shareholder Services Office at{" "}
                  <a
                    className="text-danger"
                    href="mailto:ShareholderServices@Wawa.com"
                  >
                    ShareholderServices@Wawa.com
                  </a>{" "}
                  or 484-840-1813.*/
}

{
  /* <p className={`${styles.electionsGeneralText} text-justify`}>
                  We strongly encourage you to consult with your tax advisors to
                  determine the best elections for your shareholdings. You can
                  view (but not change) your prior year elections by changing
                  the "Tax Year" below using the drop-down list. The state
                  buttons will then reflect the elections for the year that is
                  showing in the "Tax Year" box.
                  <p className={`${styles.electionsGeneralText} text-justify`}>
                    &nbsp;
                  </p>
                </p>
                <p className={`${styles.electionsGeneralText} text-justify`}>
                  The full instruction and explanation document for composite
                  elections can be found in the document library or by clicking
                  the following link: Download Full Elections Instructions
                  <p className={`${styles.electionsGeneralText} text-justify`}>
                    &nbsp;
                  </p>
                </p>
                <p className={`${styles.electionsGeneralText} text-justify`}>
                  The Ernst and Young opinion letter addressing trusts'
                  participation in the Maryland composite return can also be
                  found in the document library or by clicking the following
                  link: Download Ernst & Young Opinion Letter
                  <p className={`${styles.electionsGeneralText} text-justify`}>
                    &nbsp;
                  </p>
                </p> */
}

{
  /* Trusts are generally limited in, or prohibited from,
                  participating in composite tax returns. However, Wawa has
                  received permission for certain trusts to participate in some
                  states' composite returns and there are more opportunities to
                  participate in 2019 than in previous years. A full discussion
                  of trust eligibility for composite returns is contained within
                  the instructions accompanying the downloadable form and can be
                  accessed by following the link below. Also, an Ernst and Young
                  opinion letter referenced in the instructions, which analyzes
                  the opportunity for trusts to participate in the Maryland
                  composite return, is available and accessible through the
                  second link below. */
}
