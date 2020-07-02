import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@material-ui/core";
import { Web } from "@pnp/sp";
import * as React from "react";
import styles from "./shareholders.module.scss";
import { CustomTextField } from "../common/common";

export class OtherInformation extends React.Component<any, any> {
  public constructor(props: any, state: any) {
    super(props);
    this.getOtherInformation = this.getOtherInformation.bind(this);
    this.state = {
      properties: this.props.properties,
      shareholderID: this.props.properties.shareholderID,
      otherInfoCollection: [],
      dividendPaymentType: "Wire Direct Deposit",
      taxDistributionPaymentType: "Wire Direct Deposit",
      dividendPaymentAccount: "",
      taxDistributionPaymentAccount: ""
    };
  }

  public componentDidMount() {
    if (this.state.shareholderID !== undefined) {
      this.getOtherInformation(this.state.shareholderID);
    }
  }

  public getOtherInformation(id) {
    //Shareholding Other Information
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
              dividendPaymentAccount: "****" + d[0].dividendPaymentAccount,
              taxDistributionPaymentAccount: "****" + d[0].taxDistributionPaymentAccount
            }));
          } else {
            this.setState(prevState => ({
              ...prevState,
              delegateInformation: []
            }));
          }
        });
    }
  }



  public render(): React.ReactElement<any> {
    return (
      <div className={styles.shareholders}>
        <div className={styles.otherInformation}>
          <div className="col-lg-12 col-md-12 col-sm-12 col-sx-12">
            <div className="card">
              <div className={`card-body`}>
                <div className={`${styles.cardHead_General} card-header`}>
                  <h6>Other Information</h6>
                </div>
                <div className="row-fluid">
                  <div className="row">
                    <div className="col-md-6">
                      <FormControl fullWidth style={{ margin: "10px" }}>
                        <CustomTextField
                          disabled={true}
                          label="Dividend Payment Type"
                          name="dividendPaymentType"
                          value={this.state.dividendPaymentType}
                        />
                      </FormControl>
                      <FormControl
                        fullWidth
                        style={{ margin: "10px" }}
                        className={styles.inputColor}
                      >
                        <CustomTextField
                          disabled={true}
                          label="Dividend Payment Account"
                          name="dividendPaymentAccount"
                          value={this.state.dividendPaymentAccount}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-6">
                      <FormControl fullWidth style={{ margin: "10px" }}>
                        <CustomTextField
                          disabled={true}
                          label="Tax Distribution Payment Type"
                          name="dividendPaymentType"
                          value={this.state.dividendPaymentType}
                        />
                      </FormControl>
                      <FormControl fullWidth style={{ margin: "10px" }}>
                        <CustomTextField
                          disabled={true}
                          label="Tax Distribution Payment Account"
                          name="taxDistributionPaymentAccount"
                          value={this.state.taxDistributionPaymentAccount}
                        />
                      </FormControl>
                    </div>
                  </div>
                  <div className="row">
                    <div
                      className={`${styles.alignAlert} alert alert-info`}
                      role="alert"
                    >
                      <p
                        className={`${styles.electionsGeneralText} text-justify`}
                      >
                        Due to the sensitive nature of the above information,
                        please contact the Shareholder Services Office to make
                        any changes or download, complete and sign the Direct
                        Deposit Form in the Documents library and mail it to the
                        address listed on the form.
                      </p>
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


   {
     /* <InputLabel>Dividend Payment Type</InputLabel>
                        <Select
                          id="dividendPaymentType"
                          value={this.state.dividendPaymentType}
                          disabled={true}
                        >
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
                       <InputLabel>Tax Distribution Payment Type</InputLabel>
                        <Select
                          labelId="Tax Distribution Payment Type"
                          id="dividendPaymentType"
                          value={this.state.dividendPaymentType}
                          disabled={true}
                        >
                          <MenuItem value="ACH Direct Deposit">
                            ACH Direct Deposit
                          </MenuItem>
                          <MenuItem value="Wire Direct Deposit">
                            Wire Direct Deposit
                          </MenuItem>
                          <MenuItem value="Check">Check</MenuItem>
                        </Select>
                      */
   }
