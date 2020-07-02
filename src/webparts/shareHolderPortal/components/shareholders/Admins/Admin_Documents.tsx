import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Link
} from "@material-ui/core";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import { Web } from "@pnp/sp";
import * as React from "react";
import Moment from "react-moment";
import styles from "../shareholders.module.scss";

export class AdminDocuments extends React.Component<any, any> {
  public constructor(props: any, state: any) {
    super(props);
    this.state = {
      properties: this.props.properties,
      AccountID: this.props.properties.AccountID,
      DocCollection: [],
      dividendPaymentType: "Wire Direct Deposit- A",
      taxDistributionPaymentType: "Wire Direct Deposit- A",
      dividendPaymentAccount: null,
      taxDistributionPaymentAccount: null
    };
  }

  public componentWillMount() {
    if (this.state.AccountID !== undefined) {
      this.getAccountInfromation(this.state.AccountID);
    }
  }

  public getAccountInfromation = (id) => {
    if (id) {
      let newWeb = new Web(this.state.properties.tenentURL);
      newWeb.lists
        .getByTitle("Shareholding Documents")
        .items.select(
          "Title",
          "BaseName",
          "EncodedAbsUrl",
          "AccountID",
          "ID",
          "Modified",
          "Created"
        )
        .orderBy("Title", true)
        .filter("AccountID eq '" + id + "'")
        .get()
        .then(d => {
          if (d.length > 0) {
            console.log(d);
            this.setState(prevState => ({
              ...prevState,
              DocCollection: d
            }));
          } else {
            this.setState(prevState => ({
              delegateExist: 0
            }));
          }
        });
    }
  }

  public render(): React.ReactElement<any> {
    return (
      <div className={styles.shareholders}>
        <div className={styles.equityHoldings}>
          <div className="col-lg-12 col-md-12 col-sm-12 col-sx-12">
            <div className="card">
              <div className={`card-body`}>
                <div className={`${styles.cardHead_General} card-header`}>
                  <h6>Shareholding documents</h6>
                </div>
                <div className="row-fluid">
                  <div className="row">&nbsp;</div>
                  <div className="row">
                    <div className="col-md-12">
                      {this.state.DocCollection.length > 0 ? (
                        <Paper>
                          <Table aria-label="simple table">
                            <TableHead className={styles.docTblHead}>
                              <TableRow style={{ color: "#fffff" }}>
                                <TableCell className={styles.docTblCell}>
                                  Document Name
                                </TableCell>
                                <TableCell
                                  className={styles.docTblCell}
                                  align="right"
                                >
                                  Last Modified
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {this.state.DocCollection.map(doc => (
                                <TableRow key={doc.ID}>
                                  <TableCell component="th" scope="doc">
                                    <Link
                                      className={styles.docLink}
                                      // target="_blank"
                                      // href={doc.EncodedAbsUrl}
                                      onClick={()=>{
                                        window.open(doc.EncodedAbsUrl);
                                        return false;
                                      }}
                                      //onClick
                                    >
                                      <PictureAsPdfIcon
                                        className={styles.docPDF}
                                      />
                                      {doc.BaseName}
                                    </Link>
                                    {/* <a
                                      className={styles.docLink}
                                      target="_blank"
                                      href={doc.EncodedAbsUrl}
                                    >
                                      <PictureAsPdfIcon
                                        className={styles.docPDF}
                                      />
                                      {doc.BaseName}
                                    </a> */}
                                  </TableCell>
                                  <TableCell align="right">
                                    <Moment format="MMMM Do, YYYY">
                                      {doc.Created}
                                    </Moment>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Paper>
                      ) : (
                        <div className="alert alert-danger">
                          <h5 style={{ fontSize: "16px" }}>
                            No Documents found on the given account Number{" "}
                            {this.state.AccountID}
                          </h5>
                        </div>
                      )}
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
