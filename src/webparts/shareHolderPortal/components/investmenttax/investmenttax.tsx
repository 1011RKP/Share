import * as React from "react";
import styles from "./investmenttax.module.scss";
import LinkIcon from "@material-ui/icons/Link";

export class Investmenttax extends React.Component<any, any> {
  public constructor(props: any, state: any) {
    super(props);
  }

  public render(): React.ReactElement<any> {
    return (
      <div className={styles.investmenttax}>
        <div className={styles.contentHead}>
          <h2>InvestmenTrax</h2>
        </div>
        <div
          className="row-fluid"
          style={{ padding: "20px", overflow: "hidden" }}
        >
          <div className="row" style={{ paddingTop: "10px" }}>
            <div className="col-md-12">
              <div className="card">
                <div className={`card-body`}>
                  <div className={`${styles.cardHead_General} card-header`}>
                    <h6>Documents Folder Structure </h6>
                  </div>
                  <div className="row-fluid">
                    <div className="col-md-12">
                      <div
                        className="alert alert-success"
                        style={{ marginTop: "10px" }}
                      >
                        <a
                          target="_blank"
                          className={styles.accountInfoBtn}
                          href="https://secure.optiontrax.com/investmentrax/shareholderlogin.php"
                        >
                          <LinkIcon fontSize="default" /> Click Here
                        </a>{" "}
                        to navigate InvestmenTrax
                      </div>
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
