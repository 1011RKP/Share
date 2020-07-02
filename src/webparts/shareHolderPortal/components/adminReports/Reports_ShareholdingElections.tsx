import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "core-js/es6/array";
import "core-js/es6/number";
import * as FileSaver from "file-saver";
import * as React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import * as XLSX from "xlsx";
import { ElectionYear } from "../common/common";
import styles from "./AdminReportsHome.module.scss";

export class ReportsShareholdingElections extends React.Component<any, any> {
  public constructor(props: any, state: any) {
    super(props);
    this.exportAsExcelFile = this.exportAsExcelFile.bind(this);
    this.state = {
      data: []
    };
  }

  public fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  public fileExtension = ".xlsx";

  public exportAsExcelFile(e, res, fileName: string): void {
    if (e.preventDefault) e.preventDefault();
    else e.returnValue = false;
    const ws = XLSX.utils.json_to_sheet(res);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array"
    });
    const data = new Blob([excelBuffer], { type: this.fileType });
    FileSaver.saveAs(data, fileName + this.fileExtension);
  }

  public componentDidMount() {
    this.setState({
      data: this.props.data
    });
  }

  public componentWillReceiveProps(props) {
    console.log(props);
    this.setState({ data: props.data });
  }

  public render(): React.ReactElement<any> {
    return (
      <div className={styles.AdminReportsHome}>
        <br />
        <div className="row">
          <ReactTable
            className={styles.reactTable}
            columns={ElectionYear}
            data={this.state.data.electionColl}
            //data={this.state.data.accountInfoCollforTable}
            pageSizeOptions={[20, 30, 50]}
            showPaginationTop={true}
            noDataText={"Please Wait"}
            defaultPageSize={5}
          ></ReactTable>
        </div>
        <br />
        <div className="row" style={{ float: "right", padding: "10px" }}>
          <button
            className="btn btn-success"
            onClick={e =>
              this.exportAsExcelFile(
                e,
                this.state.data.electionColl,
                "Download Account Information"
              )
            }
          >
            <FontAwesomeIcon icon={faDownload} />
            <span> Download Reports</span>
          </button>
        </div>
      </div>
    );
  }
}
