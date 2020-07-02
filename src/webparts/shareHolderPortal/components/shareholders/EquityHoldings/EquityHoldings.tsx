import PrintIcon from "@material-ui/icons/Print";
import { SPComponentLoader } from "@microsoft/sp-loader";
import { Web } from "@pnp/sp";
import * as jQuery from "jquery";
import * as React from "react";
import ReactToPrint from "react-to-print";
import {
  RestrictedButton,
  UnRestrictedButton,
  UnvestedButton,
  VestedButton,
} from "../../common/common";
import styles from "../shareholders.module.scss";
import { Print } from "./Print";
import { RestrictedShares } from "./RestrictedShares";
import { UnRestrictedShares } from "./UnrestrictedShares";
import { UnVestedOptions } from "./UnVestedOptions";
import { VestedOption } from "./VestedOptions";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import Moment from "react-moment";
import { devURL,importURL } from "../../common/common";

//export const devURL = "/sites/Dev_vti_ww_00_9292_spfx/";
SPComponentLoader.loadCss(
  "https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
);
export const wawaLogo: any = require("../../../images/wawa-logo.png");
export const hrefPrint: any = require("../shareholders.module.scss");

export class EquityHoldings extends React.Component<any, any> {
  private printRef = React.createRef<Print>();
  public constructor(props: any, state: any) {
    super(props);
    this.state = {
      properties: this.props.properties,
      shareholderID: this.props.properties.shareholderID,
      tenentURL: this.props.properties.tenentURL,
      shareholdingName: this.props.properties.shareholdingName,
      unrestrictedShares: [],
      restrictedShares: [],
      vestedOptions: [],
      unVestedOptions: [],
      unrestrictedShares_load: false,
      restrictedShares_load: false,
      vestedOptions_load: false,
      unVestedOptions_load: false,
      details_load: false,
      completeLoad: false,
      taxBasisNotes: false,
      importLink:
        this.props.properties.tenentURL.substring(
          0,
          this.props.properties.tenentURL.indexOf("sites/") - 1
        ) + "/sites"+ importURL +"SitePages/EQImport.aspx",
      //this.props.properties.tenentURL + "SitePages/EQImport.aspx",
      isAdmin: this.props.properties.isAdmin,
      shareholdingsDetails: this.props.properties.shareholdingsDetails,
    };
  }

  public componentDidMount() {
    if (this.props.properties !== undefined) {
      this.getUnrestrictedShares(this.props.properties.shareholdingsDetails);
      this.getShareholdings(this.props.properties.shareholdingsDetails);
    }
  }

  public componentWillMount() {
    console.log("Call");
  }

  public getShareholdings = e => {
    let newWeb = new Web(this.state.tenentURL);
    newWeb.lists
      .getByTitle("Shareholdings")
      .items.select(
        "ID",
        "Title",
        "shares",
        "options",
        "shareholderID",
        "shareholderEmail",
        "ShareholderType",
        "unrestrictedShares",
        "restrictedShares",
        "vestedOptions",
        "unvestedOptions"
      )
      .orderBy("shareholderID", true)
      .filter("shareholderID eq '" + this.state.shareholderID + "'")
      .get()
      .then(d => {
        this.setState({
          shareholderName: d[0].Title
        });

      }).catch((e) => {
        console.log(e);
      });
  }


  // public print = () => {
  //   const printContent = document.getElementById("componentID");
  //   const WindowPrt = window.open(
  //     "",
  //     "",
  //     "left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0"
  //   );
  //   // WindowPrt.document.write("@media print {
  //   //   body {-webkit-print-color-adjust: exact;}
  //   //   }";)
  //   // WindowPrt.document.write(
  //   //   '<link rel="stylesheet" href="https://wawashareholderportal.sharepoint.com/sites/dev_vti_ww_00_9292_spfx/SiteAssets/printtest.css" type="text/css" media="print"/>'
  //   // );
  //   WindowPrt.document.write( "<style type=\"text/css\"> .red { background-color: red; background:red ;  } </style>" );

  //   WindowPrt.document.write(
  //     '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" type="text/css" media="print"/>'
  //   );
  //   // WindowPrt.document.write(
  //   //   '<link rel="stylesheet" href="' + hrefPrint  + '" type="text/css" media="print"/>'
  //   // );
  //   WindowPrt.document.write(printContent.innerHTML);
  //   WindowPrt.document.close();
  //   WindowPrt.focus();
  //   WindowPrt.print();
  // }

