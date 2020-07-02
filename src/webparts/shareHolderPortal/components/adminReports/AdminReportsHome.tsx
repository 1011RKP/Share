import { AppBar, Button, Select, MenuItem } from "@material-ui/core";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { SPComponentLoader } from "@microsoft/sp-loader";
import { Web } from "@pnp/sp";
import * as React from "react";
import SwipeableViews from "react-swipeable-views";
import { TabPanel } from "../common/common";
import styles from "./AdminReportsHome.module.scss";
import { ReportsShareholdingAccountInformation } from "./Reports_ShareholdingAccountInformation";
import { ReportsShareholdingElections } from "./Reports_ShareholdingElections";
import { ReportsShareholdings } from "./Reports_Shareholdings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import * as _ from "lodash";
export const loading: any = require("../../images/loading.gif");
SPComponentLoader.loadCss(
  "https://wawadev.sharepoint.com/sites/RatnaDev/SiteAssets/ShareHolders/font-awesome.min"
);
import { CustomButton } from "../common/common";
import { elementContains } from "office-ui-fabric-react";


export class AdminReportsHome extends React.Component<any, any> {
  public constructor(props: any, state: any) {
    super(props);
    this.state = {
      value: 0,
      setValue: 0,
      properties: this.props.properties,
      tenentURL: this.props.properties.tenentURL,
      accountInfoCollforTable: [],
      accountInfoCollforExcel: [],
      electionColl: [],
      electionColl_Filter:[],
      shareholdings:[],
      shareholdings_Filter:[],
      loading:true,
      load_AccountInfo: false,
      load_ElectionInfo: false,
      load_Shareholdings:false,
      years_DD: [],
      ele_taxYear: "ALL"
    };
  }

  public getTaxyears = ()=>{
    let newWeb = new Web(this.state.tenentURL);
    newWeb.lists
      .getByTitle("Tax Year")
      .items.select("Title", "ID", "MakeAvilable")
      .orderBy("Title", false)
      .get()
      .then(d => {
        if (d.length > 0) {
          let obj = [];
          obj.push({
            key: "ALL",
            text: "ALL",
            makeAvilabled: "",
          });
          for (let index = 0; index < d.length; index++) {
            obj.push({
              key: d[index].Title,
              text: d[index].Title,
              makeAvilabled: d[index].MakeAvilable
            });
          }
          console.log(obj);
          this.setState({
            years_DD: obj
          });
        }
      });
  }

  public tab_handleChange = (
    event: React.ChangeEvent<{}>,
    newValue: number
  ) => {
    this.setState({
      setValue: newValue,
      value: newValue
    });
  }

  public tab_handleChangeIndex = (index: number) => {
    this.setState({
      setValue: index,
      value: index
    });
  }

