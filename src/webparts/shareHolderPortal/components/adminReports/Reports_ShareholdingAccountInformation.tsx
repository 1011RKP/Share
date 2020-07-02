import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "core-js/es6/array";
import "core-js/es6/number";
import * as FileSaver from "file-saver";
import * as React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import * as XLSX from "xlsx";
import { AccountInformation } from "../common/common";
import styles from "./AdminReportsHome.module.scss";
import { CustomButton, SucessButton, ErrorButton } from "../common/common";

export class ReportsShareholdingAccountInformation extends React.Component<
  any,
  any
> {
  public constructor(props: any, state: any) {
    super(props);
    this.exportAsExcelFile = this.exportAsExcelFile.bind(this);
    this.state = {
      data: this.props.data
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
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: this.fileType });
    FileSaver.saveAs(data, fileName + this.fileExtension);
  }

  public componentDidMount() {
    console.log(this.state.data);
  }

  public render(): React.ReactElement<any> {
    return (
      <div className={styles.AdminReportsHome}>
        <br />
        <div className="row">
          <ReactTable
            className={styles.reactTable}
            columns={AccountInformation}
            data={this.state.data.accountInfoCollforExcel}
            //data={this.state.data.accountInfoCollforTable}
            pageSizeOptions={[20, 30, 50]}
            showPaginationTop={true}
            noDataText={"No date avilable"}
            defaultPageSize={5}
          ></ReactTable>
        </div>
        <br />
        <div className="row" style={{ float: "right", padding: "10px" }}>
          <SucessButton
            onClick={e =>
              this.exportAsExcelFile(
                e,
                this.state.data.accountInfoCollforExcel,
                "Download Shareholding Addresses"
              )
            }
          >
            <FontAwesomeIcon icon={faDownload} />{"  "}
            <span style={{marginLeft:"5px"}}> Download Shareholding Addresses</span>
          </SucessButton>
        </div>
      </div>
    );
  }
}

{
  /* <Table aria-label="simple table">
<TableHead>
  <TableRow>
    <TableCell> AccountNumber</TableCell>
    <TableCell> Name</TableCell>
    <TableCell> MailingAddressLine1</TableCell>
    <TableCell> MailingAddressLine2</TableCell>
    <TableCell> MailingCity</TableCell>
    <TableCell> MailingState</TableCell>
    <TableCell> MailingZip</TableCell>
    <TableCell> PriorityMailingMethod</TableCell>
    <TableCell> MailingLabelAddressee1</TableCell>
    <TableCell> DocumentMailingAddressLine1</TableCell>
    <TableCell> DocumentMailingAddressLine2</TableCell>
    <TableCell> DocumentMailingCity</TableCell>
    <TableCell> DocumentMailingState</TableCell>
    <TableCell> DocumentMailingZip</TableCell>
    <TableCell> DocumentPriorityMailingMethod</TableCell>
  </TableRow>
</TableHead>
<TableBody>
<TableRow>
    <TableCell> AccountNumber</TableCell>
    <TableCell> Name</TableCell>
    <TableCell> MailingAddressLine1</TableCell>
    <TableCell> MailingAddressLine2</TableCell>
    <TableCell> MailingCity</TableCell>
    <TableCell> MailingState</TableCell>
    <TableCell> MailingZip</TableCell>
    <TableCell> PriorityMailingMethod</TableCell>
    <TableCell> MailingLabelAddressee1</TableCell>
    <TableCell> DocumentMailingAddressLine1</TableCell>
    <TableCell> DocumentMailingAddressLine2</TableCell>
    <TableCell> DocumentMailingCity</TableCell>
    <TableCell> DocumentMailingState</TableCell>
    <TableCell> DocumentMailingZip</TableCell>
    <TableCell> DocumentPriorityMailingMethod</TableCell>
  </TableRow>
</TableBody>
</Table> */
}