  public getUnrestrictedShares = (e) => {
    let newWeb = new Web(this.state.tenentURL);
    const shareholderID = this.state.shareholderID;
    const filter = "Title eq " + shareholderID + "'";
    newWeb.lists
      .getByTitle("Equity Holdings Unrestricted Shares")
      .items.select(
        "Title",
        "Certificate",
        "ShareholderName",
        "AcquisitionShare",
        "TotalAcquisitionCost",
        "BEGINNINGTaxShare",
        "TotalBEGINNINGBasis",
        "DateIssuedPrinted",
        "TaxAcquisitionDate",
        "NoofShares",
        "ID",
        "EndDayDate"
      )
      .orderBy("ID", true)
      .filter(filter)
      .get()
      .then((listdata) => {
        this.setState(
          {
            unrestrictedShares: listdata,
            shareholderID: listdata[0].Title,
            shareholdingsDetails: e,
          },
          () => {
            console.log(this.state);
            this.getRestrictedShares();
          }
        );
      })
      .catch((e) => {
        console.log(e);
      });
  }

  public getRestrictedShares = () => {
    let newWeb = new Web(this.state.tenentURL);
    const shareholderID = this.state.shareholderID;
    const filter = "Title eq " + shareholderID + "'";
    newWeb.lists
      .getByTitle("Equity Holdings restricted Shares")
      .items.select(
        "Title",
        "Certificate",
        "ShareholderName",
        "GrantIssueDate",
        "GrantFullyVestedDate",
        "NoofShares",
        "EquityPlan",
        "ID",
        "EndDayDate"
      )
      .orderBy("ID", true)
      .filter(filter)
      .get()
      .then((listdata) => {
        this.setState(
          {
            restrictedShares: listdata,
          },
          () => {
            console.log(this.state.restrictedShares);
            this.getVestedOptions();
          }
        );
      })
      .catch((e) => {
        console.log(e);
      });
  }

  public getVestedOptions = () => {
    let newWeb = new Web(this.state.tenentURL);
    const shareholderID = this.state.shareholderID;
    const filter = "Title eq " + shareholderID + "'";
    newWeb.lists
      .getByTitle("Equity Holdings Vested Options")
      .items.select(
        "Title",
        "GrantID",
        "ShareholderName",
        "EquityPlan",
        "StrikePrice",
        "GrantIssueDate",
        "GrantFullyVestedDate",
        "GrantExpireDate",
        "NoofShares",
        "ID",
        "EndDayDate"
      )
      .orderBy("ID", true)
      .filter(filter)
      .get()
      .then((listdata) => {
        this.setState(
          {
            vestedOptions: listdata,
          },
          () => {
            console.log(this.state.vestedOptions);
            this.getunVestedOptions();
          }
        );
      })
      .catch((e) => {
        console.log(e);
      });
  }

