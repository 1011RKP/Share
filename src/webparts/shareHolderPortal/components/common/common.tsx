import { Checkbox, Radio, TextField, Button, Select } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { CheckboxProps } from "@material-ui/core/Checkbox";
import ListItem, { ListItemProps } from "@material-ui/core/ListItem";
import { RadioProps } from "@material-ui/core/Radio";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/styles";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { IPivotStyles } from "office-ui-fabric-react";
import * as React from "react";


export const SSOEmail = "shareholderservices@wawashareholderportal.com" ;

export const devURL = "/sites/dev_vti_ww_00_9292_spfx/"; //Prod
export const importURL = "/WawaSP_Dev/"; //Prod

// export const devURL = "/sites/vti_ww_00_9292_spfx_dev/"; //dev
// export const importURL = "/Dev_WawaSP/";//dev

// export const devURL = "/sites/vti_ww_00_9292_spfx_qa/"; //qa
// export const importURL = "/QA_WawaSP/"; //qa


export const shareholderInputTheam = createMuiTheme({
  overrides: {
    MuiFormControl: {
      root: {
        zIndex: 1
      }
    },
    MuiInput: {
      root: {
        "&$disabled": {
          "color": "#B2B2B4"
        }
      },
      underline: {
        //borderBottom: "1px solid #275458",
        "&:after": {
          borderBottom: "1px solid #275458!important"
        }
        // "&:before": {
        //   borderBottom: "1px solid #275458!important"
        // }
      },
      // disabled:{
      //   color: "#B2B2B4"
      // }
    },
    MuiInputLabel: {
      root: {
        "&$after": {
          zIndex: 1
        },
        "&$before": {
          zIndex: -1
        },
        cursor: "auto",
        color: "#275458",
        "&$focused": {
          color: "#275458"
        },
        "& .MuiInput-underline:after": {
          borderBottomColor: "#275458"
        }
      }
    }
  }
});

export const CustomSelect = withStyles({
  root: {
    "& label": {
      color: "#275458"
    },
    "& label.Mui-focused": {
      color: "#275458"
    },
    "& .MuiInput-underline": {
      color: "#000"
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#275458"
    },
    "& .MuiInput-underline:hover": {
      borderBottomColor: "#275458"
    },
    "&:before": {
      borderColor: "#275458"
    },
    "&:after": {
      borderColor: "#275458"
    }
  }
})(Select);

export const outerTheme = createMuiTheme({
  overrides: {
    MuiFormControl: {
      root: {
        zIndex: 1
      }
    },
    MuiInputBase: {
      input: {
        zIndex: -1
      }
    },
    MuiInput: {
      underline: {
        "&:after": {
          borderBottom: "1px solid #275458!important"
        },
        "&:before": {
          borderBottom: "1px solid #275458!important"
        }
      },
      root: {
        color: "black",
        borderColor: "#275458",
        "& after": {
          color: "black",
          borderColor: "#275458"
        },
        "& fieldset": {
          color: "black",
          borderColor: "#275458"
        },
        "& .MuiInput-underline:after": {
          borderBottomColor: "#275458"
        }
      }
    },
    MuiInputLabel: {
      root: {
        cursor: "auto",
        color: "#275458",
        "&$focused": {
          color: "#275458"
        },
        "& .MuiInput-underline:after": {
          borderBottomColor: "#275458"
        }
      }
    }
  },
  palette: {
    primary: {
      light: "#ab8266",
      main: "#275458",
      dark: "#69452c",
      contrastText: "#fff"
    },
    secondary: {
      main: "#cb2030"
    }
  }
});

export const CustomTextField = withStyles({
  root: {
    "& .MuiInputBase-input": {
      zIndex: -1,
      color: "black",
      borderColor: "#275458"
    },
    "& .MuiInputBase-input:after": {
      color: "black",
      borderColor: "#275458"
    },
    "& .MuiInputBase-input:focus": {
      color: "#275458",
      borderColor: "#275458"
    },
    "& .MuiInputLabel-animated": {
      color: "#275458"
    },
    "& .MuiInputLabel-animated:after": {
      color: "#275458",
      zIndex: -1
    },
    "& .MuiInputLabel-animated:before": {
      color: "#275458",
      zIndex: 1
    },
    "& .MuiInputBase-input:hover": {
      color: "#275458",
      borderColor: "#275458"
    },
    "& .MuiTextField-root": {
      color: "#275458"
    },
    "& label.MuiTextField-root": {
      color: "#275458"
    },
    "& label.MuiTextField-root:before": {
      color: "#275458",
      zIndex: 1
    },
    "& label.MuiTextField-root:after": {
      color: "#275458",
      zIndex: -1
    },
    "& label.Mui-focused": {
      color: "#275458"
    },
    "& .MuiInput-underline:after": {
      zIndex: 1,
      borderBottomColor: "#275458"
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#275458"
      },
      "&:hover fieldset": {
        borderColor: "#275458"
      },
      "&.Mui-focused fieldset": {
        borderColor: "#275458"
      }
    },
    focused: { color: "#275458" }
  }
})(TextField);