  public a11yProps = (index: any) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`
    };
  }

  public onTaxYearChange = (e) =>{
    let year = (this.state.ele_taxYear).toString();
    let fullCol = this.state.electionColl_Filter;
    if (year === "ALL") {
      this.setState({
        electionColl: fullCol,
        load_ElectionInfo: true
      });
    } else {
      let col = _.filter(fullCol, (val) => {
        return val.TaxYear === year;
      });
      if (col.length > 0) {
        this.setState({
          electionColl: col,
          load_ElectionInfo: true
        });
      } else {
        this.setState({
          electionColl: [],
          load_ElectionInfo: false
        });
      }

    }
  }

  public componentDidMount(){
    this.getTaxyears();
    if (this.state.tenentURL !== undefined) {
      this.getAccountInfo();
    }
  }

  public getAccountInfo = () => {
    let newWeb = new Web(this.state.tenentURL);
    newWeb.lists
      .getByTitle("Shareholding Account Details")
      .items.select(
        "Id",
        "Title",
        "shareholdingName",
        "primaryShareholdingContact",
        "shareholdingEmailAddress",
        "shareholdingShortName",
        "phone",
        "phoneType1",
        "phone1",
        "phoneType2",
        "mergerID",
        "ownershipType",
        "trustType",
        "scorpFamily",
        "documentMailingLabelAddressee1",
        "documentMailingLabelAddressee2",
        "documentMailingLabelAddressee3",
        "documentMailingAddressLine1",
        "documentMailingAddressLine2",
        "documentMailingCity",
        "documentMailingState",
        "documentMailingZip",
        "documentMailingPriorityMailingMe",
        "permanentTaxAddressLine1",
        "permanentTaxAddressLine2",
        "permanentTaxCity",
        "permanentTaxState",
        "permanentTaxZip",
        "permanentTaxPriorityMailingMetho",
        "allPaperlessElection",
        "pperlessOwnersReportsElection",
        "paperlessTenderOfferElection",
        "paperlessTaxDistributionElection",
        "paperlessProxyElection",
        "paperlessK1Election",
        "primaryHouseholdMailingAccount"
      )
      .orderBy("Title", true)
      .top(5000)
      .get()
      .then(d => {
        let i = JSON.parse(JSON.stringify(d));
        if (i.length > 0) {
          let excle = [];
          let tbl = [];
          for (let index = 0; index < i.length; index++) {
            let excle1 = {
              Title: i[index].Title,
              shareholdingName: i[index].shareholdingName,
              primaryShareholdingContact: i[index].primaryShareholdingContact,
              shareholdingEmailAddress: i[index].shareholdingEmailAddress,
              shareholdingShortName: i[index].shareholdingShortName,
              phone: i[index].phone,
              phoneType1: i[index].phoneType1,
              phone1: i[index].phone1,
              phoneType2: i[index].phoneType2,
              mergerID: i[index].mergerID,
              ownershipType: i[index].ownershipType,
              trustType: i[index].trustType,
              scorpFamily: i[index].scorpFamily,
              documentMailingLabelAddressee1:
                i[index].documentMailingLabelAddressee1,
              documentMailingLabelAddressee2:
                i[index].documentMailingLabelAddressee2,
              documentMailingLabelAddressee3:
                i[index].documentMailingLabelAddressee3,
              documentMailingAddressLine1: i[index].documentMailingAddressLine1,
              documentMailingAddressLine2: i[index].documentMailingAddressLine2,
              documentMailingCity: i[index].documentMailingCity,
              documentMailingState: i[index].documentMailingState,
              documentMailingZip: i[index].documentMailingZip,
              documentMailingPriorityMailingMethod:
                i[index].documentMailingPriorityMailingMe,
              permanentTaxAddressLine1: i[index].permanentTaxAddressLine1,
              permanentTaxAddressLine2: i[index].permanentTaxAddressLine2,
              permanentTaxCity: i[index].permanentTaxCity,
              permanentTaxState: i[index].permanentTaxState,
              permanentTaxZip: i[index].permanentTaxZip,
              permanentTaxPriorityMailingMethod:
                i[index].permanentTaxPriorityMailingMetho,
              trusteeName: i[index].trusteeName,
              allPaperlessElection: (i[index].allPaperlessElection),
              pperlessOwnersReportsElection:
                i[index].pperlessOwnersReportsElection,
              paperlessTenderOfferElection:
                i[index].paperlessTenderOfferElection,
              paperlessTaxDistributionElection:
                i[index].paperlessTaxDistributionElection,
              paperlessProxyElection: i[index].paperlessProxyElection,
              paperlessK1Election: i[index].paperlessK1Election,
              primaryHouseholdMailingAccount:
                i[index].primaryHouseholdMailingAccount
            };
            excle.push(excle1);
            let tbl1 = {
              Title: i[index].Title,
              shareholdingName: i[index].shareholdingName,
              primaryShareholdingContact: i[index].primaryShareholdingContact,
              shareholdingEmailAddress: i[index].shareholdingEmailAddress,
              shareholdingShortName: i[index].shareholdingShortName,
              //mergerID: i[index].mergerID,
              //ownershipType: i[index].ownershipType,
              trustType: i[index].trustType
              //scorpFamily: i[index].scorpFamily,
            };
            tbl.push(tbl1);
          }
          this.setState(
            {
              accountInfoCollforExcel: excle,
              accountInfoCollforTable: tbl
            },
            () => {
              this.getElectionInfo();
            }
          );
        } else {
        }
      })
      .catch(e => {
        console.log(e);
      });
  }

  public getElectionInfo = () => {
    let newWeb = new Web(this.state.tenentURL);
    newWeb.lists
      .getByTitle("Shareholding Elections")
      .items.select(
        "Title",
        "TaxYear",
        "StateforStateTaxes",
        "Delaware",
        "Maryland",
        "NewJersey",
        "Pennsylvania",
        "Virginia",
        "ID"
      )
      .top(2500)
      .get()
      .then(d => {
        let i = JSON.parse(JSON.stringify(d));
        if (i.length > 0) {
          let excle = [];
          for (let index = 0; index < i.length; index++) {
            let excle1 = {
              Title: i[index].Title,
              TaxYear: i[index].TaxYear,
              ResidentState: i[index].StateforStateTaxes,
              Delaware: i[index].Delaware,
              Maryland: i[index].Maryland,
              NewJersey: i[index].NewJersey,
              Pennsylvania: i[index].Pennsylvania,
              Virginia: i[index].Virginia,
              Florida: i[index].Florida,
            };
            excle.push(excle1);
          }
          this.setState(
            {
              electionColl: excle,
              electionColl_Filter: excle,
            },
            () => {
              this.getShareholdings(newWeb);
            }
          );
        } else {
        }
      })
      .catch(e => {
        console.log(e);
      });
  }

  public getShareholdings = newWeb => {
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
      .filter("ShareholderType eq 'Shareholder'")
      .top(5000)
      .get()
      .then(d => {
        let element = [];
        for (let index = 0; index < d.length; index++) {
          element.push({
            Title:d[index].Title,
            shares:d[index].restrictedShares +d[index].unrestrictedShares,
            options:d[index].vestedOptions +d[index].unvestedOptions,
            shareholderID:d[index].shareholderID,
            shareholderEmail:d[index].shareholderEmail,
            ShareholderType:d[index].ShareholderType,
            unrestrictedShares:d[index].unrestrictedShares,
            restrictedShares:d[index].restrictedShares,
            vestedOptions:d[index].vestedOptions,
            unvestedOptions:d[index].unvestedOptions,
          })
        }
        let unique = []; let isOptionsExist = [];
        unique = _.uniqBy(element, e => {
          return e.shareholderID;
        });
        this.setState({
          shareholdings: unique,
          shareholdings_Filter: unique,
          loading: false,
          //load_Shareholdings:true
        });
        // let i = JSON.parse(JSON.stringify(d));
        // if (i.length > 0) {
        //   let excle = [];
        //   for (let index = 0; index < i.length; index++) {
        //     let excle1 = {
        //       Title: i[index].Title,
        //       TaxYear: i[index].TaxYear,
        //       ResidentState: i[index].StateforStateTaxes,
        //       Delaware: i[index].Delaware,
        //       Maryland: i[index].Maryland,
        //       NewJersey: i[index].NewJersey,
        //       Pennsylvania: i[index].Pennsylvania,
        //       Virginia: i[index].Virginia,
        //       Florida: i[index].Florida
        //     };
        //     excle.push(excle1);
        //   }

        // } else {
        // }
        // this.setState({
        //   shareholdings:d,

        // });
      });
  }

  public render(): React.ReactElement<any> {
    return (
      <div className={styles.AdminReportsHome}>
        <div className={styles.contentHead}>
          <h2>Shareholder Reports</h2>
        </div>
        <div className="row-fluid">
          <div className="row">
            {this.state.loading === false ? (
              <React.Fragment>
                <div className="col-md-12">
                  <AppBar position="static" style={{ background: "#b5bdb2", color: "black" }}>
                    <Tabs
                      value={this.state.value}
                      onChange={this.tab_handleChange}
                      className={styles.tabsStyles}
                      TabIndicatorProps={{
                        style: {
                          backgroundColor: "#275458"
                        }
                      }}
                    >
                      <Tab
                        label="Shareholding Addresses "
                        {...this.a11yProps(0)}
                      />
                      <Tab
                        label="Composite Elections by Year"
                        {...this.a11yProps(1)}
                      />
                    <Tab
                        label="Shareholding Information"
                        {...this.a11yProps(2)}
                      />
                    </Tabs>
                  </AppBar>
                  <SwipeableViews
                    index={this.state.value}
                    onChangeIndex={this.tab_handleChangeIndex}
                  >
                    <TabPanel value={this.state.value} index={0}>
                      <div className="container">
                        <br />
                        <div className="alert alert-dark">
                          <strong>Reports!</strong>This Report displays
                          Shareholding Addresses
                        </div>
                        <div
                          className="alert"
                          style={{ padding: "0px", float: "right" }}
                        >
                          <CustomButton
                            variant="contained"
                            color="primary"
                            onClick={e => {
                              this.setState({
                                load_AccountInfo: true
                                //Is_ElectionInfo: false
                              });
                            }}
                          >
                            <FontAwesomeIcon
                              style={{ marginRight: "3px" }}
                              icon={faFileExcel}
                            />{" "}
                            Generate Reports
                          </CustomButton>
                          <br />
                        </div>
                        <div className="row-fluid">
                          {this.state.load_AccountInfo !== false ? (
                            <ReportsShareholdingAccountInformation
                              data={{
                                accountInfoCollforExcel: this.state
                                  .accountInfoCollforExcel,
                                accountInfoCollforTable: this.state
                                  .accountInfoCollforTable
                              }}
                            />
                          ) : null}
                        </div>
                      </div>
                    </TabPanel>
                    <TabPanel value={this.state.value} index={1}>
                      <div className="container">
                        <br />
                        <div className="row alert alert-dark">
                          <strong>Reports!</strong>This Report displays
                          Composite Election by Year{"  "}
                          <Select
                            name="ele_taxYear"
                            value={this.state.ele_taxYear}
                            onChange={e =>
                              this.setState({
                                ele_taxYear: e.target.value
                              })
                            }
                            style={{
                              margin: "-5px 15px 0px 15px"
                            }}
                          >
                            {this.state.years_DD.map(item => {
                              return (
                                <MenuItem key={item.length} value={item.text}>
                                  {item.text}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </div>
                        <div
                          className="row alert"
                          style={{ padding: "0px", float: "right" }}
                        >
                          <CustomButton
                            variant="contained"
                            color="primary"
                            onClick={e => {
                              this.onTaxYearChange(e);
                            }}
                          >
                            <FontAwesomeIcon
                              style={{ marginRight: "3px" }}
                              icon={faFileExcel}
                            />
                            {"  "}
                            Generate Reports
                          </CustomButton>
                          <br />
                        </div>
                        <div className="row">
                          {this.state.load_ElectionInfo !== false ? (
                            <ReportsShareholdingElections
                              data={{
                                electionColl: this.state.electionColl
                              }}
                            />
                          ) : this.state.electionColl.length === 0 ? (
                            <React.Fragment>
                              <div className="row-fluid">
                                <div className="alert alert-danger">
                                  <strong>Alert!</strong> Sorry Unable to find
                                  the Election Details with selected Year
                                </div>
                              </div>
                            </React.Fragment>
                          ) : null}
                        </div>
                      </div>
                    </TabPanel>
                    <TabPanel value={this.state.value} index={2}>
                      <div className="container">
                        <br />
                        <div className="row alert alert-dark">
                          <strong>Reports!</strong>This Report displays
                          all Shareholdings
                        </div>
                        <div
                          className="row alert"
                          style={{ padding: "0px", float: "right" }}
                        >
                          <CustomButton
                            variant="contained"
                            color="primary"
                            onClick={e => {
                              this.setState({
                                load_Shareholdings:true
                              });
                            }}
                          >
                            <FontAwesomeIcon
                              style={{ marginRight: "3px" }}
                              icon={faFileExcel}
                            />
                            {"  "}
                            Generate Reports
                          </CustomButton>
                          <br />
                        </div>
                        <div className="row">
                          {this.state.load_Shareholdings !== false ? (
                            <ReportsShareholdings
                              data={{
                                shareholdings: this.state.shareholdings
                              }}
                            />
                          ) : this.state.shareholdings.length === 0 ? (
                            <React.Fragment>
                              <div className="row-fluid">
                                <div className="alert alert-danger">
                                  <strong>Alert!</strong> Sorry Unable to find
                                  the Shareholdings
                                </div>
                              </div>
                            </React.Fragment>
                          ) : null}
                        </div>
                      </div>
                    </TabPanel>
                  </SwipeableViews>
                  <div className="col-md-12">&nbsp;</div>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className="col-sm-12">
                  <img
                    // src={
                    //   this.state.properties.newWeb +
                    //   "/SiteAssets/shareholders/loading.gif"
                    // }
                    src={loading}
                    style={{
                      margin: "auto",
                      display: "block",
                      padding: "10px"
                    }}
                    className="resposive"
                  />
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    );
  }
}
