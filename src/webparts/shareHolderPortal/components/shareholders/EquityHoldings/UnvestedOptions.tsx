import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import * as React from "react";
import Moment from "react-moment";
import styles from "../shareholders.module.scss";

export interface unVestedOptionsState {
  unVestedOptions: any[];
  unVestedOptions_cert: number;
  unVestedOptions_noofShares: number;
}

export class UnVestedOptions extends React.Component<
  any,
  unVestedOptionsState
> {
  public constructor(props: any, state: unVestedOptionsState) {
    super(props);
    this.state = {
      unVestedOptions: this.props.properties.unVestedOptions,
      unVestedOptions_cert: null,
      unVestedOptions_noofShares: null,
    };
  }

  public componentDidMount() {
    if (this.state.unVestedOptions.length > 0) {
      let data = this.state.unVestedOptions;
      let unVestedOptions_cert = this.state.unVestedOptions.length;
      let unVestedOptions_noofShares = 0;
      for (let index = 0; index < data.length; index++) {
        unVestedOptions_noofShares += Number(data[index].NoofShares);
      }
      this.setState({
        unVestedOptions_noofShares: unVestedOptions_noofShares,
        unVestedOptions_cert: unVestedOptions_cert,
      });
    }
  }

  public render(): React.ReactElement<any> {
    return (
      <div className={styles.shareholders}>
        <div className="row-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="row-fluid" style={{ marginTop: "10px", marginLeft:"5px" }}>
                {this.state.unVestedOptions_noofShares !== null ? (
                  <React.Fragment>
                    <table className="table table-bordered table-sm" style={{pageBreakInside:"avoid"}}>
                      <thead style={{display:"table-header-group"}}>
                        <tr>
                          <th
                            colSpan={7}
                            style={{
                              background: "#E4DFEC",
                              textAlign: "center",
                              fontSize:"20px"
                            }}
                          >
                            Unvested Options
                          </th>
                        </tr>
                        <tr>
                          {/* <th align="center">Title</th> */}
                          <th style={{ background: "#E4DFEC", textAlign:"center" }}>
                            Grant ID
                          </th>
                          <th style={{ textAlign:"center"}}>No of Shares</th>
                          <th style={{ textAlign:"center"}}>Grant Issue Date</th>
                          <th style={{ textAlign:"center"}}>Grant Fully Vested Date</th>
                          <th style={{ textAlign:"center"}}>Grant Expire Date</th>
                          <th style={{ textAlign:"center"}}>Strike Price</th>
                          <th style={{ textAlign:"center"}}>Plan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.unVestedOptions.map((shares, index) => {
                          return (
                            <tr key={"000" + index}>
                              <td
                                align="center"
                                style={{ background: "#E4DFEC" }}
                              >
                                {shares.GrantID}
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
                              <td align="center">
                                <Moment format="MM/DD/YYYY">
                                  {shares.GrantExpireDate}
                                </Moment>
                              </td>
                              <td align="center">{shares.StrikePrice}</td>
                              <td align="center">{shares.EquityPlan}</td>
                            </tr>
                          );
                        })}
                        <tr key={"0031"}>
                          <td align="center" style={{ color: "#dc3545" }}>
                            {this.state.unVestedOptions_cert}
                          </td>
                          <td align="center" style={{ color: "#dc3545" }}>
                            {this.state.unVestedOptions_noofShares}
                          </td>
                          <td align="center">&nbsp;</td>
                          <td align="center">&nbsp;</td>
                          <td align="center">&nbsp;</td>
                          <td align="center">&nbsp;</td>
                          <td align="center">&nbsp;</td>
                        </tr>
                        <tr key={"0032"}>
                          <td align="center">Certificates</td>
                          <td align="center">Shares</td>
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
