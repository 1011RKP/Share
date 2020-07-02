import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import { sp, Web } from "@pnp/sp";
import * as React from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { priorityMailingMethod, state_DD } from "../../common/common";
import styles from "../../shareholders/shareholders.module.scss";

export class AdminAccountInformation extends React.Component<any, any> {

  //public OwnershipTypes = OwnershipTypes;
  public constructor(props: any, state: any) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getAccountInfromation = this.getAccountInfromation.bind(this);
    this.snackbar_handleClose = this.snackbar_handleClose.bind(this);
    this.OwnershipType = this.OwnershipType.bind(this);
    this.postAccountInformation = this.postAccountInformation.bind(this);
    this.updateAccountInformation = this.updateAccountInformation.bind(this);
    this.state = {
      properties: this.props.properties,
      accountInformation: [],
      state_DD: state_DD,
      priorityMailingMethod: priorityMailingMethod,
      submitted: false,
      snackbar_open: false,
      snackbar_vertical: "bottom",
      snackbar_horizontal: "right",
      gi_PrimeShareholderContact: "",
      gi_ShareholderEmailAddress: "",
      gi_OwnershipType: "",
      gi_ScorpFamily: "",
      sa_AddressLine1: "",
      sa_AddressLine2: "",
      sa_City: "",
      sa_State: "",
      sa_Zip: "",
      sa_PriorityMailingMethod: "",
      dma_DocumentMailingAddress: "",
      dma_MailingLableAttentionToName: "",
      dma_AddressLine1: "",
      dma_AddressLine2: "",
      dma_City: "",
      dma_State: "",
      dma_Zip: "",
      dma_PriorityMailingMethod: "",
      te_trusteeName: "",
      OwnershipTypes: []
    };
  }

  public componentDidMount() {
    if (this.props.properties !== undefined) {
      this.getAccountInfromation(this.state.properties.AccountID);
      this.OwnershipType();
    }
  }

  public OwnershipType() {
    let newWeb = new Web(this.state.properties.tenentURL);
    let DDOwnershipTypes = [];
    newWeb.lists
      .getByTitle("Ownership Types")
      .items.select("Title", "ID")
      //.orderBy("Title", true)
      .get()
      .then(d => {
        if (d.length > 0) {
          for (let index = 0; index < d.length; index++) {
            DDOwnershipTypes.push(d[index].Title);
          }
          this.setState({
            OwnershipTypes: DDOwnershipTypes
          });
        }
      });
  }

  public getAccountInfromation(id): any {
    if (id) {
      let newWeb = new Web(this.state.properties.tenentURL);
      newWeb.lists
        .getByTitle("Shareholding Account Information")
        .items.select(
          "Id",
          "Title",
          "giPrimeShareholderContact",
          "giShareholderEmailAddress",
          "giOwnershipType",
          "giScorpFamily",
          "saAddressLine1",
          "saAddressLine2",
          "saCity",
          "saState",
          "saZip",
          "saPriorityMailingMethod",
          "dmaDocumentMailingAddress",
          "dmaMailingLableAttentionToName",
          "dmaAddressLine1",
          "dmaAddressLine2",
          "dmaCity",
          "dmaState",
          "dmaZip",
          "dmaPriorityMailingMethod",
          "tetrusteeName",
          "ID",
          "Modified",
          "Created"
        )
        .orderBy("Title", true)
        .filter("Title eq '" + id + "'")
        .get()
        .then(d => {
          if (d.length > 0) {
            this.setState(
              {
                accountInformation: d[0],
                gi_PrimeShareholderContact: d[0].giPrimeShareholderContact,
                gi_ShareholderEmailAddress: d[0].giShareholderEmailAddress,
                gi_OwnershipType: d[0].giOwnershipType,
                gi_ScorpFamily: d[0].giScorpFamily,
                sa_AddressLine1: d[0].saAddressLine1,
                sa_AddressLine2: d[0].saAddressLine2,
                sa_City: d[0].saCity,
                sa_State: d[0].saState,
                sa_Zip: d[0].saZip,
                sa_PriorityMailingMethod: d[0].saPriorityMailingMethod,
                dma_DocumentMailingAddress: d[0].dmaDocumentMailingAddress,
                dma_MailingLableAttentionToName:
                  d[0].dmaMailingLableAttentionToName,
                dma_AddressLine1: d[0].dmaAddressLine1,
                dma_AddressLine2: d[0].dmaAddressLine2,
                dma_City: d[0].dmaCity,
                dma_State: d[0].dmaState,
                dma_Zip: d[0].dmaZip,
                dma_PriorityMailingMethod: d[0].dmaPriorityMailingMethod,
                te_trusteeName: d[0].tetrusteeName
              },
              () => {
                console.log(this.state);
              }
            );
          }
        });
    }
  }

  public snackbar_handleClose() {
    this.setState({ ...this.state, snackbar_open: false });
  }

  public postAccountInformation(newWeb: Web) {
    const { submitted } = this.state;
    this.setState({ submitted: true }, () => {
      newWeb.lists
        .getByTitle("Shareholding Account Information")
        .items.add({
          Title:this.state.properties.AccountID,
          giPrimeShareholderContact: this.state.gi_PrimeShareholderContact.toString(),
          giShareholderEmailAddress: this.state.gi_ShareholderEmailAddress.toString(),
          giOwnershipType: this.state.gi_OwnershipType.toString(),
          giScorpFamily: this.state.gi_ScorpFamily.toString(),
          saAddressLine1: this.state.sa_AddressLine1.toString(),
          saAddressLine2: this.state.sa_AddressLine2.toString(),
          saCity: this.state.sa_City.toString(),
          saState: this.state.sa_State.toString(),
          saZip: this.state.sa_Zip.toString(),
          saPriorityMailingMethod: this.state.sa_PriorityMailingMethod.toString(),
          dmaDocumentMailingAddress: this.state.dma_DocumentMailingAddress.toString(),
          dmaMailingLableAttentionToName: this.state.dma_MailingLableAttentionToName.toString(),
          dmaAddressLine1: this.state.dma_AddressLine1.toString(),
          dmaAddressLine2: this.state.dma_AddressLine2.toString(),
          dmaCity: this.state.dma_City.toString(),
          dmaState: this.state.dma_State.toString(),
          dmaZip: this.state.dma_Zip.toString(),
          dmaPriorityMailingMethod: this.state.dma_PriorityMailingMethod.toString(),
          tetrusteeName: this.state.te_trusteeName.toString()
        })
        .then(i => {
          this.setState({ snackbar_open: true, submitted: false });
          console.log(i);
        });
      //
    });
    setTimeout(() => this.setState({ submitted: false }), 5000);
  }

  public updateAccountInformation(newWeb: Web) {
    const { submitted } = this.state;
    this.setState({ submitted: true }, () => {
      newWeb.lists
        .getByTitle("Shareholding Account Information")
        .items.getById(this.state.accountInformation.ID)
        .update({
          giPrimeShareholderContact: this.state.gi_PrimeShareholderContact.toString(),
          giShareholderEmailAddress: this.state.gi_ShareholderEmailAddress.toString(),
          giOwnershipType: this.state.gi_OwnershipType.toString(),
          giScorpFamily: this.state.gi_ScorpFamily.toString(),
          saAddressLine1: this.state.sa_AddressLine1.toString(),
          saAddressLine2: this.state.sa_AddressLine2.toString(),
          saCity: this.state.sa_City.toString(),
          saState: this.state.sa_State.toString(),
          saZip: this.state.sa_Zip.toString(),
          saPriorityMailingMethod: this.state.sa_PriorityMailingMethod.toString(),
          dmaDocumentMailingAddress: this.state.dma_DocumentMailingAddress.toString(),
          dmaMailingLableAttentionToName: this.state.dma_MailingLableAttentionToName.toString(),
          dmaAddressLine1: this.state.dma_AddressLine1.toString(),
          dmaAddressLine2: this.state.dma_AddressLine2.toString(),
          dmaCity: this.state.dma_City.toString(),
          dmaState: this.state.dma_State.toString(),
          dmaZip: this.state.dma_Zip.toString(),
          dmaPriorityMailingMethod: this.state.dma_PriorityMailingMethod.toString(),
          tetrusteeName: this.state.te_trusteeName.toString()
        })
        .then(i => {
          this.setState({ snackbar_open: true, submitted: false });
          console.log(i);
        });
      //
    });
    setTimeout(() => this.setState({ submitted: false }), 5000);
  }

  public handleSubmit = () => {
    let newWeb = new Web(this.state.properties.tenentURL);
    if (this.state.accountInformation.length !== 0) {
      this.updateAccountInformation(newWeb);
    } else {
      this.postAccountInformation(newWeb);
    }
  }

  public render(): React.ReactElement<any> {
    const { submitted } = this.state;
    return (
      <ValidatorForm
        ref="form"
        onSubmit={this.handleSubmit}
        className={styles.shareholders}
      >
        <div
          className="row-fluid"
          style={{ padding: "20px", overflow: "hidden" }}
        >
          <div className="row" style={{ paddingTop: "10px" }}>
            <div className="col-lg-6 col-md-6 col-sm-12 col-sx-12">
              <div className="card">
                <div className={`card-body`}>
                  <div className={`${styles.cardHead_General} card-header`}>
                    <h6>General Information</h6>
                  </div>
                  <div className="row-fluid">
                    <div className="col-md-12">
                      <FormControl
                        fullWidth
                        style={{ margin: "10px" }}
                        className={styles.inputColor}
                      >
                        <TextValidator
                          label="Primary Shareholding Contact*"
                          onChange={event => {
                            this.setState({
                              gi_PrimeShareholderContact: event.target.value
                            });
                          }}
                          name="gi_PrimeShareholderContact"
                          value={this.state.gi_PrimeShareholderContact}
                          validators={["required"]}
                          errorMessages={["this field is required"]}
                        />
                      </FormControl>
                      <FormControl fullWidth style={{ margin: "10px" }}>
                        <TextValidator
                          label="Shareholding Email Address*"
                          onChange={event => {
                            this.setState({
                              gi_ShareholderEmailAddress: event.target.value
                            });
                          }}
                          name="gi_ShareholderEmailAddress"
                          value={this.state.gi_ShareholderEmailAddress}
                          validators={["required", "isEmail"]}
                          errorMessages={[
                            "this field is required",
                            "email is not valid"
                          ]}
                        />
                      </FormControl>
                      <FormControl fullWidth style={{ margin: "10px" }}>
                        <InputLabel>Ownership Type </InputLabel>
                        <Select
                          name="gi_OwnershipType"
                          onChange={event => {
                            this.setState({
                              gi_OwnershipType: event.target.value
                            });
                          }}
                          value={this.state.gi_OwnershipType}
                        >
                          {this.state.OwnershipTypes.map(
                            (ownershipTypes, index) => {
                              return (
                                <MenuItem value={index}>
                                  {ownershipTypes}
                                </MenuItem>
                              );
                            }
                          )}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth style={{ margin: "10px" }}>
                        <TextValidator
                          label="S-Corp Family"
                          onChange={event => {
                            this.setState({
                              gi_ScorpFamily: event.target.value
                            });
                          }}
                          name="gi_ScorpFamily"
                          value={this.state.gi_ScorpFamily}
                        />
                      </FormControl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container">&nbsp;</div>
              <div className="card">
                <div className={`card-body`}>
                  <div
                    className={`${styles.container_shareholder} card-header`}
                  >
                    <h6>Shareholder Address</h6>
                  </div>
                  <div className="row-fluid">
                    <div className="col-md-12">
                      <FormControl
                        fullWidth
                        style={{ margin: "10px" }}
                        className={styles.inputColor}
                      >
                        <TextValidator
                          label="Address Line 1*"
                          onChange={event => {
                            this.setState({
                              sa_AddressLine1: event.target.value
                            });
                          }}
                          name="sa_AddressLine1"
                          value={this.state.sa_AddressLine1}
                          validators={["required"]}
                          errorMessages={["this field is required"]}
                        />
                      </FormControl>
                      <FormControl fullWidth style={{ margin: "10px" }}>
                        <TextValidator
                          label="Address Line 2"
                          onChange={event => {
                            this.setState({
                              sa_AddressLine2: event.target.value
                            });
                          }}
                          name="sa_AddressLine2"
                          value={this.state.sa_AddressLine2}
                        />
                      </FormControl>
                      <FormControl fullWidth style={{ margin: "10px" }}>
                        <TextValidator
                          label="City*"
                          onChange={event => {
                            this.setState({ sa_City: event.target.value });
                          }}
                          name="sa_City"
                          value={this.state.sa_City}
                          validators={["required"]}
                          errorMessages={["this field is required"]}
                        />
                      </FormControl>
                      <FormControl fullWidth style={{ margin: "10px" }}>
                        <InputLabel>State</InputLabel>
                        <Select
                          name="sa_State"
                          onChange={event => {
                            this.setState({ sa_State: event.target.value });
                          }}
                          value={this.state.sa_State}
                        >
                          {this.state.state_DD.map((item, i) => {
                            return (
                              <MenuItem key={i} value={item.key}>
                                {item.text}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth style={{ margin: "10px" }}>
                        <TextValidator
                          label="Zip*"
                          onChange={event => {
                            this.setState({ sa_Zip: event.target.value });
                          }}
                          name="sa_Zip"
                          value={this.state.sa_Zip}
                          validators={["required"]}
                          errorMessages={["this field is required"]}
                        />
                      </FormControl>
                      <FormControl fullWidth style={{ margin: "10px" }}>
                        <InputLabel>Priority Mailing Method</InputLabel>
                        <Select
                          name="sa_PriorityMailingMethod"
                          onChange={event => {
                            this.setState({
                              sa_PriorityMailingMethod: event.target.value
                            });
                          }}
                          value={this.state.sa_PriorityMailingMethod}
                        >
                          {this.state.priorityMailingMethod.map((item, i) => {
                            return (
                              <MenuItem key={i} value={item.key}>
                                {item.text}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-6 col-md-6 col-sm-12 col-sx-12"
              style={{ marginBottom: "20px" }}
            >
              <div className="card">
                <div className={`card-body`}>
                  <div
                    className={`${styles.container_documentMailingAddress} card-header`}
                  >
                    <h6>Document Mailing Address</h6>
                  </div>
                  <div className="row-fluid">
                    <div className="col-md-12">
                      <FormControl
                        fullWidth
                        style={{ margin: "10px" }}
                        className={styles.inputColor}
                      >
                        <TextValidator
                          label="Document Mailing Address"
                          onChange={event => {
                            this.setState({
                              dma_DocumentMailingAddress: event.target.value
                            });
                          }}
                          name="dma_DocumentMailingAddress"
                          value={this.state.dma_DocumentMailingAddress}
                        />
                      </FormControl>
                      <FormControl fullWidth style={{ margin: "10px" }}>
                        <TextValidator
                          label="Mailing Lable Attention To Name"
                          onChange={event => {
                            this.setState({
                              dma_MailingLableAttentionToName:
                                event.target.value
                            });
                          }}
                          name="dma_MailingLableAttentionToName"
                          value={this.state.dma_MailingLableAttentionToName}
                        />
                      </FormControl>
                      <FormControl
                        fullWidth
                        style={{ margin: "10px" }}
                        className={styles.inputColor}
                      >
                        <TextValidator
                          label="Address Line 1*"
                          onChange={event => {
                            this.setState({
                              dma_AddressLine1: event.target.value
                            });
                          }}
                          name="dma_AddressLine1"
                          value={this.state.dma_AddressLine1}
                          validators={["required"]}
                          errorMessages={["this field is required"]}
                        />
                      </FormControl>
                      <FormControl fullWidth style={{ margin: "10px" }}>
                        <TextValidator
                          label="Address Line 2"
                          onChange={event => {
                            this.setState({
                              dma_AddressLine2: event.target.value
                            });
                          }}
                          name="dma_AddressLine2"
                          value={this.state.dma_AddressLine2}
                        />
                      </FormControl>
                      <FormControl fullWidth style={{ margin: "10px" }}>
                        <TextValidator
                          label="City*"
                          onChange={event => {
                            this.setState({ dma_City: event.target.value });
                          }}
                          name="dma_City"
                          value={this.state.dma_City}
                          validators={["required"]}
                          errorMessages={["this field is required"]}
                        />
                      </FormControl>
                      <FormControl fullWidth style={{ margin: "10px" }}>
                        <InputLabel>State</InputLabel>
                        <Select
                          name="dma_State"
                          onChange={event => {
                            this.setState({ dma_State: event.target.value });
                          }}
                          value={this.state.dma_State}
                        >
                          {this.state.state_DD.map((item, i) => {
                            return (
                              <MenuItem key={i} value={item.key}>
                                {item.text}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth style={{ margin: "10px" }}>
                        <TextValidator
                          label="Zip*"
                          onChange={event => {
                            this.setState({ dma_Zip: event.target.value });
                          }}
                          name="dma_Zip"
                          value={this.state.dma_Zip}
                          validators={["required"]}
                          errorMessages={["this field is required"]}
                        />
                      </FormControl>
                      <FormControl fullWidth style={{ margin: "10px" }}>
                        <InputLabel>Priority Mailing Method</InputLabel>
                        <Select
                          name="dma_PriorityMailingMethod"
                          onChange={event => {
                            this.setState({
                              dma_PriorityMailingMethod: event.target.value
                            });
                          }}
                          value={this.state.dma_PriorityMailingMethod}
                        >
                          {this.state.priorityMailingMethod.map((item, i) => {
                            return (
                              <MenuItem key={i} value={item.key}>
                                {item.text}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container">&nbsp;</div>
              <div className="card">
                <div className={`card-body`}>
                  <div className={`${styles.container_trustee} card-header`}>
                    <h6>Trustee(s)</h6>
                  </div>
                  <div className="row-fluid">
                    <div className="col-md-12">
                      <FormControl
                        fullWidth
                        style={{ margin: "10px" }}
                        className={styles.inputColor}
                      >
                        <TextValidator
                          label="Trustee Name(s)*"
                          onChange={event => {
                            this.setState({
                              te_trusteeName: event.target.value
                            });
                          }}
                          name="te_trusteeName"
                          value={this.state.te_trusteeName}
                          validators={["required"]}
                          errorMessages={["this field is required"]}
                        />
                      </FormControl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row-fluid" style={{ marginTop: "10px" }}>
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  disabled={submitted}
                  className={styles.accountInfoBtn}
                >
                  <SaveIcon fontSize="default" />
                  {(submitted && "Account Information Saved!") ||
                    (!submitted && "Save Account Information")}
                </Button>
                <Snackbar
                  anchorOrigin={{
                    vertical: this.state.snackbar_vertical,
                    horizontal: this.state.snackbar_horizontal
                  }}
                  key={`${this.state.snackbar_vertical},${this.state.snackbar_horizontal}`}
                  open={this.state.snackbar_open}
                  className={styles.snackbarColor}
                  //autoHideDuration={6000}
                  onClose={this.snackbar_handleClose}
                  ContentProps={{
                    "aria-describedby": "message-id",
                    classes: {
                      root: `${styles.snackbarColor}`
                    }
                  }}
                  message={
                    <span id="message-id">
                      <CheckCircleIcon /> Updated Successfully
                    </span>
                  }
                  action={[
                    <IconButton
                      key="close"
                      aria-label="close"
                      color="inherit"
                      onClick={this.snackbar_handleClose}
                    >
                      <CloseIcon />
                    </IconButton>
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row"></div>
      </ValidatorForm>
    );
  }
}
