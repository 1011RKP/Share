import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import * as React from "react";
import styles from "../shareholders.module.scss";
import Moment from "react-moment";
import { Print } from "./Print";
import ReactToPrint from "react-to-print";
import PrintIcon from "@material-ui/icons/Print";

export interface RestrictedSharesState {
  restrictedShares: any[];
  restrictedShares_cert: number;
  restrictedShares_noofShares: number;
  shareholdingsDetails:any[];
}

export class RestrictedShares extends React.Component<
  any,
  RestrictedSharesState
> {
  private printRef = React.createRef<Print>();
  public constructor(props: any, state: RestrictedSharesState) {
    super(props);
    this.state = {
      restrictedShares: this.props.properties.restrictedShares,
      shareholdingsDetails: this.props.properties.ShareholdingsCol,
      restrictedShares_cert: null,
      restrictedShares_noofShares: null,
    };
  }

  public componentDidMount() {
    if (this.state.restrictedShares.length > 0) {
      let data = this.state.restrictedShares;
      let restrictedShares_cert = this.state.restrictedShares.length;
      let restrictedShares_noofShares = 0;
      for (let index = 0; index < data.length; index++) {
        restrictedShares_noofShares += Number(data[index].NoofShares);
      }
      this.setState({
        restrictedShares_noofShares: restrictedShares_noofShares,
        restrictedShares_cert: restrictedShares_cert,
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
                {this.state.restrictedShares_noofShares !== null ? (
                  <React.Fragment>
                    <table
                      className="table table-bordered table-sm"
                      style={{ pageBreakInside: "avoid" }}
                    >
                      <thead style={{ display: "table-header-group" }}>
                        <tr>
                          <th
                            colSpan={5}
                            style={{
                              background: "#f2dcdb",
                              textAlign: "center",
                              fontSize: "20px",
                            }}
                          >
                            Restricted Shares
                          </th>
                        </tr>
                        <tr>
                          <th
                            style={{
                              background: "#f2dcdb",
                              textAlign: "center",
                            }}
                          >
                            Certificates
                          </th>
                          <th style={{ textAlign: "center" }}>No of Shares</th>
                          <th style={{ textAlign: "center" }}>
                            Grant Issue Date
                          </th>
                          <th style={{ textAlign: "center" }}>
                            Grant Fully Vested Date
                          </th>
                          <th style={{ textAlign: "center" }}>Equity Plan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.restrictedShares.map((shares, index) => {
                          return (
                            <tr key={"000" + index}>
                              <td
                                align="center"
                                style={{ background: "#f2dcdb" }}
                              >
                                {shares.Certificate}
                              </td>
                              <td align="center">{shares.NoofShares}</td>
                              <td align="center">
                                <Moment format="MM/DD/YYYY">
                                  {shares.GrantIssueDate}
                                </Moment>
                              </td>
                              <td align="center">
                                <Moment format="MM/DD/YYYY">
                                  {shares.GrantFullyVestedDate}
                                </Moment>
                              </td>
                              <td align="center">{shares.EquityPlan}</td>
                            </tr>
                          );
                        })}
                        <tr key={"0021"}>
                          <td align="center" style={{ color: "#dc3545" }}>
                            {this.state.restrictedShares_cert}
                          </td>
                          <td align="center" style={{ color: "#dc3545" }}>
                            {this.state.restrictedShares_noofShares}
                          </td>
                          <td align="center">&nbsp;</td>
                          <td align="center">&nbsp;</td>
                          <td align="center">&nbsp;</td>
                        </tr>
                        <tr key={"0021"}>
                          <td align="center">Certificates</td>
                          <td align="center">Shares</td>
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
