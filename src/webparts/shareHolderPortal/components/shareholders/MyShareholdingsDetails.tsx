import AppBar from "@material-ui/core/AppBar";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import * as React from "react";
import { Link } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import { TabPanel } from "../common/common";
import { AccountInformation } from "./AccountInformation";
import { Delegates } from "./Delegates";
import { Documents } from "./Documents";
import { Elections } from "./Elections";
import { EquityHoldings} from "./EquityHoldings/EquityHoldings";
import { OtherInformation } from "./OtherInformation";
import styles from "./shareholders.module.scss";
import { Card, CardContent } from "@material-ui/core";
import * as _ from "lodash";
import { Web } from "@pnp/sp";
export const ComingSoonBanner: any = require("../../images/Coming-Soon-Banner.png");

export class MyShareholdingsDetails extends React.Component<any, any> {
  public constructor(props: any, state: any) {
    super(props);
    // this.a11yProps = this.a11yProps.bind(this);
    // this.tab_handleChange = this.tab_handleChange.bind(this);
    // this.tab_handleChangeIndex = this.tab_handleChangeIndex.bind(this);
    //this.tabs_HTML = this.tabs_HTML.bind(this);
    this.state = {
      setIsOpen: false,
      value: 0,
      setValue: 0,
      generalInfoFrom: [],
      shareHolderForm: [],
      accountInformation: [],
      properties: this.props.properties,
      shareholderID: null,
      shareholderEmail: this.props.properties.accountEmail,
      ShareholdingsCol:[],
      isOptionsExist:[],
      shareholdingName:null,
      pageContext:this.props.properties.pageContext
    };
  }

  public componentDidMount() {
    console.log(this.props.properties.pageContext);
    let params = window.location.hash.substring(
      window.location.hash.lastIndexOf("/") + 1
    );
    if (params) {
      this.setState(
        {
          shareholderID: params
        },
        () => {
          this.getshareholdingName();
        }
      );
    }
  }

