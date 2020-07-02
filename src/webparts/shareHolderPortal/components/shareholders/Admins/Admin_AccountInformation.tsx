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
  Paper,
  RadioGroup,
  Select,
  SnackbarContent
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Step from "@material-ui/core/Step";
import StepContent from "@material-ui/core/StepContent";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import Typography from "@material-ui/core/Typography";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import { SPComponentLoader } from "@microsoft/sp-loader";
import * as _ from "lodash";
import { sp, EmailProperties } from "@pnp/sp";
import { Web } from "@pnp/sp";
import { CurrentUser } from "@pnp/sp/src/siteusers";
import * as React from "react";
import {
  CustomCheckbox,
  CustomRadio,
  CustomTextField,
  priorityMailingMethod,
  SSOEmail,
  state_DD
} from "../../common/common";
import styles from "../shareholders.module.scss";
SPComponentLoader.loadCss(
  "https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
);
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from "@microsoft/sp-http";

export class AdminAccountInformation extends React.Component<any, any> {
  public statesDD = state_DD;
  public mailingMethod = priorityMailingMethod;
  public constructor(props: any, state: any) {
    super(props);
    this.getStockandOptions = this.getStockandOptions.bind(this);
    this.generalInfoAndDocumentAdd = this.generalInfoAndDocumentAdd.bind(this);
    this.shareholderAndTrusteeAdd = this.shareholderAndTrusteeAdd.bind(this);

    this.state = {
      activeStep: 0,
      steps: 4,

      properties: this.props.properties,
      accountDetails: [],
      allStockandOptions: [],
      shareholderStockandOptions: [],
      deligateStockandOptions: [],

      submitted: false,
      snackbar_open: false,
      snackbar_vertical: "top",
      snackbar_horizontal: "right",

      shareholdingName: this.props.properties.shareholdingName,
      shareholdingName_Error: false,
      primaryShareholdingContact: "",
      primaryShareholdingContact_Error: false,
      shareholdingEmailAddress: "",
      shareholdingEmailAddress_Error: false,
      shareholdingEmailAddress_Validate: false,
      shareholdingShortName: "",
      phone: "",
      phoneDD: "Mobile",
      phone1: "",
      phone1DD: "Mobile",
      mergerID: "",
      mergerID_Error: false,
      ownershipType: "INDIV",
      trustTypeMap:[],
      trustType: "Individual",
      trustType_Error: false,
      scorpFamily: "",
      scorpFamily_Error: false,

      documentMailingLabelAddressee1: "",
      documentMailingLabelAddressee1_Error: false,
      documentMailingLabelAddressee2: "",
      documentMailingLabelAddressee2_Error: false,
      documentMailingLabelAddressee3: "",
      documentMailingLabelAddressee3_Error: false,
      documentMailingAddressLine1: "",
      documentMailingAddressLine1_Error: false,
      documentMailingAddressLine2: "",
      documentMailingAddressLine2_Error: false,
      documentMailingCity: "",
      documentMailingCity_Error: false,
      documentMailingState: "NA",
      documentMailingState_Error: false,
      documentMailingZip: "",
      documentMailingZip_Error: false,
      documentMailingZip1: "",
      documentMailingZip1_Error: false,
      documentMailingPriorityMailingMethod: "NA",
      documentMailingPriorityMailingMethod_Error: false,

      permanentTaxAddressLine1: "",
      permanentTaxAddressLine1_Error: false,
      permanentTaxAddressLine2: "",
      permanentTaxAddressLine2_Error: false,
      permanentTaxCity: "",
      permanentTaxCity_Error: false,
      permanentTaxState: "NA",
      permanentTaxState_Error: false,
      permanentTaxZip: "",
      permanentTaxZip_Error: false,
      permanentTaxZip1: "",
      permanentTaxZip1_Error: false,
      permanentTaxPriorityMailingMethod: "NA",
      permanentTaxPriorityMailingMethod_Error: false,

      trusteeName: "",

      allPaperlessElection: false,
      pperlessOwnersReportsElection: "",
      paperlessTenderOfferElection: "",
      paperlessTaxDistributionElection: "",
      paperlessProxyElection: "",
      paperlessK1Election: "",
      primaryHouseholdMailingAccount: false,

      pperlessOwnersReportsElection_Error: false,
      paperlessTenderOfferElection_Error: false,
      paperlessTaxDistributionElection_Error: false,
      paperlessProxyElection_Error: false,
      paperlessK1Election_Error: false,

      unrestrictedShares: "",
      restrictedShares: "",
      vestedOptions: "",
      unVestedOptions: "",

      OwnershipTypes: [],
      ownershipTypeValue: "INDIV",
      ownershipTypesLink:
        this.props.properties.tenentURL + "OwnershipTypes/Allitemsg.aspx",
        trustTypeLink:
        this.props.properties.tenentURL + "TrustType/Allitemsg.aspx",

      catchException: false,

      pageContext:this.props.properties.pageContext
    };
  }

  protected sendEmail = async () => {
    console.log("stated Sed Mail");
    let newWeb = new Web(this.state.properties.tenentURL);
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
            Body: "Shareholder" +
            this.state.accountDetails.Title +
            " – " +
            this.state.shareholdingName.toString() +
            " has updated their Shareholder Account Information.  Please review changes and take appropriate actions, such as updating spreadsheets, emailing shareholder to confirm or correct, etc.<br/>" +
            "<b>Updated By:<b/>" +
            e,
            Subject: "Alert: SH Information Update: Shareholder " +
            this.state.accountDetails.Title +
            " – " +
            this.state.shareholdingName.toString() +
            " has updated their Shareholder Account Information",
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
  }


  // protected sendEmail1 = async () => {
  //   //let addressString: string = await sp.utility.getCurrentUserEmailAddresses();
  //   let newWeb = new Web(this.state.properties.tenentURL);
  //   newWeb.currentUser.get().then((r: CurrentUser) => {
  //     let e = r["Title"].toString();
  //     const emailProps: EmailProperties = {
  //       To: [SSOEmail],
  //       Subject:
  //         "Alert: SH Information Update: Shareholder " +
  //         this.state.accountDetails.Title +
  //         " – " +
  //         this.state.shareholdingName.toString() +
  //         " has updated their Shareholder Account Information",
  //       Body:
  //         "Shareholder" +
  //         this.state.accountDetails.Title +
  //         " – " +
  //         this.state.shareholdingName.toString() +
  //         "has updated their Shareholder Account Information.  Please review changes and take appropriate actions, such as updating spreadsheets, emailing shareholder to confirm or correct, etc.<br/>" +
  //         "<b>Updated By:<b/>" +
  //         e
  //     };
  //     sp.utility
  //       .sendEmail(emailProps)
  //       .then(_ => {
  //         console.log("Email Sent!");
  //       })
  //       .catch(e => {
  //         console.error(e);
  //       });
  //   });
  // }

  public componentDidMount() {
    console.log(this.props.properties.pageContext);
    if (this.props.properties !== undefined) {
      this.OwnershipType();
      this.trustType();
    }
  }

  public OwnershipType = () => {
    let newWeb = new Web(this.state.properties.tenentURL);
    newWeb.lists
      .getByTitle("Ownership Types")
      .items.select("Title", "ID", "fullName")
      .get()
      .then(d => {
        if (d.length > 0) {
          let obj = [];
          for (let index = 0; index < d.length; index++) {
            obj.push({
              key: d[index].Title,
              text: d[index].fullName
            });
          }
          this.setState(
            {
              OwnershipTypes: obj
            },
            () => {
              this.getAccountInfromation(this.state.properties.shareholderID);
            }
          );
        }
      });
  }

  public trustType = () => {
    let newWeb = new Web(this.state.properties.tenentURL);
    newWeb.lists
      .getByTitle("Trust Type")
      .items.select("Title", "ID", "fullName")
      .get()
      .then(d => {
        if (d.length > 0) {
          let obj = [];
          for (let index = 0; index < d.length; index++) {
            obj.push({
              key: d[index].Title,
              text: d[index].fullName
            });
          }
          this.setState(
            {
              trustTypeMap: obj
            }
          );
        }
      });
  }