export const DisbaleTextField = withStyles({
  root: {
    "& .MuiInputBase-input": {
      zIndex: -1,
      borderColor: "#bdbdbf"
    },
    "& .MuiInputBase-input:after": {
      borderColor: "#bdbdbf"
    },
    "& .MuiInputBase-input:focus": {
      color: "#bdbdbf",
      borderColor: "#bdbdbf"
    },
    "& .MuiInputLabel-animated": {
      color: "#bdbdbf"
    },
    "& .MuiInputLabel-animated:after": {
      color: "#bdbdbf",
      zIndex: -1
    },
    "& .MuiInputLabel-animated:before": {
      color: "#bdbdbf",
      zIndex: 1
    },
    "& .MuiInputBase-input:hover": {
      color: "#bdbdbf",
      borderColor: "#bdbdbf"
    },
    "& .MuiTextField-root": {
      color: "#bdbdbf"
    },
    "& label.MuiTextField-root": {
      color: "#bdbdbf"
    },
    "& label.MuiTextField-root:before": {
      color: "#bdbdbf",
      zIndex: 1
    },
    "& label.MuiTextField-root:after": {
      color: "#bdbdbf",
      zIndex: -1
    },
    "& label.Mui-focused": {
      color: "#bdbdbf"
    },
    "& .MuiInput-underline:after": {
      zIndex: 1,
      borderBottomColor: "#bdbdbf"
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#bdbdbf"
      },
      "&:hover fieldset": {
        borderColor: "#bdbdbf"
      },
      "&.Mui-focused fieldset": {
        borderColor: "#bdbdbf"
      }
    },
    focused: { color: "#bdbdbf" }
  }
})(TextField);

