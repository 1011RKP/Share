import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import * as React from "react";
import Moment from "react-moment";
import styles from "../shareholders.module.scss";

export interface vestedOptionsState {
  vestedOptions: any[];
  vestedOptions_cert: number;
  vestedOptions_noofShares: number;
}

export class VestedOption extends React.Component<any, vestedOptionsState> {
  public constructor(props: any, state: vestedOptionsState) {
    super(props);
    this.state = {
      vestedOptions: this.props.properties.vestedOptions,
      vestedOptions_cert: null,
      vestedOptions_noofShares: null,
    };
  }

  public componentDidMount() {
    if (this.state.vestedOptions.length > 0) {
      let data = this.state.vestedOptions;
      let vestedOptions_cert = this.state.vestedOptions.length;
      let vestedOptions_noofShares = 0;
      for (let index = 0; index < data.length; index++) {
        vestedOptions_noofShares += Number(data[index].NoofShares);
      }
      this.setState({
        vestedOptions_noofShares: vestedOptions_noofShares,
        vestedOptions_cert: vestedOptions_cert,
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
                {this.state.vestedOptions_noofShares !== null ? (
                  <React.Fragment>
                    <table className="table table-bordered table-sm" style={{pageBreakInside:"avoid"}}>
                      <thead style={{ display: "table-header-group" }}>
                        <tr>
                          <th
                            colSpan={7}
                            style={{
                              background: "#D8E4BC",
                              textAlign: "center",
                              fontSize: "20px",
                            }}
                          >
                            Vested Options
                          </th>
                        </tr>
                        <tr>
                          <th
                            style={{
                              background: "#D8E4BC",
                              textAlign: "center",
                            }}
                          >
                            Grant ID
                          </th>
                          <th style={{ textAlign: "center" }}>No of Shares</th>
                          <th style={{ textAlign: "center" }}>
                            Grant Issue Date
                          </th>
                          <th style={{ textAlign: "center" }}>
                            Grant Fully Vested Date
                          </th>
                          <th style={{ textAlign: "center" }}>
                            Grant Expire Date
                          </th>
                          <th style={{ textAlign: "center" }}>Strike Price</th>
                          <th style={{ textAlign: "center" }}>Plan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.vestedOptions.map((shares, index) => {
                          return (
                            <tr key={"000" + index}>
                              <td
                                style={{
                                  textAlign: "center",
                                  background: "#D8E4BC",
                                }}
                              >
                                {shares.GrantID}
                              </td>
                              <td style={{ textAlign: "center" }}>
                                {shares.NoofShares}
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <Moment format="MM/DD/YYYY">
                                  {shares.GrantIssueDate}
                                </Moment>
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <Moment format="MM/DD/YYYY">
                                  {shares.GrantFullyVestedDate}
                                </Moment>
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <Moment format="MM/DD/YYYY">
                                  {shares.GrantExpireDate}
                                </Moment>
                              </td>
                              <td style={{ textAlign: "center" }}>
                                {shares.StrikePrice}
                              </td>
                              <td style={{ textAlign: "center" }}>
                                {shares.EquityPlan}
                              </td>
                            </tr>
                          );
                        })}
                        <tr key={"0031"}>
                          <td style={{ textAlign: "center", color: "#dc3545" }}>
                            {this.state.vestedOptions_cert}
                          </td>
                          <td style={{ textAlign: "center", color: "#dc3545" }}>
                            {this.state.vestedOptions_noofShares}
                          </td>
                          <td align="center">&nbsp;</td>
                          <td align="center">&nbsp;</td>
                          <td align="center">&nbsp;</td>
                          <td align="center">&nbsp;</td>
                          <td align="center">&nbsp;</td>
                        </tr>
                        <tr key={"0032"}>
                          <td style={{ textAlign: "center" }}>Certificates</td>
                          <td style={{ textAlign: "center" }}>Shares</td>
                          <td align="center">&nbsp;</td>
                          <td align="center">&nbsp;</td>
                          <td align="center">&nbsp;</td>
                          <td align="center">&nbsp;</td>
                          <td align="center">&nbsp;</td>
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