  public getAccountInfromation(id): any {
    if (id) {
      let newWeb = new Web(this.state.properties.tenentURL);
      newWeb.lists
        .getByTitle("Shareholding Account Details")
        .items.select(
          "Id",
          "Title",
          "ComplianceAssetId",
          "shareholdingName",
          "primaryShareholdingContact",
          "shareholdingEmailAddress",
          "shareholdingShortName",
          "phone",
          "phoneType1",
          "phone1",
          "phoneType2",
          "mergerID",
          "ownershipType",
          "trustType",
          "trusteeName",
          "scorpFamily",
          "documentMailingLabelAddressee1",
          "documentMailingLabelAddressee2",
          "documentMailingLabelAddressee3",
          "documentMailingAddressLine1",
          "documentMailingAddressLine2",
          "documentMailingCity",
          "documentMailingState",
          "documentMailingZip",
          "documentMailingPriorityMailingMe",
          "permanentTaxAddressLine1",
          "permanentTaxAddressLine2",
          "permanentTaxCity",
          "permanentTaxState",
          "permanentTaxZip",
          "permanentTaxPriorityMailingMetho",
          "allPaperlessElection",
          "pperlessOwnersReportsElection",
          "paperlessTenderOfferElection",
          "paperlessTaxDistributionElection",
          "paperlessProxyElection",
          "paperlessK1Election",
          "primaryHouseholdMailingAccount",
          "ID",
          "Modified",
          "Created"
        )
        .orderBy("Title", true)
        .filter(" eq ''")
        //const filter = "Title eq " + id + " and ShareholderType eq 'Shareholder'";
        //.filter("Title eq " + id + " and ShareholderType eq 'Shareholder'")
        //.filter("Title eq " + id + " and ShareholderType eq 'Shareholder'")
        .filter("Title eq '" + id + "'")
        .get()
        .then(d => {
          if (d.length > 0) {
            let pTaxZip = d[0].permanentTaxZip.split("-");
            let dMailingZip = d[0].documentMailingZip.split("-");
            //let allPaperlessElection = (d[0].allPaperlessElection === "Yes" ? true :
            this.setState({
              accountDetails: d[0],
              Title: d[0].Title,
              shareholdingName: d[0].shareholdingName,
              primaryShareholdingContact: d[0].primaryShareholdingContact,
              shareholdingEmailAddress: d[0].shareholdingEmailAddress,
              shareholdingShortName: d[0].shareholdingShortName,
              phone: d[0].phone,
              phoneDD:
                d[0].phoneType1 !== null && d[0].phoneType1 !== ""
                  ? d[0].phoneType1
                  : "Mobile",
              phone1: d[0].phone1,
              phone1DD:
                d[0].phoneType2 !== null && d[0].phoneType2 !== ""
                  ? d[0].phoneType2
                  : "Mobile",
              mergerID: d[0].mergerID,
              ownershipTypeValue: d[0].ownershipType,
              trustType: d[0].trustType,
              scorpFamily: d[0].scorpFamily,
              documentMailingLabelAddressee1:
                d[0].documentMailingLabelAddressee1,
              documentMailingLabelAddressee2:
                d[0].documentMailingLabelAddressee2,
              documentMailingLabelAddressee3:
                d[0].documentMailingLabelAddressee3,
              documentMailingAddressLine1: d[0].documentMailingAddressLine1,
              documentMailingAddressLine2: d[0].documentMailingAddressLine2,
              documentMailingCity: d[0].documentMailingCity,
              documentMailingState: d[0].documentMailingState,
              documentMailingZip: dMailingZip[0],
              documentMailingZip1: dMailingZip[1] !== "undefined" ? dMailingZip[1] : "",
              documentMailingPriorityMailingMethod:
                d[0].documentMailingPriorityMailingMe,
              permanentTaxAddressLine1: d[0].permanentTaxAddressLine1,
              permanentTaxAddressLine2: d[0].permanentTaxAddressLine2,
              permanentTaxCity: d[0].permanentTaxCity,
              permanentTaxState: d[0].permanentTaxState,
              permanentTaxZip: pTaxZip[0],
              permanentTaxZip1: pTaxZip[1] !== "undefined" ? pTaxZip[1] : "",
              permanentTaxPriorityMailingMethod:
                d[0].permanentTaxPriorityMailingMetho,
              trusteeName: d[0].trusteeName,
              allPaperlessElection: d[0].allPaperlessElection,
              //allPaperlessElection: JSON.parse(d[0].allPaperlessElection),
              pperlessOwnersReportsElection: d[0].pperlessOwnersReportsElection,
              paperlessTenderOfferElection: d[0].paperlessTenderOfferElection,
              paperlessTaxDistributionElection:
                d[0].paperlessTaxDistributionElection,
              paperlessProxyElection: d[0].paperlessProxyElection,
              paperlessK1Election: d[0].paperlessK1Election,
              // primaryHouseholdMailingAccount: JSON.parse(
              //   d[0].primaryHouseholdMailingAccount
              primaryHouseholdMailingAccount:
                d[0].primaryHouseholdMailingAccount
            });
          }
          this.getStockandOptions(id);
        });
    }
  }

  public getStockandOptions(id): any {
    if (id) {
      let newWeb = new Web(this.state.properties.tenentURL);
      newWeb.lists
        .getByTitle("Shareholdings")
        .items.select(
          "ID",
          "Title",
          "shareholderID",
          "shares",
          "shareholderEmail",
          "unrestrictedShares",
          "restrictedShares",
          "vestedOptions",
          "ShareholderType",
          "unvestedOptions"
        )
        .orderBy("Title", true)
        .top(10)
        //.filter("shareholderID eq " + id + " and ShareholderType eq 'Shareholder'")
        .filter("shareholderID eq '" + id + "'")
        .get()
        .then(d => {
          if (d.length > 0) {
            let allStockandOptions = d;
            let shareholderStockandOptions;
            let deligateStockandOptions;
            shareholderStockandOptions = _.filter(allStockandOptions, val => {
              return val.ShareholderType === "Shareholder";
            });
            deligateStockandOptions = _.filter(allStockandOptions, val => {
              return val.ShareholderType === "Delegate";
            });
            this.setState({
              allStockandOptions: allStockandOptions,
              shareholderStockandOptions:shareholderStockandOptions,
              deligateStockandOptions:deligateStockandOptions,
              unrestrictedShares: shareholderStockandOptions[0].unrestrictedShares,
              restrictedShares: shareholderStockandOptions[0].restrictedShares,
              vestedOptions: shareholderStockandOptions[0].vestedOptions,
              unVestedOptions: shareholderStockandOptions[0].unvestedOptions
            });
          }
          console.log(this.state);
        });
    }
  }