  public getunVestedOptions = () => {
    let newWeb = new Web(this.state.tenentURL);
    const shareholderID = this.state.shareholderID;
    const filter = "Title eq " + shareholderID + "'";
    newWeb.lists
      .getByTitle("Equity Holdings unvested Options")
      .items.select(
        "Title",
        "GrantID",
        "ShareholderName",
        "EquityPlan",
        "StrikePrice",
        "GrantIssueDate",
        "GrantFullyVestedDate",
        "GrantExpireDate",
        "NoofShares",
        "ID",
        "EndDayDate"
      )
      .orderBy("ID", true)
      .filter(filter)
      .get()
      .then((listdata) => {
        this.setState(
          {
            unVestedOptions: listdata,
            completeLoad: true,
          },
          () => {
            console.log(this.state.unVestedOptions);
          }
        );
      })
      .catch((e) => {
        console.log(e);
      });
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
        <br />
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

  public render(): React.ReactElement<any> {
    return (
      <div className={styles.shareholders} style={{ width: "98%" }}>
        <div className="row">
          <div className="col-sm-12">
            {/* unrestrictedShares */}
            {this.state.unrestrictedShares_load !== false ? (
              <React.Fragment>
                {this.state.unrestrictedShares.length > 0 ? (
                  <React.Fragment>
                    <ReactToPrint
                      trigger={() => (
                        <button
                          style={{ float: "right", marginTop: "5px" }}
                          className="btn btn-dark"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <PrintIcon /> Print Unrestricted Shares{" "}
                        </button>
                      )}
                      content={() => this.printRef.current}
                    />
                    <div style={{ display: "none" }} id="unrestrictedShares">
                      <Print
                        ref={this.printRef}
                        properties={{
                          unrestrictedShares: this.state.unrestrictedShares,
                          printType: "unrestrictedShares",
                          ShareholdingsCol: this.state.shareholdingsDetails,
                          EndDayDate: this.state.unrestrictedShares[0]
                            .EndDayDate,
                        }}
                      />
                    </div>
                  </React.Fragment>
                ) : null}
              </React.Fragment>
            ) : (
              false
            )}
            {/* RestrictedShares */}
            {this.state.restrictedShares_load !== false ? (
              <React.Fragment>
                {this.state.restrictedShares.length > 0 ? (
                  <React.Fragment>
                    <ReactToPrint
                      trigger={() => (
                        <button
                          style={{ float: "right", marginTop: "5px" }}
                          className="btn btn-dark"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <PrintIcon /> Print Restricted Shares{" "}
                        </button>
                      )}
                      content={() => this.printRef.current}
                    />
                    <div style={{ display: "none" }} id="restrictedShares">
                      <Print
                        ref={this.printRef}
                        properties={{
                          restrictedShares: this.state.restrictedShares,
                          printType: "restrictedShares",
                          ShareholdingsCol: this.state.shareholdingsDetails,
                          EndDayDate: this.state.restrictedShares[0].EndDayDate,
                        }}
                      />
                    </div>
                  </React.Fragment>
                ) : null}
              </React.Fragment>
            ) : (
              false
            )}
            {/* 3 */}
            {this.state.vestedOptions_load !== false ? (
              <React.Fragment>
                {this.state.vestedOptions.length > 0 ? (
                  <React.Fragment>
                    <ReactToPrint
                      trigger={() => (
                        <button
                          style={{ float: "right", marginTop: "5px" }}
                          className="btn btn-dark"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <PrintIcon /> Print Vested Options{" "}
                        </button>
                      )}
                      content={() => this.printRef.current}
                    />
                    <div style={{ display: "none" }} id="vestedOptions">
                      <Print
                        ref={this.printRef}
                        properties={{
                          vestedOptions: this.state.vestedOptions,
                          printType: "vestedOptions",
                          ShareholdingsCol: this.state.shareholdingsDetails,
                          EndDayDate: this.state.vestedOptions[0].EndDayDate,
                        }}
                      />
                    </div>
                  </React.Fragment>
                ) : null}
              </React.Fragment>
            ) : (
              false
            )}
            {/* 4 */}
            {this.state.unVestedOptions_load !== false ? (
              <React.Fragment>
                {this.state.unVestedOptions.length > 0 ? (
                  <React.Fragment>
                    <ReactToPrint
                      trigger={() => (
                        <button
                          style={{ float: "right", marginTop: "5px" }}
                          className="btn btn-dark"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <PrintIcon /> Print Unvested Options{" "}
                        </button>
                      )}
                      content={() => this.printRef.current}
                    />
                    <div style={{ display: "none" }} id="unVestedOptions">
                      <Print
                        ref={this.printRef}
                        properties={{
                          unVestedOptions: this.state.unVestedOptions,
                          printType: "unVestedOptions",
                          ShareholdingsCol: this.state.shareholdingsDetails,
                          EndDayDate: this.state.unVestedOptions[0].EndDayDate,
                        }}
                      />
                    </div>
                  </React.Fragment>
                ) : null}
              </React.Fragment>
            ) : (
              false
            )}
            {this.state.completeLoad !== false ? (
              <React.Fragment>
                {this.state.isAdmin !== false ? (
                  <React.Fragment>
                    <a
                      style={{
                        float: "left",
                        marginTop: "5px",
                        marginLeft: "5px",
                        color: "white",
                        cursor: "pointer",
                      }}
                      className="btn btn-info"
                      onClick={() => {
                        window.open(this.state.importLink);
                        return false;
                      }}
                      target="_blank"
                    >
                      <ImportExportIcon />
                      Import
                    </a>
                  </React.Fragment>
                ) : null}
                {/* <button
                  style={{ float: "right", marginTop: "5px" }}
                  className="btn btn-danger"
                  onClick={() => this.print()}
                >
                  <PrintIcon /> Print
                </button>
                <div style={{ display: "none" }} id="componentID">
                  <Print
                    ref={this.printRef}
                    properties={{
                      unrestrictedShares: this.state.unrestrictedShares,
                      restrictedShares: this.state.restrictedShares,
                      vestedOptions: this.state.vestedOptions,
                      unVestedOptions: this.state.unVestedOptions,
                      printType: "All",
                      ShareholdingsCol: this.state.shareholdingsDetails,
                    }}
                  />
                </div>
                <ReactToPrint
                  trigger={() => (
                    //e.preventDefault();
                    <a
                      style={{ float: "right", marginTop: "5px" }}
                      className="btn btn-dark"
                      href="#"
                      onClick={(e)=>{
                        e.preventDefault();
                      }}
                    >
                      <PrintIcon /> Print{" "}
                    </a>
                  )}
                  content={() => this.printRef.current}
                />
                <div style={{ display: "none" }}>
                  <Print
                    ref={this.printRef}
                    properties={{
                      unrestrictedShares: this.state.unrestrictedShares,
                      restrictedShares: this.state.restrictedShares,
                      vestedOptions: this.state.vestedOptions,
                      unVestedOptions: this.state.unVestedOptions,
                      printType: "All"
                    }}
                  />
                </div> */}
              </React.Fragment>
            ) : null}
          </div>
          <div className="col-sm-12">
            <img
              src={wawaLogo}
              style={{
                display: " block",
                margin: "auto",
                padding: "10px",
              }}
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
              S-Corp Shareholder Equity Holdings Statement
            </h2>
          </div>
          <div className="col-sm-12">
            <h4 style={{ textAlign: "center" }}>
              As of End of Day{" "}
              {this.state.completeLoad ? (
                <React.Fragment>
                  <Moment format="MMMM Do, YYYY">
                    {this.state.unrestrictedShares[0].EndDayDate}
                  </Moment>
                </React.Fragment>
              ) : null}
            </h4>
          </div>
        </div>
        <div className="row" style={{ padding: "20px" }}>
          <div className="col-sm-2">&nbsp;</div>
          <div className="col-sm-2">
            <UnRestrictedButton
              type="button"
              onClick={(e) => {
                this.setState({
                  details_load: true,
                  taxBasisNotes: true,
                });
                if (this.state.unrestrictedShares_load !== true) {
                  this.setState({
                    restrictedShares_load: false,
                    unrestrictedShares_load: !this.state
                      .unrestrictedShares_load,
                    vestedOptions_load: false,
                    unVestedOptions_load: false,
                  });
                }
              }}
              className={`btn-block`}
              style={{ display: "block", margin: "auto" }}
            >
              Unrestricted Shares
            </UnRestrictedButton>
          </div>
          <div className="col-sm-2">
            <RestrictedButton
              type="button"
              onClick={(e) => {
                this.setState({
                  details_load: true,
                  taxBasisNotes: true,
                });
                if (this.state.restrictedShares_load !== true) {
                  this.setState({
                    restrictedShares_load: !this.state.restrictedShares_load,
                    unrestrictedShares_load: false,
                    vestedOptions_load: false,
                    unVestedOptions_load: false,
                  });
                }
              }}
              className={`btn-block`}
              style={{ display: "block", margin: "auto" }}
            >
              Restricted Shares
            </RestrictedButton>
          </div>
          <div className="col-sm-2">
            <VestedButton
              type="button"
              onClick={(e) => {
                this.setState({
                  details_load: true,
                  taxBasisNotes: true,
                });
                if (this.state.vestedOptions_load !== true) {
                  this.setState({
                    restrictedShares_load: false,
                    unrestrictedShares_load: false,
                    vestedOptions_load: !this.state.vestedOptions_load,
                    unVestedOptions_load: false,
                  });
                }
              }}
              className={`btn-block`}
              style={{ display: "block", margin: "auto" }}
            >
              Vested Shares
            </VestedButton>
          </div>
          <div className="col-sm-2">
            <UnvestedButton
              type="button"
              onClick={(e) => {
                this.setState({
                  details_load: true,
                  taxBasisNotes: true,
                });
                if (this.state.unVestedOptions_load !== true) {
                  this.setState({
                    restrictedShares_load: false,
                    unrestrictedShares_load: false,
                    vestedOptions_load: false,
                    unVestedOptions_load: !this.state.unVestedOptions_load,
                  });
                }
              }}
              className={`btn-block`}
              style={{ display: "block", margin: "auto" }}
            >
              Unvested Shares
            </UnvestedButton>
          </div>
          <div className="col-sm-2">&nbsp;</div>
        </div>
        <React.Fragment>
          {this.state.details_load !== false ? (
            <React.Fragment>
              <div className="row" style={{ padding: "20px" }}>
                <div className="col-sm-12">
                  <h5 style={{ fontSize: "16px" }}>
                    Shareholder Name: {this.state.shareholderName}
                  </h5>
                </div>
                <div className="col-sm-12">
                  <h5 style={{ fontSize: "16px" }}>
                    Shareholder Acct ID: {this.state.shareholderID}
                  </h5>
                </div>
                <div className="col-sm-12">
                  <h4 style={{ textAlign: "center" }}>HOLDINGS DETAILS</h4>{" "}
                </div>
              </div>
            </React.Fragment>
          ) : null}
        </React.Fragment>
        <br />
        <div className="row">
          <div className="col-sm-12">
            {this.state.restrictedShares_load ? (
              <React.Fragment>
                {this.state.restrictedShares.length > 0 ? (
                  <React.Fragment>
                    <RestrictedShares
                      properties={{
                        restrictedShares: this.state.restrictedShares,
                        ShareholdingsCol: this.state.shareholdingsDetails,
                      }}
                    />
                    <br />
                    <div className="row" style={{marginLeft:"5px"}}>
                      <React.Fragment> {this.foolter()}</React.Fragment>
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div className="container">
                      <div className="alert alert-danger">
                        <strong>Info!</strong> Equity Holdings Statement is not
                        avilable for given Shareholder.
                      </div>
                      <div style={{ clear: "both" }}>&nbsp;</div>
                    </div>
                  </React.Fragment>
                )}
              </React.Fragment>
            ) : null}
          </div>
          <div className="col-sm-12">
            {this.state.unrestrictedShares_load ? (
              <React.Fragment>
                {this.state.unrestrictedShares.length > 0 ? (
                  <React.Fragment>
                    <UnRestrictedShares
                      properties={{
                        unrestrictedShares: this.state.unrestrictedShares,
                        ShareholdingsCol: this.state.shareholdingsDetails,
                      }}
                    />
                    <br />
                    <div className="row" style={{marginLeft:"5px"}}>
                      <React.Fragment> {this.foolter()}</React.Fragment>
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div className="container">
                      <div className="alert alert-danger">
                        <strong>Info!</strong> Equity Holdings Statement is not
                        avilable for given Shareholder.
                      </div>
                    </div>
                  </React.Fragment>
                )}
              </React.Fragment>
            ) : null}
          </div>
          <div className="col-sm-12">
            {this.state.vestedOptions_load ? (
              <React.Fragment>
                {this.state.vestedOptions.length > 0 ? (
                  <React.Fragment>
                    <VestedOption
                      properties={{
                        vestedOptions: this.state.vestedOptions,
                        ShareholdingsCol: this.state.shareholdingsDetails,
                      }}
                    />
                    <br />
                    <div className="row" style={{marginLeft:"5px"}}>
                      <React.Fragment> {this.foolter()}</React.Fragment>
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div className="container">
                      <div className="alert alert-danger">
                        <strong>Info!</strong> Equity Holdings Statement is not
                        avilable for given Shareholder.
                      </div>
                    </div>
                  </React.Fragment>
                )}
              </React.Fragment>
            ) : null}
          </div>
          <div className="col-sm-12">
            {this.state.unVestedOptions_load ? (
              <React.Fragment>
                {this.state.unVestedOptions.length > 0 ? (
                  <React.Fragment>
                    <UnVestedOptions
                      properties={{
                        unVestedOptions: this.state.unVestedOptions,
                        ShareholdingsCol: this.state.shareholdingsDetails,
                      }}
                    />
                    <br />
                    <div className="row" style={{marginLeft:"5px"}}>
                      <React.Fragment> {this.foolter()}</React.Fragment>
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div className="container">
                      <div className="alert alert-danger">
                        <strong>Info!</strong> Equity Holdings Statement is not
                        avilable for given Shareholder.
                      </div>
                    </div>
                  </React.Fragment>
                )}
              </React.Fragment>
            ) : null}
          </div>
          {/* <div className="col-sm-12" style={{ marginTop: "10px" }}>
            {this.state.taxBasisNotes !== false ? (
              <React.Fragment>
                {this.state.restrictedShares.length > 0 ? (

                ) : null}
              </React.Fragment>
            ) : null}
          </div> */}
        </div>
      </div>
    );
  }
}