export const CustomCheckbox = withStyles({
  root: {
    color: "#275458",
    "&$checked": {
      color: "#275458"
    },
    "&$disabled": {
      color: "#d8c1b1"
    },
    disabled: {}
  },
  checked: {}
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);

export const CustomRadio = withStyles({
  root: {
    color: "#275458",
    "&$checked": {
      color: "#275458"
    }
  },
  disabled: {
    color: "#B2B2B4",
    "&$checked": {
      color: "#B2B2B4"
    }
  },
  checked: {}
})((props: RadioProps) => <Radio color="default" {...props} />);

export const CustomButton = withStyles({
  root: {
    color: "white",
    backgroundColor: "#275458",
    "&:hover": {
      backgroundColor: "#275458"
    },
    "&$disabled": {
      background: "rgba(0, 0, 0, 0.12)",
      color: "black",
      boxShadow: "none"
    }
  },
  disabled: {
    background: "#B2B2B4",
    color: "#777777",
    boxShadow: "none"
  }
})(Button);

export const ErrorButton = withStyles({
  root: {
    color: "white",
    backgroundColor: "#dc3545",
    "&:hover": {
      backgroundColor: "#dc3545"
    }
  }
})(Button);

export const SucessButton = withStyles({
  root: {
    color: "white",
    backgroundColor: "#28a745",
    "&:hover": {
      backgroundColor: "#28a745"
    }
  }
})(Button);

export interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

export const options = [
  "Create a merge commit",
  "Squash and merge",
  "Rebase and merge"
];

export const MDAGroup = [
  { key: "NA", text: "-- Please Select MDA Group --" },
  { key: "WoodPurple", text: "WoodPurple" },
  { key: "WoodYellow", text: "WoodYellow" },
  { key: "WoodBlue", text: "WoodBlue" },
  { key: "WoodGreen", text: "WoodGreen" },
  { key: "WoodFamily", text: "WoodFamily" },
  { key: "ESOP", text: "ESOP" },
  { key: "EMPBD", text: "EMPBD" },
  { key: "Other", text: "Other" }
];

export const ProxyGroup = [
  { key: "NA", text: "-- Please Select Proxy Group --" },
  { key: "BD", text: "BD" },
  { key: "EE-BD", text: "EE-BD" },
  { key: "EE-OFF-BD", text: "EE-OFF-BD" },
  { key: "EE-OFF", text: "EE-OFF" },
  { key: "EE", text: "EE" },
  { key: "ESOP", text: "ESOP" },
  { key: "OS", text: "OS" }
];

export const CEOGroup = [
  { key: "NA", text: "-- Please Select CEO Group --" },
  { key: "ESOP", text: "ESOP" },
  { key: "WOOD FAM", text: "WOOD FAM" },
  { key: "VP", text: "VP" },
  { key: "BOD", text: "BOD" },
  { key: "DIR", text: "DIR" },
  { key: "N-W FAM", text: "N-W FAM" },
  { key: "FORMER EE", text: "FORMER EE" },
  { key: "OTH", text: "OTH" }
];

export const AccountInformation = [
  {
    Header: "Shareholding ID",
    accessor: "Title",
    width: 130
  },
  {
    Header: "Shareholding Name",
    accessor: "shareholdingName",
    width: 220
  },
  {
    Header: "Primary Shareholding Contact",
    accessor: "primaryShareholdingContact",
    width: 200
  },
  {
    Header: "Shareholding Email Address",
    accessor: "shareholdingEmailAddress",
    width: 200
  },
  {
    Header: "Shareholding Short Name",
    accessor: "shareholdingShortName",
    width: 150
  },
  // {
  //   Header: "Merger ID",
  //   accessor: "mergerID",
  //   width: 130
  // },
  // {
  //   Header: "Ownership Type",
  //   accessor: "ownershipType",
  //   width: 130
  // },
  // {
  //   Header: "Trust Type",
  //   accessor: "trustType",
  //   width: 130
  // },
  {
    Header: "Scorp Family",
    accessor: "scorpFamily",
    width: 160
  }
];

export const Shareholdings = [
  {
    Header: "Shareholding ID",
    accessor: "shareholderID",
    width: 150
  },
  {
    Header: "Shareholding Name",
    accessor: "Title",
    width: 250
  },
  {
    Header: "Shareholder Email",
    accessor: "shareholderEmail",
    width: 280
  },
  {
    Header: "Total Shares",
    accessor: "shares",
    width: 200
  },
  {
    Header: "Total Options",
    accessor: "options",
    width: 200
  }
];


export const ElectionYear = [
  { Header: "Shareholding ID", accessor: "Title", width: 150 },
  { Header: "Tax Year", accessor: "TaxYear", width: 150 },
  { Header: "Resident State", accessor: "ResidentState", width: 150 },
  { Header: "Delaware", accessor: "Delaware", width: 100 },
  { Header: "Maryland", accessor: "Maryland", width: 100 },
  { Header: "NewJersey", accessor: "NewJersey", width: 100 },
  { Header: "Pennsylvania", accessor: "Pennsylvania", width: 125 },
  { Header: "Virginia", accessor: "Virginia", width: 100 },
  { Header: "Florida", accessor: "Florida", width: 100 }
];

export const Transition = React.forwardRef<any, TransitionProps>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box>{children}</Box>
    </Typography>
  );
}

export function ListItemLink(props: ListItemProps<"a", { button?: true }>) {
  return <ListItem button component="a" {...props} />;
}

export interface IDialogBasicExampleState {
  hideDialog: boolean;
}

export const priorityMailingMethod = [
  { key: "NA", text: "-- Please Mailing Method --" },
  { key: "USPS", text: "USPS" },
  { key: "UPS", text: "UPS" },
  { key: "InterOffice", text: "InterOffice" }
];

export const state_DD = [
  { key: "NA", text: "-- Please Select State --" },
  { key: "AL", text: "Alabama" },
  { key: "Ak", text: "Alaska" },
  { key: "AZ", text: "Arizona" },
  { key: "AR", text: "Arkansas" },
  { key: "CA", text: "California" },
  { key: "CO", text: "Colorado" },
  { key: "CT", text: "Connecticut" },
  { key: "DE", text: "Delaware" },
  { key: "DC", text: "District Of Columbia" },
  { key: "FL", text: "Florida" },
  { key: "GA", text: "Georgia" },
  { key: "HI", text: "Hawaii" },
  { key: "ID", text: "Idaho" },
  { key: "IL", text: "Illinois" },
  { key: "IN", text: "Indiana" },
  { key: "IA", text: "Iowa" },
  { key: "KS", text: "Kansas" },
  { key: "KY", text: "Kentucky" },
  { key: "LA", text: "Louisiana" },
  { key: "MA", text: "Maine" },
  { key: "MD", text: "Maryland" },
  { key: "MA", text: "Massachusetts" },
  { key: "MI", text: "Michigan" },
  { key: "MN", text: "Minnesota" },
  { key: "MS", text: "Mississippi" },
  { key: "MO", text: "Missouri" },
  { key: "MT", text: "Montana" },
  { key: "NE", text: "Nebraska" },
  { key: "NV", text: "Nevada" },
  { key: "NH", text: "New Hampshire" },
  { key: "NJ", text: "New Jersey" },
  { key: "NM", text: "New Mexico" },
  { key: "NY", text: "New York" },
  { key: "NC", text: "North Carolina" },
  { key: "ND", text: "North Dakota" },
  { key: "OH", text: "Ohio" },
  { key: "OK", text: "Oklahoma" },
  { key: "OR", text: "Oregon" },
  { key: "PA", text: "Pennsylvania" },
  { key: "RI", text: "Rhode Island" },
  { key: "SC", text: "South Carolina" },
  { key: "SD", text: "South Dakota" },
  { key: "TN", text: "Tennessee" },
  { key: "TX", text: "Texas" },
  { key: "UT", text: "Utah" },
  { key: "VT", text: "Vermont" },
  { key: "VA", text: "Virginia" },
  { key: "WA", text: "Washington" },
  { key: "WV", text: "West Virginia" },
  { key: "WI", text: "Wisconsin" },
  { key: "WY", text: "Wyoming" },
  { key: "Other", text: "Other" }
];

