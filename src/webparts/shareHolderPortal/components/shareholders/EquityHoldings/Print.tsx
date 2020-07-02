import * as React from "react";
import styles from "../shareholders.module.scss";
import { RestrictedShares } from "./RestrictedShares";
import { UnRestrictedShares } from "./UnrestrictedShares";
import { UnVestedOptions } from "./UnVestedOptions";
import { VestedOption } from "./VestedOptions";
import Moment from "react-moment";
export const wawaLogo: any = require("../../../images/wawa-logo.png");

export class Print extends React.Component<any, any> {
  public constructor(props: any, state: any) {
    super(props);
    this.state = {
      properties: this.props.properties,
      unrestrictedShares: this.props.properties.unrestrictedShares,
      restrictedShares: this.props.properties.restrictedShares,
      vestedOptions: this.props.properties.vestedOptions,
      unVestedOptions: this.props.properties.unVestedOptions,
      printType: this.props.properties.printType,
      shareholdingsDetails: this.props.properties.ShareholdingsCol,
      PrintDom: "",
      EndDayDate: this.props.properties.EndDayDate,
    };
  }

  public componentDidMount() {
    if (this.props.properties.ShareholdingsCol !== undefined) {
      let e = this.state.shareholdingsDetails;
      let printType = this.state.printType;
      let _html = (
        <React.Fragment>
          <div className="container">
            <div className="row" style={{clear:"both"}}>&nbsp;</div>
            <div className="row">
              <div className="col-sm-12" style={{marginLeft:"25px"}}>
                <h5 style={{ float: "left", fontSize: "16px" }}>
                  Shareholder Name : {this.state.shareholdingsDetails.Title}
                </h5>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12" style={{marginLeft:"25px"}}>
                <h5 style={{ float: "left", fontSize: "16px" }}>
                  Shareholder Acct ID :{" "}
                  {this.state.shareholdingsDetails.shareholderID}
                </h5>
              </div>
            </div>
            <div className="row" style={{clear:"both"}}>&nbsp;</div>
            <div className="row">
              <div className="col-md-12">
                <table className="table table-bordered table-sm">
                  <thead>
                    <tr className="red">
                      <th
                        colSpan={6}
                        style={{
                          background: "#f2dcdb",
                          textAlign: "center",
                          fontSize: "20px",
                        }}
                      >
                        SUMMARY OF HOLDINGS
                      </th>
                    </tr>
                    <tr>
                      <th
                        colSpan={3}
                        style={{
                          background: "#f2dcdb",
                          textAlign: "center",
                          fontSize: "20px",
                        }}
                      >
                        STOCK
                      </th>
                      <th
                        colSpan={3}
                        style={{
                          background: "#f2dcdb",
                          textAlign: "center",
                          fontSize: "20px",
                        }}
                      >
                        OPTIONS{" "}
                      </th>
                    </tr>
                    <tr>
                      <th
                        style={{
                          background: "#f2dcdb",
                          textAlign: "center",
                          WebkitBackgroundOrigin: "exact",
                        }}
                      >
                        Unrestricted Shares
                      </th>
                      <th
                        style={{
                          background: "#f2dcdb",
                          textAlign: "center",
                          WebkitBackgroundOrigin: "exact",
                        }}
                      >
                        Restricted Shares
                      </th>
                      <th
                        style={{
                          background: "#f2dcdb",
                          textAlign: "center",
                          WebkitBackgroundOrigin: "exact",
                        }}
                      >
                        Total Shares
                      </th>
                      <th
                        style={{
                          background: "#f2dcdb",
                          textAlign: "center",
                          WebkitBackgroundOrigin: "exact",
                        }}
                      >
                        Vested Options
                      </th>
                      <th
                        style={{
                          background: "#f2dcdb",
                          textAlign: "center",
                          WebkitBackgroundOrigin: "exact",
                        }}
                      >
                        Unvested Options
                      </th>
                      <th
                        style={{
                          background: "#f2dcdb",
                          textAlign: "center",
                          WebkitBackgroundOrigin: "exact",
                        }}
                      >
                        Total Options
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr key={"01"}>
                      <td style={{ textAlign: "center" }}>
                        {this.state.shareholdingsDetails.unrestrictedShares.toLocaleString(
                          undefined,
                          { minimumFractionDigits: 2 }
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {this.state.shareholdingsDetails.restrictedShares.toLocaleString(
                          undefined,
                          { minimumFractionDigits: 2 }
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {(
                          this.state.shareholdingsDetails.unrestrictedShares +
                          this.state.shareholdingsDetails.restrictedShares
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {this.state.shareholdingsDetails.vestedOptions.toLocaleString(
                          undefined,
                          { minimumFractionDigits: 2 }
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {this.state.shareholdingsDetails.unvestedOptions.toLocaleString(
                          undefined,
                          { minimumFractionDigits: 2 }
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {(
                          this.state.shareholdingsDetails.vestedOptions +
                          this.state.shareholdingsDetails.unvestedOptions
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="row" style={{clear:"both"}}>&nbsp;</div>
          </div>
        </React.Fragment>
      );
      this.printDOMHTML(printType, _html);
    }
  }

  public header = () => {
    if (this.props.properties.EndDayDate !== undefined) {
      let _html = (
        <React.Fragment>
          <div className="col-sm-12">
            <img
              src={wawaLogo}
              style={{ display: " block", margin: "auto", padding: "10px" }}
            />
          </div>
          <div className="col-sm-12">
            <h2
              style={{
                display: "block",
                margin: "auto",
                textAlign: "center",
                padding: "10px",
              }}
            >
              <span className="A1c">
                S-Corp Shareholder Equity Holdings Statement
              </span>
            </h2>
          </div>
          <div className="col-sm-12">
            <h2
              style={{
                display: "block",
                margin: "auto",
                textAlign: "center",
                padding: "10px",
              }}
            >
              <span className="A1c">
                As of End of Day{" "}
                <Moment format="MMMM Do, YYYY">
                  {this.state.EndDayDate}
                </Moment>{" "}
              </span>
            </h2>
          </div>
        </React.Fragment>
      );
      return _html;
    }
  }

  public foolter = () => {
    let _html = (
      <React.Fragment>
        <div className="col-sm-12">
          <h4>**TAX BASIS NOTES</h4>
        </div>
        <div className="col-sm-12">
          <h5 style={{ fontSize: "15px" }}>
            Wawa provides Tax Basis amounts for the benefit of its shareholders,
            using methods applied in accordance with the Internal Revenue Code
            and related Regulations for S-Corporations. Shareholders are
            responsible for reviewing the Tax Basis amounts presented with their
            tax advisors and must contact the Shareholder Services Office with
            any questions regarding the amounts.
            <br />
            <br />
            Under the S-Corporation structure, Tax Basis changes based on the
            daily allocation of income, application of tax credits and other tax
            adjustments, the number of shares outstanding each day, and the
            payment of Tax Distributions and Traditional Dividends. With such
            variability in Tax Basis, Wawa is unable to provide "current" Tax
            Basis amounts during the current fiscal year, as several of these
            components are estimated until the fiscal year has ended and all tax
            returns and Form K-1s have been prepared. This statement presents
            Tax Basis for shares in the following manner:
            <br />
            <br />
            Tax Basis amounts for shares held at the beginning of the fiscal
            year reflect the Tax Basis as of the end of the prior fiscal year,
            after all prior year tax returns and Form K-1s have been prepared.
            <br />
            <br />
            Tax Basis amounts for shares first acquired during the current
            fiscal year reflect the initial Tax Basis for the shares acquired,
            as of the date acquired. In these situations, the Tax Basis will
            equal the Acquisition/Historical Cost of the shares until the Tax
            Basis is updated for the current fiscal year activity.
            <br />
            <br />
            The Tax Basis amounts for shares received via an exchange, by gift
            or as the remainder of a certificate previously held by this or
            another shareholder, reflect the Tax Basis of the originating
            share(s) ("carryforward basis"), in accordance with the two
            preceding paragraphs.
            <br />
          </h5>
        </div>
        <div className="col-sm-12">
          <h5 style={{ fontSize: "15px", textAlign: "center" }}>
            Shareholder Services Office 260 W. Baltimore Pike, Wawa, PA
            19063-5620
          </h5>
        </div>
        <div className="col-sm-12">
          <h5 style={{ fontSize: "15px", textAlign: "center" }}>
            P: 484-840-1813 / F: 610-558-6759 / ShareholderServices@Wawa.com
          </h5>
        </div>
      </React.Fragment>
    );
    return _html;
  }

  public printDOMHTML = (printType, ht) => {
    let html;
    if (printType) {
      switch (printType) {
        case "unrestrictedShares":
          html = (
            <React.Fragment>
              <div className="col-sm-12">{ht}</div>
              <div className="col-sm-12">
                <UnRestrictedShares
                  properties={{
                    unrestrictedShares: this.state.unrestrictedShares,
                  }}
                />
              </div>
            </React.Fragment>
          );
          this.setState({
            PrintDom: html,
          });
          break;
        case "restrictedShares":
          html = (
            <React.Fragment>
              <div className="col-sm-12">{ht}</div>
              <div className="col-sm-12">
                <RestrictedShares
                  properties={{
                    restrictedShares: this.state.restrictedShares,
                  }}
                />
              </div>
            </React.Fragment>
          );
          this.setState({
            PrintDom: html,
          });
          break;
        case "vestedOptions":
          html = (
            <React.Fragment>
              <div className="col-sm-12">{ht}</div>
              <div className="col-sm-12">
                <VestedOption
                  properties={{
                    vestedOptions: this.state.vestedOptions,
                  }}
                />
              </div>
            </React.Fragment>
          );
          this.setState({
            PrintDom: html,
          });
          break;
        case "unVestedOptions":
          html = (
            <React.Fragment>
              <div className="col-sm-12">
                <UnVestedOptions
                  properties={{
                    unVestedOptions: this.state.unVestedOptions,
                  }}
                />
              </div>
            </React.Fragment>
          );
          this.setState({
            PrintDom: html,
          });
          break;
      }
    }
    return html;
  }

  public render(): React.ReactElement<any> {
    return (
      <div className={styles.shareholders}>
        <div className={styles.page}>
          <div className="print">
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-12">{this.header()}</div>
                <div className="row">{this.state.PrintDom}</div>
                <div className="row" style={{ clear: "both" }}>
                  &nbsp;
                </div>
                <div className="row">
                  <div className="col-sm-12">{this.foolter()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// case "All":
//   html = (
//     <React.Fragment>
//       <div className="col-sm-12">{ht}</div>
//       <div className="col-sm-12">
//         <RestrictedShares
//           properties={{
//             restrictedShares: this.state.restrictedShares,
//           }}
//         />
//       </div>
//       <div className="col-sm-12">
//         <UnRestrictedShares
//           properties={{
//             unrestrictedShares: this.state.unrestrictedShares,
//           }}
//         />
//       </div>
//       <div className="col-sm-12">
//         <UnVestedOptions
//           properties={{
//             unVestedOptions: this.state.unVestedOptions,
//           }}
//         />
//       </div>
//       <div className="col-sm-12">
//         <VestedOption
//           properties={{
//             vestedOptions: this.state.vestedOptions,
//           }}
//         />
//       </div>
//     </React.Fragment>
//   );
//   this.setState({
//     PrintDom: html,
//   });
//   break;