  public postAccountInformation = () => {
    let newWeb = new Web(this.state.properties.tenentURL);
    newWeb.lists
      .getByTitle("Shareholding Account Details")
      .items.add({
        Title: this.state.properties.shareholderID,
        shareholdingName: this.state.shareholdingName,
        primaryShareholdingContact: this.state.primaryShareholdingContact.toString(),
        shareholdingEmailAddress: this.state.shareholdingEmailAddress.toString(),
        shareholdingShortName: this.state.shareholdingShortName,
        phone: this.state.phone,
        phoneType1: this.state.phoneDD,
        phone1: this.state.phone1,
        phoneType2: this.state.phone1DD,
        mergerID: this.state.mergerID,
        ownershipType: this.state.ownershipTypeValue,
        trustType: this.state.trustType,
        scorpFamily: this.state.scorpFamily,
        documentMailingLabelAddressee1: this.state.documentMailingLabelAddressee1.toString(),
        documentMailingLabelAddressee2:
          this.state.documentMailingLabelAddressee2 !== ""
            ? this.state.documentMailingLabelAddressee2
            : null,
        documentMailingLabelAddressee3:
          this.state.documentMailingLabelAddressee3 !== ""
            ? this.state.documentMailingLabelAddressee3
            : null,
        documentMailingAddressLine1: this.state.documentMailingAddressLine1.toString(),
        documentMailingAddressLine2:
          this.state.documentMailingAddressLine2 !== ""
            ? this.state.documentMailingAddressLine2
            : null,
        documentMailingCity: this.state.documentMailingCity.toString(),
        documentMailingState: this.state.documentMailingState.toString(),
        documentMailingZip:
          this.state.documentMailingZip +
          "-" +
          this.state.documentMailingZip1,
        documentMailingPriorityMailingMe: this.state.documentMailingPriorityMailingMethod.toString(),
        permanentTaxAddressLine1: this.state.permanentTaxAddressLine1.toString(),
        permanentTaxAddressLine2:
          this.state.permanentTaxAddressLine2 !== ""
            ? this.state.permanentTaxAddressLine2
            : null,
        permanentTaxCity: this.state.permanentTaxCity.toString(),
        permanentTaxState: this.state.permanentTaxState.toString(),
        permanentTaxZip:
          this.state.permanentTaxZip +
          "-" +
          this.state.permanentTaxZip1,
        permanentTaxPriorityMailingMetho: this.state.permanentTaxPriorityMailingMethod.toString(),
        trusteeName: this.state.trusteeName,
        allPaperlessElection: this.state.allPaperlessElection.toString(),
        pperlessOwnersReportsElection: this.state.pperlessOwnersReportsElection.toString(),
        paperlessTenderOfferElection: this.state.paperlessTenderOfferElection.toString(),
        paperlessTaxDistributionElection: this.state.paperlessTaxDistributionElection.toString(),
        paperlessProxyElection: this.state.paperlessProxyElection.toString(),
        paperlessK1Election: this.state.paperlessK1Election.toString(),
        primaryHouseholdMailingAccount: this.state.primaryHouseholdMailingAccount.toString()
      })
      .then(i => {
        console.log(i);
        window.scrollTo(0, 0);
      })
      .catch(e => {
        console.log(e);
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

  public updateAccountInformation = () => {
    let newWeb = new Web(this.state.properties.tenentURL);
    newWeb.lists
      .getByTitle("Shareholding Account Details")
      .items.getById(this.state.accountDetails.ID)
      .update({
        Title: this.state.properties.shareholderID,
        shareholdingName: this.state.shareholdingName.toString(),
        primaryShareholdingContact: this.state.primaryShareholdingContact.toString(),
        shareholdingEmailAddress: this.state.shareholdingEmailAddress.toString(),
        shareholdingShortName: this.state.shareholdingShortName,
        phone: this.state.phone,
        phoneType1: this.state.phoneDD,
        phone1: this.state.phone1,
        phoneType2: this.state.phone1DD,
        mergerID: this.state.mergerID,
        ownershipType: this.state.ownershipTypeValue,
        trustType: this.state.trustType,
        scorpFamily: this.state.scorpFamily,
        documentMailingLabelAddressee1: this.state.documentMailingLabelAddressee1.toString(),
        documentMailingLabelAddressee2: this.state
          .documentMailingLabelAddressee2,
        documentMailingLabelAddressee3: this.state
          .documentMailingLabelAddressee3,
        documentMailingAddressLine1: this.state.documentMailingAddressLine1.toString(),
        documentMailingAddressLine2: this.state.documentMailingAddressLine2,
        documentMailingCity: this.state.documentMailingCity.toString(),
        documentMailingState: this.state.documentMailingState.toString(),
        documentMailingZip:
          this.state.documentMailingZip.toString() +
          "-" +
          this.state.documentMailingZip1,
        //(this.state.documentMailingZip1 !== undefined) ? this.state.documentMailingZip1.toString() : "",
        documentMailingPriorityMailingMe: this.state.documentMailingPriorityMailingMethod.toString(),
        permanentTaxAddressLine1: this.state.permanentTaxAddressLine1.toString(),
        permanentTaxAddressLine2: this.state.permanentTaxAddressLine2,
        ///  !== "" ?this.state.permanentTaxAddressLine2.toString() : null,
        permanentTaxCity: this.state.permanentTaxCity.toString(),
        permanentTaxState: this.state.permanentTaxState.toString(),
        permanentTaxZip:
          this.state.permanentTaxZip.toString() +
          "-" +
          this.state.permanentTaxZip1,
        //(this.state.permanentTaxZip1 !== undefined) ? this.state.permanentTaxZip1.toString() : "",
        permanentTaxPriorityMailingMetho: this.state.permanentTaxPriorityMailingMethod.toString(),
        trusteeName:
          this.state.trusteeName !== undefined
            ? this.state.trusteeName
            : null,
        allPaperlessElection: this.state.allPaperlessElection.toString(),
        pperlessOwnersReportsElection: this.state.pperlessOwnersReportsElection.toString(),
        paperlessTenderOfferElection: this.state.paperlessTenderOfferElection.toString(),
        paperlessTaxDistributionElection: this.state.paperlessTaxDistributionElection.toString(),
        paperlessProxyElection: this.state.paperlessProxyElection.toString(),
        paperlessK1Election: this.state.paperlessK1Election.toString(),
        primaryHouseholdMailingAccount: this.state.primaryHouseholdMailingAccount.toString()
      })
      .then(i => {
        console.log(i);
      })
      .catch(e => {
        console.log(e);
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

  public updateStockandOptions = () => {
    for (let index = 0; index < this.state.allStockandOptions.length; index++) {
      let ID = this.state.allStockandOptions[index].ID;
      let newWeb = new Web(this.state.properties.tenentURL);
      newWeb.lists
        .getByTitle("Shareholdings")
        .items.getById(ID)
        .update({
          unrestrictedShares: this.state.unrestrictedShares,
          restrictedShares: this.state.restrictedShares,
          vestedOptions: this.state.vestedOptions,
          unvestedOptions: this.state.unVestedOptions
        })
        .then(i => {
          console.log(i);
        })
        .catch(e => {
          console.log(e);
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
    this.setState({ snackbar_open: true, activeStep: 0 });
    window.scrollTo(0, 0);
    this.sendEmail();
    // let newWeb = new Web(this.state.properties.tenentURL);
    // newWeb.lists
    //   .getByTitle("Shareholdings")
    //   .items.getById(this.state.stockandOptions.ID)
    //   .update({
    //     unrestrictedShares: this.state.unrestrictedShares,
    //     restrictedShares: this.state.restrictedShares,
    //     vestedOptions: this.state.vestedOptions,
    //     unvestedOptions: this.state.unVestedOptions
    //   })
    //   .then(i => {
    //     this.setState({ snackbar_open: true, activeStep: 0 });
    //     console.log(i);
    //     window.scrollTo(0, 0);
    //     this.sendEmail();
    //   })
    //   .catch(e => {
    //     console.log(e);
    //     this.setState(
    //       {
    //         catchException: true
    //       },
    //       () => {
    //         setTimeout(() => {
    //           this.setState({ catchException: false });
    //         }, 5000);
    //       }
    //     );
    //   });
  }

  public generalInfoAndDocumentAdd = e => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let error = {
      shareholdingName_Error: this.state.shareholdingName_Error,
      primaryShareholdingContact_Error: this.state
        .primaryShareholdingContact_Error,
      shareholdingEmailAddress_Error: this.state.shareholdingEmailAddress_Error,
      //mergerID_Error: this.state.mergerID_Error,
      trustType_Error: this.state.trustType_Error,
      scorpFamily_Error: this.state.scorpFamily_Error,
      documentMailingLabelAddressee1_Error: this.state
        .documentMailingLabelAddressee1_Error,
      documentMailingAddressLine1_Error: this.state
        .documentMailingAddressLine1_Error,
      documentMailingCity_Error: this.state.documentMailingCity_Error,
      documentMailingState_Error: this.state.documentMailingState_Error,
      documentMailingZip_Error: this.state.documentMailingZip_Error,
      documentMailingPriorityMailingMethod_Error: this.state
        .documentMailingPriorityMailingMethod_Error
    };

    if (this.state.shareholdingName === "") {
      this.setState({ shareholdingName_Error: true });
      error.shareholdingName_Error = true;
    } else {
      error.shareholdingName_Error = false;
    }

    if (this.state.primaryShareholdingContact === "") {
      this.setState({ primaryShareholdingContact_Error: true });
      error.primaryShareholdingContact_Error = true;
    } else {
      error.primaryShareholdingContact_Error = false;
    }
    if (this.state.shareholdingEmailAddress === "") {
      this.setState({ shareholdingEmailAddress_Error: true });
      error.shareholdingEmailAddress_Error = true;
    } else {
      if (!re.test(this.state.shareholdingEmailAddress)) {
        error.shareholdingEmailAddress_Error = true;
        this.setState({
          shareholdingEmailAddress_Validate: true
        });
      } else {
        error.shareholdingEmailAddress_Error = false;
        this.setState({
          shareholdingEmailAddress_Error: false,
          shareholdingEmailAddress_Validate: false
        });
      }
    }
    // if (this.state.mergerID === "") {
    //   this.setState({ mergerID_Error: true });
    //   error.mergerID_Error = true;
    // } else {
    //   error.mergerID_Error = false;
    // }
    if (this.state.trustType === "") {
      this.setState({ trustType_Error: true });
      error.trustType_Error = true;
    } else {
      error.trustType_Error = false;
    }
    if (this.state.scorpFamily === "") {
      this.setState({ scorpFamily_Error: true });
      error.scorpFamily_Error = true;
    } else {
      error.scorpFamily_Error = false;
    }
    if (this.state.documentMailingLabelAddressee1 === "") {
      this.setState({ documentMailingLabelAddressee1_Error: true });
      error.documentMailingLabelAddressee1_Error = true;
    } else {
      error.documentMailingLabelAddressee1_Error = false;
    }
    if (this.state.documentMailingAddressLine1 === "") {
      this.setState({ documentMailingAddressLine1_Error: true });
      error.documentMailingAddressLine1_Error = true;
    } else {
      error.documentMailingAddressLine1_Error = false;
    }

    if (this.state.documentMailingCity === "") {
      this.setState({ documentMailingCity_Error: true });
      error.documentMailingCity_Error = true;
    } else {
      error.documentMailingCity_Error = false;
    }
    if (this.state.documentMailingState === "NA") {
      this.setState({ documentMailingState_Error: true });
      error.documentMailingState_Error = true;
    } else {
      error.documentMailingState_Error = false;
    }

    if (this.state.documentMailingZip === "") {
      this.setState({ documentMailingZip_Error: true });
      error.documentMailingZip_Error = true;
    } else {
      error.documentMailingZip_Error = false;
    }
    if (this.state.documentMailingPriorityMailingMethod === "NA") {
      this.setState({
        documentMailingPriorityMailingMethod_Error: true
      });
      error.documentMailingPriorityMailingMethod_Error = true;
    } else {
      error.documentMailingPriorityMailingMethod_Error = false;
    }

    const identifiers = Object.keys(error);
    const activeError = identifiers.filter(id => {
      return error[id];
    });
    if (activeError.length === 0) {
      this.handleNextStep();
    }
  }

  public shareholderAndTrusteeAdd = e => {
    let error = {
      permanentTaxAddressLine1_Error: this.state.permanentTaxAddressLine1_Error,
      permanentTaxCity_Error: this.state.permanentTaxCity_Error,
      permanentTaxState_Error: this.state.permanentTaxState_Error,
      permanentTaxZip_Error: this.state.permanentTaxZip_Error,
      phone1_Error: this.state.phone1_Error,
      permanentTaxPriorityMailingMethod_Error: this.state
        .permanentTaxPriorityMailingMethod_Error,

      pperlessOwnersReportsElection_Error: this.state
        .pperlessOwnersReportsElection_Error,
      paperlessTenderOfferElection_Error: this.state
        .paperlessTenderOfferElection_Error,
      paperlessTaxDistributionElection_Error: this.state
        .paperlessTaxDistributionElection_Error,
      paperlessProxyElection_Error: this.state.paperlessProxyElection_Error,
      paperlessK1Election_Error: this.state.paperlessK1Election_Error
    };

    if (this.state.permanentTaxAddressLine1 === "") {
      this.setState({ permanentTaxAddressLine1_Error: true });
      error.permanentTaxAddressLine1_Error = true;
    } else {
      error.permanentTaxAddressLine1_Error = false;
    }

    if (this.state.permanentTaxCity === "") {
      this.setState({ permanentTaxCity_Error: true });
      error.permanentTaxCity_Error = true;
    } else {
      error.permanentTaxCity_Error = false;
    }
    if (this.state.permanentTaxState === "NA") {
      this.setState({ permanentTaxState_Error: true });
      error.permanentTaxState_Error = true;
    } else {
      error.permanentTaxState_Error = false;
    }
    if (this.state.permanentTaxZip === "") {
      this.setState({ permanentTaxZip_Error: true });
      error.permanentTaxZip_Error = true;
    } else {
      error.permanentTaxZip_Error = false;
    }
    if (this.state.permanentTaxPriorityMailingMethod === "NA") {
      this.setState({ permanentTaxPriorityMailingMethod_Error: true });
      error.permanentTaxPriorityMailingMethod_Error = true;
    } else {
      error.permanentTaxPriorityMailingMethod_Error = false;
    }
    if (this.state.pperlessOwnersReportsElection === "") {
      this.setState({ pperlessOwnersReportsElection_Error: true });
      error.pperlessOwnersReportsElection_Error = true;
    } else {
      error.pperlessOwnersReportsElection_Error = false;
    }
    if (this.state.paperlessTenderOfferElection === "") {
      this.setState({ paperlessTenderOfferElection_Error: true });
      error.paperlessTenderOfferElection_Error = true;
    } else {
      error.paperlessTenderOfferElection_Error = false;
    }
    if (this.state.paperlessTaxDistributionElection === "") {
      this.setState({ paperlessTaxDistributionElection_Error: true });
      error.paperlessTaxDistributionElection_Error = true;
    } else {
      error.paperlessTaxDistributionElection_Error = false;
    }
    if (this.state.paperlessProxyElection === "") {
      this.setState({ paperlessProxyElection_Error: true });
      error.paperlessProxyElection_Error = true;
    } else {
      error.paperlessProxyElection_Error = false;
    }
    if (this.state.paperlessK1Election === "") {
      this.setState({ paperlessK1Election_Error: true });
      error.paperlessK1Election_Error = true;
    } else {
      error.paperlessK1Election_Error = false;
    }
    const identifiers = Object.keys(error);
    const activeError = identifiers.filter(id => {
      return error[id];
    });
    if (activeError.length === 0) {
      this.handleNextStep();
    }
  }

  public handleNextStep = () => {
    this.setState({
      activeStep: this.state.activeStep + 1
    });
  }

  public validateStockandOptions = e => {
    let event = e.target.value;
    const regx = /^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)$/g;
    let targetName = e.target.name;
    if (regx.test(event)) {
      switch (targetName) {
        case "unrestrictedShares":
          this.setState({
            unrestrictedShares: event
          });
          break;
        case "restrictedShares":
          this.setState({
            restrictedShares: event
          });
          break;
        case "vestedOptions":
          this.setState({
            vestedOptions: event
          });
          break;
        case "unVestedOptions":
          this.setState({
            unVestedOptions: event
          });
          break;
      }
    }
  }

  public handleBackStep = () => {
    this.setState({ activeStep: this.state.activeStep - 1 });
  }

  public submitAccountInfo = event => {
    if (this.state.accountDetails.length === 0) {
      this.postAccountInformation();
    } else {
      this.updateAccountInformation();
    }
    this.updateStockandOptions();
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

  public generalInformation = () => {
    let _html = (
      <React.Fragment>
        <div className="card">
          <div className={`card-body`}>
            <div className={`${styles.cardHead_General} card-header`}>
              <h6>General Information</h6>
            </div>
            <div className="row-fluid">
              <div className="col-md-12">
                <FormControl fullWidth style={{ margin: "10px" }}>
                  <CustomTextField
                    label="Shareholding Name"
                    onChange={e => {
                      if (e.target.value === "") {
                        this.setState({
                          shareholdingName: e.target.value,
                          shareholdingName_Error: true
                        });
                      } else {
                        this.setState({
                          shareholdingName: e.target.value,
                          shareholdingName_Error: false
                        });
                      }
                    }}
                    helperText={
                      this.state.shareholdingName_Error === true
                        ? "Shareholding Name Cannot be Empty"
                        : null
                    }
                    error={this.state.shareholdingName_Error}
                    name="shareholdingName"
                    value={this.state.shareholdingName}
                  />
                </FormControl>
                <FormControl fullWidth style={{ margin: "10px" }}>
                  <CustomTextField
                    label="Primary Shareholding Contact*"
                    onChange={e => {
                      if (e.target.value === "") {
                        this.setState({
                          primaryShareholdingContact: e.target.value,
                          primaryShareholdingContact_Error: true
                        });
                      } else {
                        this.setState({
                          primaryShareholdingContact: e.target.value,
                          primaryShareholdingContact_Error: false
                        });
                      }
                    }}
                    helperText={
                      this.state.primaryShareholdingContact_Error === true
                        ? "Primary Shareholding Contact Cannot be Empty"
                        : null
                    }
                    error={this.state.primaryShareholdingContact_Error}
                    name="primaryShareholdingContact"
                    value={this.state.primaryShareholdingContact}
                  />
                </FormControl>
                <FormControl fullWidth style={{ margin: "10px" }}>
                  <CustomTextField
                    label="Shareholding Email Address*"
                    onChange={e => {
                      if (e.target.value === "") {
                        this.setState({
                          shareholdingEmailAddress: e.target.value,
                          shareholdingEmailAddress_Error: true
                        });
                      } else {
                        this.setState({
                          shareholdingEmailAddress: e.target.value,
                          shareholdingEmailAddress_Error: false
                        });
                      }
                    }}
                    helperText={
                      this.state.shareholdingEmailAddress_Error === true
                        ? "Shareholding Email Address Cannot be Empty"
                        : this.state.shareholdingEmailAddress_Validate === true
                        ? "Please Enter Valid Email Address "
                        : null
                    }
                    error={
                      this.state.shareholdingEmailAddress_Error === true ||
                      this.state.shareholdingEmailAddress_Validate === true
                    }
                    name="shareholdingEmailAddress"
                    value={this.state.shareholdingEmailAddress}
                  />
                </FormControl>
                <FormControl fullWidth style={{ margin: "10px" }}>
                  <CustomTextField
                    label="Shareholding Short Name"
                    onChange={e => {
                      this.setState({
                        shareholdingShortName: e.target.value
                      });
                    }}
                    name="shareholdingShortName"
                    value={this.state.shareholdingShortName}
                  />
                </FormControl>
                <FormControl fullWidth style={{ margin: "10px" }}>
                  <div className="row">
                    <div className="col-sm-6">
                      <CustomTextField
                        fullWidth
                        label="Phone 1"
                        onChange={e => {
                          let x = e.target.value
                            .replace(/\D/g, "")
                            .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
                          e.target.value = !x[2]
                            ? x[1]
                            : "(" +
                              x[1] +
                              ") " +
                              x[2] +
                              (x[3] ? "-" + x[3] : "");
                          this.setState({
                            phone: e.target.value
                          });
                        }}
                        value={this.state.phone}
                      />
                    </div>
                    <div className="col-sm-6">
                      <Select
                        fullWidth
                        name="phoneType"
                        style={{ marginTop: "16px" }}
                        value={this.state.phoneDD}
                        onChange={e => {
                          this.setState({
                            phoneDD: e.target.value
                          });
                        }}
                      >
                        <MenuItem value="Home">Home</MenuItem>
                        <MenuItem value="Mobile">Mobile</MenuItem>
                        <MenuItem value="Work">Work</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </div>
                  </div>
                </FormControl>
                <FormControl fullWidth style={{ margin: "10px" }}>
                  <div className="row">
                    <div className="col-sm-6">
                      <CustomTextField
                        fullWidth
                        label="Phone 2"
                        onChange={e => {
                          let x = e.target.value
                            .replace(/\D/g, "")
                            .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
                          e.target.value = !x[2]
                            ? x[1]
                            : "(" +
                              x[1] +
                              ") " +
                              x[2] +
                              (x[3] ? "-" + x[3] : "");
                          this.setState({
                            phone1: e.target.value,
                            phone1_Error: false
                          });
                        }}
                        name="phone1"
                        value={this.state.phone1}
                      />
                    </div>
                    <div className="col-sm-6">
                      <Select
                        fullWidth
                        name="phoneType1"
                        style={{ marginTop: "16px" }}
                        value={this.state.phone1DD}
                        onChange={e => {
                          this.setState({
                            phone1DD: e.target.value
                          });
                        }}
                      >
                        <MenuItem value="Home">Home</MenuItem>
                        <MenuItem value="Mobile">Mobile</MenuItem>
                        <MenuItem value="Work">Work</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </div>
                  </div>
                </FormControl>
                <FormControl fullWidth style={{ margin: "10px" }}>
                  <CustomTextField
                    label="Merger ID"
                    onChange={e => {
                      this.setState({
                        mergerID: e.target.value
                      });
                    }}
                    name="mergerID"
                    value={this.state.mergerID}
                  />
                </FormControl>
                <FormControl fullWidth style={{ margin: "10px" }}>
                  <div className="row">
                    <div className="col-sm-11">
                      <InputLabel
                        style={{
                          marginLeft: "15px",
                          color: "#275458"
                        }}
                      >
                        Ownership Type{" "}
                      </InputLabel>
                      <Select
                        name="ownershipTypeValue"
                        value={this.state.ownershipTypeValue}
                        onChange={e => {
                          this.setState({
                            ownershipTypeValue: e.target.value
                          });
                        }}
                        fullWidth
                      >
                        {this.state.OwnershipTypes.map((item, i) => {
                          return (
                            <MenuItem key={i} value={item.key}>
                              {item.text}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </div>
                    <div
                      className="col-sm-1 align-self-end"
                      style={{ marginBottom: "10px" }}
                    >
                       <a
                        onClick={() => {
                          window.open(this.state.ownershipTypesLink);
                          return false;
                        }}
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
                </FormControl>
                <FormControl fullWidth style={{ margin: "10px" }}>
                  <div className="row">
                    <div className="col-sm-11">
                      <InputLabel
                        style={{
                          marginLeft: "15px",
                          color: "#275458"
                        }}
                      >
                        Trust Type{" "}
                      </InputLabel>
                      <Select
                        name="trustType"
                        value={this.state.trustType}
                        onChange={e => {
                          this.setState({
                            trustType: e.target.value
                          });
                        }}
                        fullWidth
                      >
                        {this.state.trustTypeMap.map((item, i) => {
                          return (
                            <MenuItem key={i} value={item.key}>
                              {item.text}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </div>
                    <div
                      className="col-sm-1 align-self-end"
                      style={{ marginBottom: "10px" }}
                    >
                      <a
                        onClick={() => {
                          window.open(this.state.trustTypeLink);
                          return false;
                        }}
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
                </FormControl>
                {/* <FormControl fullWidth style={{ margin: "10px" }}>
                  <CustomTextField
                    label="Trust Type*"
                    onChange={e => {
                      if (e.target.value === "") {
                        this.setState({
                          trustType: e.target.value,
                          trustType_Error: true
                        });
                      } else {
                        this.setState({
                          trustType: e.target.value,
                          trustType_Error: false
                        });
                      }
                    }}
                    helperText={
                      this.state.trustType_Error === true
                        ? "Trust Type Cannot be Empty"
                        : null
                    }
                    name="scorpFamily"
                    error={this.state.trustType_Error}
                    value={this.state.trustType}
                  />
                </FormControl> */}
                <FormControl fullWidth style={{ margin: "10px" }}>
                  <CustomTextField
                    label="S-Corp Family*"
                    onChange={e => {
                      if (e.target.value === "") {
                        this.setState({
                          scorpFamily: e.target.value,
                          scorpFamily_Error: true
                        });
                      } else {
                        this.setState({
                          scorpFamily: e.target.value,
                          scorpFamily_Error: false
                        });
                      }
                    }}
                    helperText={
                      this.state.scorpFamily_Error === true
                        ? "S-Corp Family Cannot be Empty"
                        : null
                    }
                    error={this.state.scorpFamily_Error}
                    name="scorpFamily"
                    value={this.state.scorpFamily}
                  />
                </FormControl>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
    return _html;
  }

  public documentMailingAddress = () => {
    let _html = (
      <React.Fragment>
        {" "}
        <div className="card">
          <div className={`card-body`}>
            <div className={`${styles.cardHead_General} card-header`}>
              <h6>Document Mailing Address</h6>
            </div>
            <div className="row-fluid">
              <div className="col-md-12">
                <FormControl fullWidth style={{ margin: "10px" }}>
                  <CustomTextField
                    label="Document Mailing Label Addressee 1*"
                    onChange={e => {
                      if (e.target.value === "") {
                        this.setState({
                          documentMailingLabelAddressee1: e.target.value,
                          documentMailingLabelAddressee1_Error: true
                        });
                      } else {
                        this.setState({
                          documentMailingLabelAddressee1: e.target.value,
                          documentMailingLabelAddressee1_Error: false
                        });
                      }
                    }}
                    helperText={
                      this.state.documentMailingLabelAddressee1_Error === true
                        ? "Document Mailing Label Addressee 1 Cannot be Empty"
                        : null
                    }
                    error={this.state.documentMailingLabelAddressee1_Error}
                    name="documentMailingLabelAddressee1"
                    value={this.state.documentMailingLabelAddressee1}
                  />
                </FormControl>
                <FormControl fullWidth style={{ margin: "10px" }}>
                  <CustomTextField
                    label="Document Mailing Label Addressee 2"
                    onChange={e => {
                      if (e.target.value === "") {
                        this.setState({
                          documentMailingLabelAddressee2: e.target.value,
                          documentMailingLabelAddressee2_Error: false
                        });
                      } else {
                        this.setState({
                          documentMailingLabelAddressee2: e.target.value,
                          documentMailingLabelAddressee2_Error: false
                        });
                      }
                    }}
                    helperText={
                      this.state.documentMailingLabelAddressee2_Error === true
                        ? "Document Mailing Label Addressee 2 Cannot be Empty"
                        : null
                    }
                    error={this.state.documentMailingLabelAddressee2_Error}
                    name="documentMailingLabelAddressee2"
                    value={this.state.documentMailingLabelAddressee2}
                  />
                </FormControl>
                <FormControl fullWidth style={{ margin: "10px" }}>
                  <CustomTextField
                    label="Document Mailing Label Addressee 3"
                    onChange={e => {
                      if (e.target.value === "") {
                        this.setState({
                          documentMailingLabelAddressee3: e.target.value,
                          documentMailingLabelAddressee3_Error: false
                        });
                      } else {
                        this.setState({
                          documentMailingLabelAddressee3: e.target.value,
                          documentMailingLabelAddressee3_Error: false
                        });
                      }
                    }}
                    helperText={
                      this.state.documentMailingLabelAddressee3_Error === true
                        ? "Document Mailing Label Addressee 3 Cannot be Empty"
                        : null
                    }
                    error={this.state.documentMailingLabelAddressee3_Error}
                    name="documentMailingLabelAddressee3"
                    value={this.state.documentMailingLabelAddressee3}
                  />
                </FormControl>
                <FormControl fullWidth style={{ margin: "10px" }}>
                  <CustomTextField
                    label="Document Mailing Address Line 1*"
                    onChange={e => {
                      if (e.target.value === "") {
                        this.setState({
                          documentMailingAddressLine1: e.target.value,
                          documentMailingAddressLine1_Error: true
                        });
                      } else {
                        this.setState({
                          documentMailingAddressLine1: e.target.value,
                          documentMailingAddressLine1_Error: false
                        });
                      }
                    }}
                    helperText={
                      this.state.documentMailingAddressLine1_Error === true
                        ? "Document Mailing Address Line 1 Cannot be Empty"
                        : null
                    }
                    error={this.state.documentMailingAddressLine1_Error}
                    name="documentMailingAddressLine1"
                    value={this.state.documentMailingAddressLine1}
                  />
                </FormControl>
                <FormControl fullWidth style={{ margin: "10px" }}>
                  <CustomTextField
                    label="Document Mailing Address Line 2"
                    onChange={e => {
                      if (e.target.value === "") {
                        this.setState({
                          documentMailingAddressLine2: e.target.value,
                          documentMailingAddressLine2_Error: false
                        });
                      } else {
                        this.setState({
                          documentMailingAddressLine2: e.target.value,
                          documentMailingAddressLine2_Error: false
                        });
                      }
                    }}
                    helperText={
                      this.state.documentMailingAddressLine2_Error === true
                        ? "Document Mailing Address Line 2 Cannot be Empty"
                        : null
                    }
                    error={this.state.documentMailingAddressLine2_Error}
                    name="documentMailingAddressLine2"
                    value={this.state.documentMailingAddressLine2}
                  />
                </FormControl>
                <FormControl fullWidth style={{ margin: "10px" }}>
                  <CustomTextField
                    label="Document Mailing City*"
                    onChange={e => {
                      if (e.target.value === "") {
                        this.setState({
                          documentMailingCity: e.target.value,
                          documentMailingCity_Error: true
                        });
                      } else {
                        this.setState({
                          documentMailingCity: e.target.value,
                          documentMailingCity_Error: false
                        });
                      }
                    }}
                    helperText={
                      this.state.documentMailingCity_Error === true
                        ? "Document Mailing City Cannot be Empty"
                        : null
                    }
                    error={this.state.documentMailingCity_Error}
                    name="documentMailingCity"
                    value={this.state.documentMailingCity}
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  style={{ margin: "10px" }}
                  error={this.state.documentMailingState_Error}
                >
                  <InputLabel style={{ color: "#275458" }}>
                    Document Mailing State*
                  </InputLabel>
                  <Select
                    name="documentMailingState"
                    defaultValue={{
                      key: "NA",
                      text: "-- Please Select State --"
                    }}
                    onChange={event => {
                      if (event.target.value === "NA") {
                        this.setState({
                          documentMailingState: event.target.value,
                          documentMailingState_Error: true
                        });
                      } else {
                        this.setState({
                          documentMailingState: event.target.value,
                          documentMailingState_Error: false
                        });
                      }
                    }}
                    value={this.state.documentMailingState}
                  >
                    {this.statesDD.map((item, i) => {
                      return (
                        <MenuItem key={i} value={item.key}>
                          {item.text}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {this.state.documentMailingState_Error !== false ? (
                    <FormHelperText>State Cannot be Empty</FormHelperText>
                  ) : (
                    false
                  )}
                </FormControl>
                <FormControl fullWidth style={{ margin: "10px" }}>
                  <div className="row">
                    <div className="col-sm-6">
                      <CustomTextField
                        fullWidth
                        label="Document Mailing Zip*"
                        onChange={e => {
                          if (e.target.value === "") {
                            this.setState({
                              documentMailingZip: e.target.value,
                              documentMailingZip_Error: true
                            });
                          } else {
                            const re = /^[0-9\b]+$/;
                            if (
                              e.target.value === "" ||
                              re.test(e.target.value)
                            ) {
                              if (e.target.value.length <= 5) {
                                this.setState({
                                  documentMailingZip: e.target.value,
                                  documentMailingZip_Error: false
                                });
                              }
                            }
                          }
                        }}
                        helperText={
                          this.state.documentMailingZip_Error === true
                            ? "Document Mailing Zip Cannot be Empty"
                            : null
                        }
                        error={this.state.documentMailingZip_Error}
                        name="documentMailingZip"
                        value={this.state.documentMailingZip}
                      />
                    </div>
                    <div className="col-sm-6">
                      <CustomTextField
                        style={{ marginTop: "16px" }}
                        fullWidth
                        onChange={e => {
                          if (e.target.value === "") {
                            this.setState({
                              documentMailingZip1: e.target.value,
                              documentMailingZip1_Error: true
                            });
                          } else {
                            const re = /^[0-9\b]+$/;
                            if (
                              e.target.value === "" ||
                              re.test(e.target.value)
                            ) {
                              if (e.target.value.length <= 4) {
                                this.setState({
                                  documentMailingZip1: e.target.value,
                                  documentMailingZip1_Error: false
                                });
                              }
                            }
                          }
                        }}
                        helperText={
                          this.state.documentMailingZip1_Error === true
                            ? "Document Mailing Zip Cannot be Empty"
                            : null
                        }
                        error={this.state.documentMailingZip1_Error}
                        name="documentMailingZip1"
                        value={this.state.documentMailingZip1}
                      />
                    </div>
                  </div>
                </FormControl>
                <FormControl
                  fullWidth
                  style={{ margin: "10px" }}
                  error={this.state.documentMailingPriorityMailingMethod_Error}
                >
                  <InputLabel style={{ color: "#275458" }}>
                    Document Mailing Priority Mailing Method*
                  </InputLabel>
                  <Select
                    name="documentMailingPriorityMailingMethod"
                    defaultValue={{
                      key: "NA",
                      text: "-- Please Select Maliling Method --"
                    }}
                    onChange={event => {
                      if (event.target.value === "NA") {
                        this.setState({
                          documentMailingPriorityMailingMethod:
                            event.target.value,
                          documentMailingPriorityMailingMethod_Error: true
                        });
                      } else {
                        this.setState({
                          documentMailingPriorityMailingMethod:
                            event.target.value,
                          documentMailingPriorityMailingMethod_Error: false
                        });
                      }
                    }}
                    value={this.state.documentMailingPriorityMailingMethod}
                  >
                    {this.mailingMethod.map((item, i) => {
                      return (
                        <MenuItem key={i} value={item.key}>
                          {item.text}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {this.state.documentMailingPriorityMailingMethod_Error !==
                  false ? (
                    <FormHelperText>
                      Mailing Method Cannot be Empty
                    </FormHelperText>
                  ) : (
                    false
                  )}
                </FormControl>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
    return _html;
  }

  public shareholderAddressTrustee = () => {
    let _html = (
      <React.Fragment>
        {" "}
        <div className="card">
          <div className={`card-body`}>
            <div className={`${styles.container_shareholder} card-header`}>
              <h6>Shareholder Address</h6>
            </div>
            <div className="row-fluid">
              <div className="col-md-12">
                <FormControl fullWidth style={{ margin: "10px" }}>
                  <CustomTextField
                    label="Permanent Tax Address Line1*"
                    onChange={e => {
                      if (e.target.value === "") {
                        this.setState({
                          permanentTaxAddressLine1: e.target.value,
                          permanentTaxAddressLine1_Error: true
                        });
                      } else {
                        this.setState({
                          permanentTaxAddressLine1: e.target.value,
                          permanentTaxAddressLine1_Error: false
                        });
                      }
                    }}
                    helperText={
                      this.state.permanentTaxAddressLine1_Error === true
                        ? "Permanent Tax Address Line1 Cannot be Empty"
                        : null
                    }
                    error={this.state.permanentTaxAddressLine1_Error}
                    name="permanentTaxAddressLine1"
                    value={this.state.permanentTaxAddressLine1}
                  />
                </FormControl>
                <FormControl fullWidth style={{ margin: "10px" }}>
                  <CustomTextField
                    label="Permanent Tax Address Line2"
                    onChange={e => {
                      if (e.target.value === "") {
                        this.setState({
                          permanentTaxAddressLine2: e.target.value,
                          permanentTaxAddressLine2_Error: false
                        });
                      } else {
                        this.setState({
                          permanentTaxAddressLine2: e.target.value,
                          permanentTaxAddressLine2_Error: false
                        });
                      }
                    }}
                    helperText={
                      this.state.permanentTaxAddressLine2_Error === true
                        ? "Permanent Tax Address Line2 Cannot be Empty"
                        : null
                    }
                    error={this.state.permanentTaxAddressLine2_Error}
                    name="permanentTaxAddressLine2"
                    value={this.state.permanentTaxAddressLine2}
                  />
                </FormControl>
                <FormControl fullWidth style={{ margin: "10px" }}>
                  <CustomTextField
                    label="Permanent Tax City*"
                    onChange={e => {
                      if (e.target.value === "") {
                        this.setState({
                          permanentTaxCity: e.target.value,
                          permanentTaxCity_Error: true
                        });
                      } else {
                        this.setState({
                          permanentTaxCity: e.target.value,
                          permanentTaxCity_Error: false
                        });
                      }
                    }}
                    helperText={
                      this.state.permanentTaxCity_Error === true
                        ? "Permanent Tax City Cannot be Empty"
                        : null
                    }
                    error={this.state.permanentTaxCity_Error}
                    name="permanentTaxCity"
                    value={this.state.permanentTaxCity}
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  style={{ margin: "10px" }}
                  error={this.state.permanentTaxState_Error}
                >
                  <InputLabel style={{ color: "#275458" }}>
                    Permanent Tax State*
                  </InputLabel>
                  <Select
                    name="permanentTaxState"
                    defaultValue={{
                      key: "NA",
                      text: "-- Please Select State --"
                    }}
                    onChange={event => {
                      if (event.target.value === "NA") {
                        this.setState({
                          permanentTaxState: event.target.value,
                          permanentTaxState_Error: true
                        });
                      } else {
                        this.setState({
                          permanentTaxState: event.target.value,
                          permanentTaxState_Error: false
                        });
                      }
                    }}
                    value={this.state.permanentTaxState}
                  >
                    {this.statesDD.map((item, i) => {
                      return (
                        <MenuItem key={i} value={item.key}>
                          {item.text}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {this.state.permanentTaxState_Error !== false ? (
                    <FormHelperText>State Cannot be Empty</FormHelperText>
                  ) : (
                    false
                  )}
                </FormControl>
                <FormControl fullWidth style={{ margin: "10px" }}>
                  <div className="row">
                    <div className="col-sm-6">
                      <CustomTextField
                        fullWidth
                        label="Permanent Tax Zip"
                        onChange={e => {
                          if (e.target.value === "") {
                            this.setState({
                              permanentTaxZip: e.target.value,
                              permanentTaxZip_Error: true
                            });
                          } else {
                            const re = /^[0-9\b]+$/;
                            if (
                              e.target.value === "" ||
                              re.test(e.target.value)
                            ) {
                              if (e.target.value.length <= 5) {
                                this.setState({
                                  permanentTaxZip: e.target.value,
                                  permanentTaxZip_Error: false
                                });
                              }
                            }
                          }
                        }}
                        helperText={
                          this.state.permanentTaxZip_Error === true
                            ? "Permanent Tax Zip Cannot be Empty"
                            : null
                        }
                        error={this.state.permanentTaxZip_Error}
                        name="permanentTaxZip"
                        value={this.state.permanentTaxZip}
                      />
                    </div>
                    <div className="col-sm-6">
                      <CustomTextField
                        style={{ marginTop: "16px" }}
                        fullWidth
                        onChange={e => {
                          if (e.target.value === "") {
                            this.setState({
                              permanentTaxZip1: e.target.value,
                              permanentTaxZip1_Error: true
                            });
                          } else {
                            const re = /^[0-9\b]+$/;
                            if (
                              e.target.value === "" ||
                              re.test(e.target.value)
                            ) {
                              if (e.target.value.length <= 4) {
                                this.setState({
                                  permanentTaxZip1: e.target.value,
                                  permanentTaxZip1_Error: false
                                });
                              }
                            }
                          }
                        }}
                        helperText={
                          this.state.permanentTaxZip1_Error === true
                            ? "Permanent Tax Zip1 Cannot be Empty"
                            : null
                        }
                        error={this.state.permanentTaxZip1_Error}
                        name="permanentTaxZip1"
                        value={this.state.permanentTaxZip1}
                      />
                    </div>
                  </div>
                </FormControl>
                <FormControl
                  fullWidth
                  style={{ margin: "10px" }}
                  error={this.state.permanentTaxPriorityMailingMethod_Error}
                >
                  <InputLabel style={{ color: "#275458" }}>
                    Permanent Tax Priority Mailing Method*
                  </InputLabel>
                  <Select
                    name="permanentTaxPriorityMailingMethod"
                    defaultValue={{
                      key: "NA",
                      text: "-- Please Select Maliling Method --"
                    }}
                    onChange={event => {
                      if (event.target.value === "NA") {
                        this.setState({
                          permanentTaxPriorityMailingMethod: event.target.value,
                          permanentTaxPriorityMailingMethod_Error: true
                        });
                      } else {
                        this.setState({
                          permanentTaxPriorityMailingMethod: event.target.value,
                          permanentTaxPriorityMailingMethod_Error: false
                        });
                      }
                    }}
                    value={this.state.permanentTaxPriorityMailingMethod}
                  >
                    {this.mailingMethod.map((item, i) => {
                      return (
                        <MenuItem key={i} value={item.key}>
                          {item.text}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {this.state.permanentTaxPriorityMailingMethod_Error !==
                  false ? (
                    <FormHelperText>
                      Mailing Method Cannot be Empty
                    </FormHelperText>
                  ) : (
                    false
                  )}
                </FormControl>
              </div>
            </div>
          </div>
        </div>
        <div className="row" style={{ clear: "both" }}>
          &nbsp;
        </div>
        <div className="card">
          <div className={`card-body`}>
            <div className={`${styles.container_shareholder} card-header`}>
              <h6>Trustee</h6>
            </div>
            <div className="row-fluid">
              <div className="col-md-12">
                <FormControl fullWidth style={{ margin: "10px" }}>
                  <CustomTextField
                    label="Trustee Name(s)"
                    onChange={event => {
                      this.setState({
                        trusteeName: event.target.value
                      });
                    }}
                    name="trusteeName"
                    multiline
                    rows="4"
                    value={this.state.trusteeName}
                  />
                </FormControl>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
    return _html;
  }

  public paperlessDcoumentDeliveryElections = () => {
    let _html = (
      <React.Fragment>
        {" "}
        <div className="card">
          <div className={`card-body`} style={{ paddingBottom: "2px" }}>
            <div className={`${styles.container_shareholder} card-header`}>
              <h6>Paperless Dcoument Delivery Elections</h6>
            </div>
            <div className="row-fluid">
              <div className="col-md-12">
                <FormControl
                  style={{
                    marginLeft: "-2px",
                    marginBottom: "0",
                    marginTop: "10px"
                  }}
                >
                  <div>
                    <FormLabel component="legend" style={{ color: "#275458" }}>
                      <span
                        style={{
                          paddingRight: "10px",
                          marginTop: "5px"
                        }}
                      ></span>
                      All Paperless Election
                      <CustomCheckbox
                        checked={this.state.allPaperlessElection}
                        color="primary"
                        onChange={e => {
                          if (e.target.checked === true) {
                            this.setState({
                              allPaperlessElection: e.target.checked,
                              pperlessOwnersReportsElection: "Yes",
                              paperlessTenderOfferElection: "Yes",
                              paperlessTaxDistributionElection: "Yes",
                              paperlessProxyElection: "Yes",
                              paperlessK1Election: "Yes"
                            });
                          } else {
                            this.setState({
                              allPaperlessElection: e.target.checked,
                              pperlessOwnersReportsElection: "",
                              paperlessTenderOfferElection: "",
                              paperlessTaxDistributionElection: "",
                              paperlessProxyElection: "",
                              paperlessK1Election: ""
                            });
                          }
                        }}
                        value="allPaperlessElection"
                      />
                    </FormLabel>
                  </div>
                </FormControl>
                <FormControl
                  fullWidth
                  style={{ margin: "10px" }}
                  error={this.state.pperlessOwnersReportsElection_Error}
                >
                  <FormLabel
                    style={{
                      color:
                        this.state.pperlessOwnersReportsElection_Error !== true
                          ? "#275458"
                          : "#dc3545"
                    }}
                    component="legend"
                  >
                    Paperless Owners Reports Election
                    <RadioGroup
                      row
                      aria-label="pperlessOwnersReportsElection"
                      name="pperlessOwnersReportsElection"
                      value={this.state.pperlessOwnersReportsElection}
                      onChange={e => {
                        if (e.target.value !== "") {
                          this.setState({
                            pperlessOwnersReportsElection: e.target.value,
                            pperlessOwnersReportsElection_Error: false
                          });
                        } else {
                          this.setState({
                            pperlessOwnersReportsElection: e.target.value,
                            pperlessOwnersReportsElection_Error: false
                          });
                        }
                      }}
                    >
                      <FormControlLabel
                        labelPlacement="end"
                        value="Yes"
                        control={<CustomRadio />}
                        disabled={this.state.allPaperlessElection}
                        label="Yes"
                      />
                      <FormControlLabel
                        labelPlacement="end"
                        value="No"
                        control={<CustomRadio />}
                        label="No"
                        disabled={this.state.allPaperlessElection}
                      />
                    </RadioGroup>
                  </FormLabel>
                </FormControl>
                <FormControl
                  fullWidth
                  style={{ margin: "10px" }}
                  error={this.state.paperlessTenderOfferElection_Error}
                >
                  <FormLabel
                    component="legend"
                    style={{
                      color:
                        this.state.paperlessTenderOfferElection_Error !== true
                          ? "#275458"
                          : "#dc3545"
                    }}
                  >
                    Paperless Tender Offer Election
                    <RadioGroup
                      row
                      aria-label="paperlessTenderOfferElection"
                      name="paperlessTenderOfferElection"
                      value={this.state.paperlessTenderOfferElection}
                      onChange={e => {
                        if (e.target.value !== "") {
                          this.setState({
                            paperlessTenderOfferElection: e.target.value,
                            paperlessTenderOfferElection_Error: false
                          });
                        } else {
                          this.setState({
                            paperlessTenderOfferElection: e.target.value,
                            paperlessTenderOfferElection_Error: false
                          });
                        }
                      }}
                    >
                      <FormControlLabel
                        labelPlacement="end"
                        value="Yes"
                        control={<CustomRadio />}
                        label="Yes"
                        disabled={this.state.allPaperlessElection}
                      />
                      <FormControlLabel
                        labelPlacement="end"
                        value="No"
                        control={<CustomRadio />}
                        label="No"
                        disabled={this.state.allPaperlessElection}
                      />
                    </RadioGroup>
                  </FormLabel>
                </FormControl>
                <FormControl
                  fullWidth
                  style={{ margin: "10px" }}
                  error={this.state.paperlessTaxDistributionElection_Error}
                >
                  <FormLabel
                    component="legend"
                    style={{
                      color:
                        this.state.paperlessTaxDistributionElection_Error !==
                        true
                          ? "#275458"
                          : "#dc3545"
                    }}
                  >
                    Paperless Tax Distribution Election
                    <RadioGroup
                      row
                      aria-label="paperlessTaxDistributionElection"
                      name="paperlessTaxDistributionElection"
                      value={this.state.paperlessTaxDistributionElection}
                      onChange={e => {
                        if (e.target.value !== "") {
                          this.setState({
                            paperlessTaxDistributionElection: e.target.value,
                            paperlessTaxDistributionElection_Error: false
                          });
                        } else {
                          this.setState({
                            paperlessTaxDistributionElection: e.target.value,
                            paperlessTaxDistributionElection_Error: false
                          });
                        }
                      }}
                    >
                      <FormControlLabel
                        labelPlacement="end"
                        value="Yes"
                        control={<CustomRadio />}
                        disabled={this.state.allPaperlessElection}
                        label="Yes"
                      />
                      <FormControlLabel
                        labelPlacement="end"
                        value="No"
                        control={<CustomRadio />}
                        label="No"
                        disabled={this.state.allPaperlessElection}
                      />
                    </RadioGroup>
                  </FormLabel>
                </FormControl>
                <FormControl
                  fullWidth
                  style={{ margin: "10px" }}
                  error={this.state.paperlessProxyElection_Error}
                >
                  <FormLabel
                    component="legend"
                    style={{
                      color:
                        this.state.paperlessProxyElection_Error !== true
                          ? "#275458"
                          : "#dc3545"
                    }}
                  >
                    Paperless Proxy Election
                    <RadioGroup
                      row
                      aria-label="paperlessProxyElection"
                      name="paperlessProxyElection"
                      value={this.state.paperlessProxyElection}
                      onChange={e => {
                        if (e.target.value !== "") {
                          this.setState({
                            paperlessProxyElection: e.target.value,
                            paperlessProxyElection_Error: false
                          });
                        } else {
                          this.setState({
                            paperlessProxyElection: e.target.value,
                            paperlessProxyElection_Error: false
                          });
                        }
                      }}
                    >
                      <FormControlLabel
                        labelPlacement="end"
                        value="Yes"
                        control={<CustomRadio />}
                        disabled={this.state.allPaperlessElection}
                        label="Yes"
                      />
                      <FormControlLabel
                        labelPlacement="end"
                        value="No"
                        control={<CustomRadio />}
                        label="No"
                        disabled={this.state.allPaperlessElection}
                      />
                    </RadioGroup>
                  </FormLabel>
                </FormControl>
                <FormControl
                  fullWidth
                  style={{ margin: "10px" }}
                  error={this.state.paperlessK1Election_Error}
                >
                  <FormLabel
                    component="legend"
                    style={{
                      color:
                        this.state.paperlessK1Election_Error !== true
                          ? "#275458"
                          : "#dc3545"
                    }}
                  >
                    Paperless K-1 Election
                    <RadioGroup
                      row
                      aria-label="paperlessK1Election"
                      name="paperlessK1Election"
                      value={this.state.paperlessK1Election}
                      onChange={e => {
                        if (e.target.value !== "") {
                          this.setState({
                            paperlessK1Election: e.target.value,
                            paperlessK1Election_Error: false
                          });
                        } else {
                          this.setState({
                            paperlessK1Election: e.target.value,
                            paperlessK1Election_Error: false
                          });
                        }
                      }}
                    >
                      <FormControlLabel
                        labelPlacement="end"
                        value="Yes"
                        control={<CustomRadio />}
                        disabled={this.state.allPaperlessElection}
                        label="Yes"
                      />
                      <FormControlLabel
                        labelPlacement="end"
                        value="No"
                        control={<CustomRadio />}
                        label="No"
                        disabled={this.state.allPaperlessElection}
                      />
                    </RadioGroup>
                  </FormLabel>
                </FormControl>
                <FormControl
                  style={{
                    marginLeft: "-2px",
                    marginBottom: "0",
                    marginTop: "0px"
                  }}
                >
                  <div>
                    <FormLabel component="legend" style={{ color: "#275458" }}>
                      <span
                        style={{
                          paddingRight: "10px",
                          marginTop: "5px"
                        }}
                      ></span>
                      Primary Household Mailing Account
                      <CustomCheckbox
                        checked={this.state.primaryHouseholdMailingAccount}
                        color="primary"
                        onChange={e => {
                          this.setState({
                            primaryHouseholdMailingAccount: e.target.checked
                          });
                        }}
                        value="primaryHouseholdMailingAccount"
                      />
                    </FormLabel>
                  </div>
                </FormControl>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
    return _html;
  }

  public stockandOptions = () => {
    let _html = (
      <React.Fragment>
        <div className="card">
          <div className={`card-body`}>
            <div className={`${styles.container_shareholder} card-header`}>
              <h6>Stock and Options</h6>
            </div>
            <div className="row-fluid">
              <div className="col-md-12">
                <FormControl fullWidth style={{ margin: "10px" }}>
                  <CustomTextField
                    label="Unrestricted Shares"
                    onChange={e => {
                      this.validateStockandOptions(e);
                    }}
                    name="unrestrictedShares"
                    value={this.state.unrestrictedShares}
                  />
                </FormControl>
                <FormControl fullWidth style={{ margin: "10px" }}>
                  <CustomTextField
                    label="Restricted Shares"
                    onChange={e => {
                      this.validateStockandOptions(e);
                    }}
                    name="restrictedShares"
                    value={this.state.restrictedShares}
                  />
                </FormControl>
                <FormControl fullWidth style={{ margin: "10px" }}>
                  <CustomTextField
                    label="Vested Options"
                    onChange={e => {
                      this.validateStockandOptions(e);
                    }}
                    name="vestedOptions"
                    value={this.state.vestedOptions}
                  />
                </FormControl>
                <FormControl fullWidth style={{ margin: "10px" }}>
                  <CustomTextField
                    label="Unvested Options"
                    onChange={e => {
                      this.validateStockandOptions(e);
                    }}
                    name="unVestedOptions"
                    value={this.state.unVestedOptions}
                  />
                </FormControl>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
    return _html;
  }

  public render(): React.ReactElement<any> {
    return (
      <div className={styles.shareholders}>
        <div>
          <div className="row">
            {this.state.catchException === true ? (
              <React.Fragment> {this.callExceptionError()} </React.Fragment>
            ) : null}
            <React.Fragment>
              <Snackbar
                anchorOrigin={{
                  vertical: this.state.snackbar_vertical,
                  horizontal: this.state.snackbar_horizontal
                }}
                key={`${this.state.snackbar_vertical},${this.state.snackbar_horizontal}`}
                open={this.state.snackbar_open}
                autoHideDuration={6000}
                onClose={e => {
                  this.setState({ snackbar_open: false });
                }}
                ContentProps={{
                  "aria-describedby": "message-id",
                  classes: {
                    root: `${styles.snackbarColor}`
                  }
                }}
                message={
                  <span id="message-id">
                    <CheckCircleIcon /> Account Information Updated Sucessfully
                  </span>
                }
                action={[
                  <IconButton
                    key="close"
                    aria-label="close"
                    color="inherit"
                    onClick={e => {
                      this.setState({ snackbar_open: false });
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                ]}
              />
            </React.Fragment>
          </div>
          <Paper style={{ padding: 16 }}>
            <div className="row">
              <Stepper
                activeStep={this.state.activeStep}
                orientation="vertical"
              >
                <Step key={1}>
                  <StepLabel
                    StepIconProps={{
                      classes: {
                        root: `${styles.stepperColor}`,
                        active: `${styles.stepperColor}`
                      }
                    }}
                  >
                    General Information & Document Mailing Address
                  </StepLabel>
                  <StepContent>
                    <form>
                      <div
                        className="row"
                        style={{ margin: "10px", paddingTop: "15px" }}
                      >
                        <div className="col-lg-6 col-md-6 col-sm-12 col xs-12">
                          {this.generalInformation()}
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 col xs-12">
                          {this.documentMailingAddress()}
                        </div>
                      </div>
                      <div
                        className="row"
                        style={{ margin: "10px", paddingTop: "15px" }}
                      >
                        <div
                          className="container-fluid"
                          style={{ marginTop: 15 }}
                        >
                          <div>
                            <Button
                              disabled={this.state.activeStep === 0}
                              onClick={this.handleBackStep}
                            >
                              Back
                            </Button>
                            <Button
                              variant="contained"
                              className={styles.stepperBtn}
                              onClick={this.generalInfoAndDocumentAdd}
                            >
                              {this.state.activeStep === this.state.steps - 1
                                ? "Finish"
                                : "Next"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </StepContent>
                </Step>
                <Step key={2}>
                  <StepLabel
                    StepIconProps={{
                      classes: {
                        root: `${styles.stepperColor}`,
                        active: `${styles.stepperColor}`
                      }
                    }}
                  >
                    Shareholder Address & Trustee
                  </StepLabel>
                  <StepContent>
                    <div
                      className="row"
                      style={{ margin: "10px", paddingTop: "15px" }}
                    >
                      <div className="col-lg-6 col-md-6 col-sm-12 col xs-12">
                        {this.shareholderAddressTrustee()}
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12 col xs-12">
                        {this.paperlessDcoumentDeliveryElections()}
                      </div>
                    </div>
                    <div
                      className="row"
                      style={{ margin: "10px", paddingTop: "15px" }}
                    >
                      <div
                        className="container-fluid"
                        style={{ marginTop: 15 }}
                      >
                        <div>
                          <Button
                            disabled={this.state.activeStep === 0}
                            onClick={this.handleBackStep}
                          >
                            Back
                          </Button>
                          <Button
                            variant="contained"
                            className={styles.stepperBtn}
                            onClick={this.shareholderAndTrusteeAdd}
                          >
                            {this.state.activeStep === this.state.steps - 1
                              ? "Finish"
                              : "Next"}
                          </Button>
                        </div>
                      </div>
                    </div>{" "}
                  </StepContent>
                </Step>
                <Step key={3}>
                  <StepLabel
                    StepIconProps={{
                      classes: {
                        root: `${styles.stepperColor}`,
                        active: `${styles.stepperColor}`
                      }
                    }}
                  >
                    Stock and Options
                  </StepLabel>
                  <StepContent>
                    <div
                      className="row"
                      style={{ margin: "10px", paddingTop: "15px" }}
                    >
                      <div className="col-lg-6 col-md-6 col-sm-12 col xs-12">
                        {this.stockandOptions()}
                      </div>
                    </div>
                    <div
                      className="row"
                      style={{ margin: "10px", paddingTop: "15px" }}
                    >
                      <div
                        className="container-fluid"
                        style={{ marginTop: 15 }}
                      >
                        <div>
                          <Button
                            disabled={this.state.activeStep === 0}
                            onClick={this.handleBackStep}
                          >
                            Back
                          </Button>
                          <Button
                            variant="contained"
                            className={styles.stepperBtn}
                            onClick={this.shareholderAndTrusteeAdd}
                          >
                            {this.state.activeStep === this.state.steps - 1
                              ? "Finish"
                              : "Next"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </StepContent>
                </Step>
                <Step key={4}>
                  <StepLabel
                    StepIconProps={{
                      classes: {
                        root: `${styles.stepperColor}`,
                        active: `${styles.stepperColor}`
                      }
                    }}
                  >
                    Submit
                  </StepLabel>
                  <StepContent>
                    <div
                      className="row"
                      style={{ margin: "10px", paddingTop: "15px" }}
                    >
                      <Typography>
                        Please Click Submit button to save changes
                      </Typography>
                      <div
                        className="container-fluid"
                        style={{ marginTop: 15 }}
                      >
                        <div>
                          <Button
                            disabled={this.state.activeStep === 0}
                            onClick={this.handleBackStep}
                          >
                            Back
                          </Button>
                          <Button
                            variant="contained"
                            className={styles.stepperBtn}
                            onClick={this.submitAccountInfo}
                          >
                            {this.state.activeStep === this.state.steps - 1
                              ? "Submit"
                              : "Next"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </StepContent>
                </Step>
              </Stepper>
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}
