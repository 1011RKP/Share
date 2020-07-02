import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import * as React from "react";
import Moment from "react-moment";
import styles from "../shareholders.module.scss";

export interface UnRestrictedSharesState {
  unrestrictedShares: any[];
  unrestrictedShares_cert: number;
  unrestrictedShares_noofShares: number;
  unrestrictedShares_AcqCostPerShare: number;
  unrestrictedShares_AcqCost: number;
  unrestrictedShares_TotalBeginningTaxBasisPerShare: number;
  unrestrictedShares_TotalBeginningTaxBasis: number;
}

export class UnRestrictedShares extends React.Component<
  any,
  UnRestrictedSharesState
> {
  public constructor(props: any, state: UnRestrictedSharesState) {
    super(props);
    this.state = {
      //properties: this.props.properties,
      unrestrictedShares: this.props.properties.unrestrictedShares,
      unrestrictedShares_cert: null,
      unrestrictedShares_noofShares: null,
      unrestrictedShares_AcqCostPerShare: null,
      unrestrictedShares_AcqCost: null,
      unrestrictedShares_TotalBeginningTaxBasisPerShare: null,
      unrestrictedShares_TotalBeginningTaxBasis: null,
    };
  }

  public componentDidMount() {
    // totalOptions.toLocaleString(undefined, {minimumFractionDigits: 2})
    if (this.state.unrestrictedShares.length > 0) {
      let data = this.state.unrestrictedShares;
      let unrestrictedShares_cert = this.state.unrestrictedShares.length;
      let unrestrictedShares_noofShares = 0;
      let unrestrictedShares_AcqCostPerShare = 0;
      let unrestrictedShares_AcqCost = 0;
      let unrestrictedShares_TotalBeginningTaxBasisPerShare = 0;
      let unrestrictedShares_TotalBeginningTaxBasis = 0;
      for (let index = 0; index < data.length; index++) {
        unrestrictedShares_noofShares += Number(data[index].NoofShares);
        unrestrictedShares_AcqCostPerShare += Number(
          data[index].AcquisitionShare
        );
        unrestrictedShares_AcqCost += Number(data[index].TotalAcquisitionCost);
        unrestrictedShares_TotalBeginningTaxBasisPerShare += Number(
          data[index].BEGINNINGTaxShare
        );
        unrestrictedShares_TotalBeginningTaxBasis += Number(
          data[index].TotalBEGINNINGBasis
        );
      }
      unrestrictedShares_AcqCost = Number(unrestrictedShares_AcqCost);
      unrestrictedShares_AcqCostPerShare =
      unrestrictedShares_AcqCostPerShare / unrestrictedShares_cert;
      unrestrictedShares_TotalBeginningTaxBasisPerShare =
        unrestrictedShares_TotalBeginningTaxBasisPerShare /
        unrestrictedShares_cert;
      unrestrictedShares_TotalBeginningTaxBasis = Number(
        unrestrictedShares_TotalBeginningTaxBasis
      );
      this.setState({
        unrestrictedShares_cert: unrestrictedShares_cert,
        unrestrictedShares_noofShares: unrestrictedShares_noofShares,
        unrestrictedShares_AcqCostPerShare: unrestrictedShares_AcqCostPerShare,
        unrestrictedShares_AcqCost: unrestrictedShares_AcqCost,
        unrestrictedShares_TotalBeginningTaxBasisPerShare: unrestrictedShares_TotalBeginningTaxBasisPerShare,
        unrestrictedShares_TotalBeginningTaxBasis: unrestrictedShares_TotalBeginningTaxBasis,
      });
    }
  }

  public render(): React.ReactElement<any> {
    return (
      <div className={styles.shareholders}>
        <div className="row-fluid">
          <div className="row">
            <div className="col-md-12">
              <div
                className="row-fluid"
                style={{ marginTop: "10px", marginLeft: "5px" }}
              >
                {this.state.unrestrictedShares_TotalBeginningTaxBasis !==
                null ? (
                  <React.Fragment>
                    <table className="table table-bordered table-sm" style={{pageBreakInside:"avoid"}}>
                      <thead style={{ display: "table-header-group" }}>
                        <tr>
                          <th
                            colSpan={8}
                            style={{
                              background: "#C5D9F1",
                              textAlign: "center",
                              fontSize: "20px",
                            }}
                          >
                            Unrestricted Shares
                          </th>
                        </tr>
                        <tr>
                          <th
                            style={{
                              background: "#C5D9F1",
                              textAlign: "center",
                            }}
                          >
                            Certificates
                          </th>
                          <th style={{ textAlign: "center" }}>No of Shares</th>
                          <th style={{ textAlign: "center" }}>
                            Date Issued (Printed)
                          </th>
                          <th style={{ textAlign: "center" }}>
                            Tax Acquisition Date
                          </th>
                          <th style={{ textAlign: "center" }}>
                            Acquisition / Historical Cost Per Share
                          </th>
                          <th style={{ textAlign: "center" }}>
                            Total Acquisition / Historical Cost
                          </th>
                          <th style={{ textAlign: "center" }}>
                            BEGINNING Tax Basis** Per Share
                          </th>
                          <th style={{ textAlign: "center" }}>
                            Total BEGINNING Tax Basis**
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.unrestrictedShares.map((shares, index) => {
                          return (
                            <tr key={"000" + index} style={{pageBreakInside: "avoid"}}>
                              <td
                                style={{
                                  background: "#C5D9F1",
                                  textAlign: "center",
                                }}
                              >
                                {shares.Certificate}
                              </td>
                              <td style={{ textAlign: "center" }}>
                                {shares.NoofShares}
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <Moment format="MM/DD/YYYY">
                                  {shares.DateIssuedPrinted}
                                </Moment>
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <Moment format="MM/DD/YYYY">
                                  {shares.TaxAcquisitionDate}
                                </Moment>
                              </td>
                              <td style={{ textAlign: "center" }}>
                                $ {shares.AcquisitionShare}
                              </td>
                              <td
                                style={{
                                  textAlign: "center",
                                  color: "#dc3545",
                                }}
                              >
                                $ {shares.TotalAcquisitionCost}
                              </td>
                              <td style={{ textAlign: "center" }}>
                                $ {shares.BEGINNINGTaxShare}
                              </td>
                              <td
                                style={{
                                  textAlign: "center",
                                  color: "#dc3545",
                                }}
                              >
                                $ {shares.TotalBEGINNINGBasis}
                              </td>
                            </tr>
                          );
                        })}
                        <tr key={"011"} style={{pageBreakInside: "avoid"}}>
                          <td style={{ textAlign: "center", color: "#dc3545" }}>
                            {this.state.unrestrictedShares_cert}
                          </td>
                          <td style={{ textAlign: "center", color: "#dc3545" }}>
                            {this.state.unrestrictedShares_noofShares.toLocaleString(undefined, {minimumFractionDigits: 2})}
                          </td>
                          <td style={{ textAlign: "center" }}>&nbsp;</td>
                          <td style={{ textAlign: "center" }}>&nbsp;</td>
                          <td style={{ textAlign: "center", color: "#dc3545" }}>
                            ${" "}
                            {this.state.unrestrictedShares_AcqCostPerShare.toLocaleString(undefined, {minimumFractionDigits: 2})}
                          </td>
                          <td style={{ textAlign: "center", color: "#dc3545" }}>
                            ${" "}
                            {this.state.unrestrictedShares_AcqCost.toLocaleString(undefined, {minimumFractionDigits: 2})}
                          </td>
                          <td style={{ textAlign: "center", color: "#dc3545" }}>
                            ${" "}
                            {this.state.unrestrictedShares_TotalBeginningTaxBasisPerShare.toLocaleString(undefined, {minimumFractionDigits: 4})}
                          </td>
                          <td style={{ textAlign: "center", color: "#dc3545" }}>
                            ${" "}
                            {this.state.unrestrictedShares_TotalBeginningTaxBasis.toLocaleString(undefined, {minimumFractionDigits: 2})}
                          </td>
                        </tr>
                        <tr key={"012"} style={{pageBreakInside: "avoid"}}>
                          <td style={{ textAlign: "center" }}>Certificates</td>
                          <td style={{ textAlign: "center" }}>Shares</td>
                          <td style={{ textAlign: "center" }}>&nbsp;</td>
                          <td style={{ textAlign: "center" }}>&nbsp;</td>
                          <td style={{ textAlign: "center" }}>Avg. Cost/Sh.</td>
                          <td style={{ textAlign: "center" }}>Total Cost</td>
                          <td style={{ textAlign: "center" }}>
                            Avg. Basis/Sh.
                          </td>
                          <td style={{ textAlign: "center" }}>
                            Total Tax Basis
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </React.Fragment>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