export const PivotStyles: IPivotStyles = {
  linkContent: {},
  text: {},
  count: {},
  icon: {},
  linkIsSelected: {
    backgroundColor: "#246094",
    borderBottom: "-2px solid #246094!important",
    color: "white",
    selectors: {
      "&:before": {
        borderBottom: "none!important"
      }
    }
  },
  link: {
    selectors: {
      "&:active": {
        backgroundColor: "#246094",
        color: "white!important"
      }
    }
  },
  root: {
    backgroundColor: "#ebeff3!important",
    selectors: {
      "&:after": {
        backgroundColor: "#ebeff3!important"
      },
      "&:before": {
        backgroundColor: "#ebeff3!important"
      }
    }
  }
};

export const DocumentsColumns = [
  {
    Header: "Name",
    accessor: "Name"
    //sortable: false
  },
  {
    Header: "Last Modified",
    accessor: "LastModified"
  }
];

export const Documents = [
  {
    Name: "Wawa Tax Distribution Statement 2019-09-150920.pdf",
    LastModified: "Sep 6, 2019"
  },
  {
    Name: "Wawa Tax Distribution Statement 2019-06-150920.pdf",
    LastModified: "Jun 6, 2019"
  },
  {
    Name: "Equity-Stock Holdings Statement-150920.pdf",
    LastModified: "Apr 29, 2019"
  },
  {
    Name: "2018 Wawa Shares Basis Letter-150920.pdf",
    LastModified: "Apr 8, 2019"
  },
  {
    Name: "2019 Proxy Ballot-150920.pdf",
    LastModified: "Apr 5, 2019"
  },
  {
    Name: "Wawa Tax Distribution Statement 2019-04-150920.pdf",
    LastModified: "Apr 4, 2019"
  },
  {
    Name: "Wawa, Inc. ESOP Stock Register-150920.pdf",
    LastModified: "Apr 2, 2019"
  }
];

export const UnRestrictedButton = withStyles({
  root: {
    color: "black",
    backgroundColor: "#C5D9F1",
    "&:hover": {
      backgroundColor: "#C5D9F1"
    },
    "&$disabled": {
      background: "rgba(0, 0, 0, 0.12)",
      color: "black",
      boxShadow: "none"
    }
  },
  disabled: {
    background: "#B2B2B4",
    color: "#777777",
    boxShadow: "none"
  }
})(Button);

export const RestrictedButton = withStyles({
  root: {
    color: "black",
    backgroundColor: "#f2dcdb",
    "&:hover": {
      backgroundColor: "#f2dcdb"
    },
    "&$disabled": {
      background: "rgba(0, 0, 0, 0.12)",
      color: "black",
      boxShadow: "none"
    }
  },
  disabled: {
    background: "#B2B2B4",
    color: "#777777",
    boxShadow: "none"
  }
})(Button);

export const VestedButton = withStyles({
  root: {
    color: "black",
    backgroundColor: "#D8E4BC",
    "&:hover": {
      backgroundColor: "#D8E4BC"
    },
    "&$disabled": {
      background: "rgba(0, 0, 0, 0.12)",
      color: "black",
      boxShadow: "none"
    }
  },
  disabled: {
    background: "#B2B2B4",
    color: "#777777",
    boxShadow: "none"
  }
})(Button);

export const UnvestedButton = withStyles({
  root: {
    color: "black",
    backgroundColor: "#E4DFEC",
    "&:hover": {
      backgroundColor: "#E4DFEC"
    },
    "&$disabled": {
      background: "rgba(0, 0, 0, 0.12)",
      color: "black",
      boxShadow: "none"
    }
  },
  disabled: {
    background: "#B2B2B4",
    color: "#777777",
    boxShadow: "none"
  }
})(Button);


