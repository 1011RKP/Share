import {
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Select,
  MenuItem,
  InputLabel
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import SendIcon from "@material-ui/icons/Send";
import * as React from "react";
import styles from "./shareholders.module.scss";

export class EquityHoldings extends React.Component<any, any> {
  public constructor(props: any, state: any) {
    super(props);
    this.state = {
      dividendPaymentType: "Wire Direct Deposit- A",
      taxDistributionPaymentType: "Wire Direct Deposit- A",
      dividendPaymentAccount: null,
      taxDistributionPaymentAccount: null
    };
  }

  public componentWillMount() {
    this.setState({
      dividendPaymentType: "Wire Direct Deposit- A",
      taxDistributionPaymentType: "Wire Direct Deposit- A"
    });
  }

  //   componentDidMount() {}

  //   componentWillReceiveProps(nextProps) {}

  //   shouldComponentUpdate(nextProps, nextState) {}

  //   componentWillUpdate(nextProps, nextState) {}

  //   componentDidUpdate(prevProps, prevState) {}

  //   componentWillUnmount() {}

  public render(): React.ReactElement<any> {
    return (
      <div className={styles.shareholders}>
        <div className={styles.equityHoldings}>
          <div className="col-lg-12 col-md-12 col-sm-12 col-sx-12">
            <div className="card">
              <div className={`card-body`}>
                <div className={`${styles.cardHead_General} card-header`}>
                  <h6>Equity Holdings</h6>
                </div>
                <div className="row-fluid">
                  <div className="row">&nbsp;</div>
                  <div className="row">
                    <div className={`${styles.alignAlert} alert`} role="alert">
                      <p
                        className={`${styles.electionsGeneralText} text-justify`}
                      >
                        Equity Holdings
                      </p>
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