  public getshareholdingName = () => {
    let newWeb = new Web(this.state.properties.tenentURL);
    newWeb.lists
      .getByTitle("Shareholdings")
      .items.select(
        "Title",
        "unrestrictedShares",
        "restrictedShares",
        "ShareholderType",
        "vestedOptions",
        "unvestedOptions",
        "shares",
        "options",
        "shareholderID","ShareholderType","shareholderEmail"
      )
      .orderBy("Title", true)
      .top(1)
      .filter("shareholderID eq '" + this.state.shareholderID + "' and shareholderEmail eq '" +  this.state.shareholderEmail +"'")
      .get()
      .then(d => {
        if (d.length > 0) {
          let isOptionsExist = [];
          isOptionsExist =  _.filter(d, (val) => {
            return val.options === "0";
          });
          if (d[0].ShareholderType === "Delegate") {
            this.setState({
              ShareholdingsCol: d[0],
              isDeligate: true,
              shareholdingName: d[0].Title,
              isOptionsExist: isOptionsExist
            });
          } else {
            this.setState({
              ShareholdingsCol: d[0],
              isDeligate: false,
              shareholdingName: d[0].Title,
              isOptionsExist: isOptionsExist
            });
          }
        }
      })
      .catch((e)=>{
        console.log(e);
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
    console.log(this.state);
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

  public handleGeneralInfoChange = data => {
    this.setState({
      generalInfoFrom: data
    });
  }

  public commingSoon = () => {
    let _html = (
      <React.Fragment>
        <div className="container">
          <div className="row">
            <br />
            <br />
            &nbsp;
          </div>
          <div className="row">
            <div className="col-md-10 offset-md-1">
              <img
                src={ComingSoonBanner}
                // src={
                //   this.state.properties.newWeb +
                //   "/SiteAssets/ShareHolders/Coming-Soon-Banner.png"
                // }
                className="img-fluid"
                alt="Responsive image"
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
    return _html;
  }

  public information = () => {
    let _html = (
      <React.Fragment>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-3">
              <Card
                style={{
                  background: "white",
                  borderRadius: "5px",
                  margin: "5px"
                }}
              >
                <CardContent style={{ padding: "8px" }}>
                  <h6
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: "0.85rem"
                    }}
                  >
                    {this.state.ShareholdingsCol.Title}
                  </h6>
                  <h6 style={{ color: "#484848", fontSize: "0.85rem" }}>
                    Account ID:{" "}
                    <span
                      style={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "0.85rem"
                      }}
                    >
                      {this.state.ShareholdingsCol.shareholderID}{" "}
                    </span>
                  </h6>
                  {this.state.isDeligate ? (
                    <h6>
                      <span
                        style={{
                          color: "#fff",
                          fontSize: "0.85rem",
                          background: "#976340",
                          padding:"5px",
                          borderRadius:"5px"
                        }}
                      >
                        {" "}
                        Delegate Access
                      </span>
                    </h6>
                  ) : null}
                </CardContent>
              </Card>
            </div>
            <div className="col-sm-5">&nbsp;</div>
            <div className="col-sm-2">
              {this.state.isOptionsExist.length === 0 ? (
                <React.Fragment>
                  <Card
                    style={{
                      background: "white",
                      borderRadius: "5px",
                      margin: "5px"
                    }}
                  >
                    <CardContent style={{ padding: "8px" }}>
                      <h6 style={{ color: "#484848", fontSize: "0.85rem" }}>
                        Total Options:{" "}
                        <span
                          style={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "0.85rem"
                          }}
                        >
                          {(
                            this.state.ShareholdingsCol.vestedOptions +
                            this.state.ShareholdingsCol.unvestedOptions
                          ).toLocaleString(undefined, {minimumFractionDigits: 2})}{" "}
                        </span>
                      </h6>
                      <h6 style={{ color: "#484848", fontSize: "0.85rem" }}>
                        Vested:{" "}
                        <span
                          style={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "0.85rem"
                          }}
                        >
                          {this.state.ShareholdingsCol.vestedOptions.toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </span>
                      </h6>
                      <h6 style={{ color: "#484848", fontSize: "0.85rem" }}>
                        Unvested:{" "}
                        <span
                          style={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "0.85rem"
                          }}
                        >
                          {this.state.ShareholdingsCol.unvestedOptions.toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </span>
                      </h6>
                    </CardContent>
                  </Card>
                </React.Fragment>
              ) : (
                <React.Fragment>&nbsp;</React.Fragment>
              )}
            </div>
            {this.state.ShareholdingsCol.shares === "0" ? (
              <React.Fragment>
                <div className="col-sm-2">&nbsp;</div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className="col-sm-2">
                  <Card
                    style={{
                      background: "white",
                      borderRadius: "5px",
                      margin: "5px"
                    }}
                  >
                    <CardContent style={{ padding: "8px" }}>
                      <h6 style={{ color: "#484848", fontSize: "0.85rem" }}>
                        Total Shares:{" "}
                        <span
                          style={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "0.85rem"
                          }}
                        >
                          {(
                            this.state.ShareholdingsCol.unrestrictedShares +
                            this.state.ShareholdingsCol.restrictedShares
                          ).toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </span>
                      </h6>
                      <h6 style={{ color: "#484848", fontSize: "0.85rem" }}>
                        Unrestricted:{" "}
                        <span
                          style={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "0.85rem"
                          }}
                        >
                          {this.state.ShareholdingsCol.unrestrictedShares.toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </span>
                      </h6>
                      <h6 style={{ color: "#484848", fontSize: "0.85rem" }}>
                        Restricted:{" "}
                        <span
                          style={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "0.85rem"
                          }}
                        >
                          {this.state.ShareholdingsCol.restrictedShares.toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </span>
                      </h6>
                    </CardContent>
                  </Card>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </React.Fragment>
    );
    return _html;
  }

  public tabs_HTML = () => {
    let commingSoon_HTML = this.commingSoon();
    let information_HTML = this.information();
    let tabs_HTML = (
      <div>
        {this.state.shareholdingName !== undefined &&
        this.state.shareholdingName !== null ? (
          <React.Fragment>
            <AppBar position="static" style={{ background: "#e0e0e0", color: "black" }}>
              {information_HTML}
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

                <Tab label="Account Information" {...this.a11yProps(0)} />
                <Tab label="Equity Holdings" {...this.a11yProps(1)} />
                <Tab label="Elections" {...this.a11yProps(2)} />
                <Tab label="Delegates" {...this.a11yProps(3)} disabled={this.state.isDeligate} />
                <Tab label="Other Information" {...this.a11yProps(4)} />
                <Tab label="Documents" {...this.a11yProps(5)} />
              </Tabs>
            </AppBar>
            <SwipeableViews
              index={this.state.value}
              onChangeIndex={this.tab_handleChangeIndex}
            >
              <TabPanel value={this.state.value} index={0}>
                <AccountInformation
                  properties={{
                    tenentURL: this.state.properties.tenentURL,
                    shareholderID: this.state.shareholderID,
                    shareholdingName: this.state.shareholdingName,
                    shareholderEmail:this.state.shareholderEmail,
                    pageContext:this.state.pageContext
                  }}
                />
              </TabPanel>
              <TabPanel value={this.state.value} index={1}>
              {/* <EquityHoldings
                  properties={{
                    tenentURL: this.state.properties.tenentURL,
                    shareholderID: this.state.shareholderID,
                    shareholdingName: this.state.shareholdingName,
                    shareholdingsDetails: this.state.ShareholdingsCol,
                    isAdmin:false
                  }}
                /> */}
                {commingSoon_HTML}
              </TabPanel>
              <TabPanel value={this.state.value} index={2}>
                <Elections
                  properties={{
                    tenentURL: this.state.properties.tenentURL,
                    shareholderID: this.state.shareholderID,
                    shareholdingName: this.state.shareholdingName,
                    shareholderEmail:this.state.shareholderEmail,
                    pageContext:this.state.pageContext
                  }}
                />
              </TabPanel>
              <TabPanel value={this.state.value} index={3}>
                <Delegates
                  properties={{
                    tenentURL: this.state.properties.tenentURL,
                    shareholderID: this.state.shareholderID,
                    shareholdingName: this.state.shareholdingName,
                    pageContext:this.state.pageContext
                  }}
                />
              </TabPanel>
              <TabPanel value={this.state.value} index={4}>
                <OtherInformation
                  properties={{
                    tenentURL: this.state.properties.tenentURL,
                    shareholderID: this.state.shareholderID,
                    shareholdingName: this.state.shareholdingName
                  }}
                />
              </TabPanel>
              <TabPanel value={this.state.value} index={5}>
                <Documents
                  properties={{
                    tenentURL: this.state.properties.tenentURL,
                    shareholderID: this.state.shareholderID,
                    shareholdingName: this.state.shareholdingName
                  }}
                />
              </TabPanel>
            </SwipeableViews>
          </React.Fragment>
        ) : null}
      </div>
    );
    return tabs_HTML;
  }

  public render(): React.ReactElement<any> {
    return (
      <div className={styles.shareholders}>
        <div className={styles.contentHead}>
          <h2>Shareholding Account Details</h2>
        </div>
        <div style={{ backgroundColor: "white" }}>
          <div
            style={{
              padding: "15px 0px",
              borderBottom: "2px solid #eee"
            }}
          >
            <Link
              style={{
                color: "#dc4848",
                cursor: "pointer",
                padding: "5px;"
              }}
              to="/myShareholdings"
            >
              <KeyboardArrowLeftIcon style={{ fontSize: "2em" }} /> View all
              Shareholdings
            </Link>
            {/* <Switch>
              <Route
                exact
                path="/mainShareholdings"
                component={MainShareholdings}
              />
            </Switch> */}
          </div>
        </div>
        <div>
          {this.state.ShareholdingsCol.length ===  undefined ? this.tabs_HTML() : null}
        </div>
      </div>
    );
  }
}
