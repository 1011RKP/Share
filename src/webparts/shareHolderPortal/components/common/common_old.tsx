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

export const shareholderInputTheam = createMuiTheme({
  overrides: {
    MuiInput: {
      underline: {
        //borderBottom: "1px solid #976340",
        "&:after": {
          borderBottom: "1px solid #976340!important"
        },
        // "&:before": {
        //   borderBottom: "1px solid #976340!important"
        // }
      }
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
        color: "#976340",
        "&$focused": {
          color: "#976340"
        },
        "& .MuiInput-underline:after": {
          borderBottomColor: "#976340"
        }
      }
    }
  }
});

export const CustomSelect = withStyles({
  root: {
    "& label": {
      color: "#976340"
    },
    "& label.Mui-focused": {
      color: "#976340"
    },
    "& .MuiInput-underline": {
      color: "#000"
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#976340"
    },
    "& .MuiInput-underline:hover": {
      borderBottomColor: "#976340"
    },
    "&:before": {
      borderColor: "#976340"
    },
    "&:after": {
      borderColor: "#976340"
    },
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
          borderBottom: "1px solid #976340!important"
        },
        "&:before": {
          borderBottom: "1px solid #976340!important"
        }
      },
      root: {
        color: "black",
        borderColor: "#976340",
        "& after": {
          color: "black",
          borderColor: "#976340"
        },
        "& fieldset": {
          color: "black",
          borderColor: "#976340"
        },
        "& .MuiInput-underline:after": {
          borderBottomColor: "#976340"
        }
      }
    },
    MuiInputLabel: {
      root: {
        cursor: "auto",
        color: "#976340",
        "&$focused": {
          color: "#976340"
        },
        "& .MuiInput-underline:after": {
          borderBottomColor: "#976340"
        }
      }
    }
  },
  palette: {
    primary: {
      light: "#ab8266",
      main: "#976340",
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
      borderColor: "#976340"
    },
    "& .MuiInputBase-input:after": {
      zIndex: 1,
      color: "black",
      borderColor: "#976340"
    },
    "& .MuiInputBase-input:focus": {
      zIndex: 1,
      color: "#976340",
      borderColor: "#976340"
    },
    "& .MuiInputLabel-animated": {
      color: "#976340"
    },
    "& .MuiInputLabel-animated:after": {
      color: "#976340",
      zIndex: -1
    },
    "& .MuiInputLabel-animated:before": {
      color: "#976340",
      zIndex: 1
    },
    "& .MuiInputBase-input:hover": {
      zIndex: 1,
      color: "#976340",
      borderColor: "#976340"
    },
    "& .MuiTextField-root": {
      color: "#976340"
    },
    "& label.MuiTextField-root": {
      color: "#976340"
    },
    "& label.MuiTextField-root:before": {
      color: "#976340",
      zIndex: 1
    },
    "& label.MuiTextField-root:after": {
      color: "#976340",
      zIndex: -1
    },
    "& label.Mui-focused": {
      color: "#976340"
    },
    "& .MuiInput-underline:after": {
      zIndex: 1,
      borderBottomColor: "#976340"
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#976340"
      },
      "&:hover fieldset": {
        borderColor: "#976340"
      },
      "&.Mui-focused fieldset": {
        borderColor: "#976340"
      }
    },
    focused: { color: "#976340" }
  }
})(TextField);

// export const CustomTextField = withStyles({
//   root: {
//     "& .MuiFormControl-root":{
//       zIndex:1
//     },
//     '& .MuiInputBase-input':{
//       // zIndex:-1,
//       color: 'black',
//       borderColor: '#976340',
//     },
//     '& .MuiInputBase-input:after':{
//       color: 'black',
//       borderColor: '#976340',
//     },
//     '& .MuiInputBase-input:focus':{
//       color: '#976340',
//       borderColor: '#976340',
//     },
//     '& .MuiInputLabel-animated':{
//       color: '#976340',
//     },
//     '& .MuiInputLabel-animated:after':{
//       color: '#976340',
//       zIndex:-1
//     },
//     '& .MuiInputLabel-animated:before':{
//       color: '#976340',
//       zIndex:1
//     },
//     '& .MuiInputBase-input:hover':{
//       color: '#976340',
//       borderColor: '#976340',
//     },
//     '& .MuiTextField-root':{
//       color: '#976340'
//     },
//     '& label.MuiTextField-root':{
//       color: '#976340',
//     },
//     '& label.MuiTextField-root:before':{
//       color: '#976340',
//       zIndex:1
//     },
//     '& label.MuiTextField-root:after':{
//       color: '#976340',
//       zIndex:-1
//     },
//     '& label.Mui-focused': {
//       color: '#976340',
//     },
//     '& .MuiInput-underline:after': {
//       zIndex:1,
//       borderBottomColor: '#976340',
//     },
//     '& .MuiOutlinedInput-root': {
//       '& fieldset': {
//         borderColor: '#976340',
//       },
//       '&:hover fieldset': {
//         borderColor: '#976340',
//       },
//       '&.Mui-focused fieldset': {
//         borderColor: '#976340',
//       },
//     },
//     focused: {color: '#976340',},
//   }
// })(TextField);

export const CustomCheckbox = withStyles({
  root: {
    color: "#976340",
    "&$checked": {
      color: "#976340"
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
    color: "#976340",
    "&$checked": {
      color: "#976340"
    }
  },
  disabled: {
    color: '#B2B2B4',
    "&$checked": {
      color: "#B2B2B4"
    }
  },
  checked: {}
})((props: RadioProps) => <Radio color="default" {...props} />);

export const CustomButton = withStyles(({
  root: {
    color:"white",
    backgroundColor: "#976340",
    '&:hover': {
      backgroundColor: "#976340",
    },
    '&$disabled': {
      background: 'rgba(0, 0, 0, 0.12)',
      color: 'black',
      boxShadow: 'none',
    },
  },
  disabled: {
    background: '#B2B2B4',
    color: '#777777',
    boxShadow: 'none',
  },
}))(Button);

export const ErrorButton = withStyles(({
  root: {
    color:"white",
    backgroundColor: "#dc3545",
    '&:hover': {
      backgroundColor: "#dc3545",
    },
  }
}))(Button);


export const SucessButton = withStyles(({
  root: {
    color:"white",
    backgroundColor: "#28a745",
    '&:hover': {
      backgroundColor: "#28a745",
    },
  }
}))(Button);



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
  { Header: "AccountNumber", accessor: "AccountNumber", width: 130 },
  { Header: "Name", accessor: "Name", width: 80 },
  { Header: "PrimaryContact", accessor: "PrimaryContact", width: 80 },
  { Header: "MailingAddressLine1", accessor: "MailingAddressLine1", width: 80 },
  { Header: "MailingAddressLine2", accessor: "MailingAddressLine2", width: 80 },
  { Header: "MailingCity", accessor: "MailingCity", width: 80 },
  { Header: "MailingState", accessor: "MailingState", width: 80 },
  { Header: "MailingZip", accessor: "MailingZip", width: 80 },
  {
    Header: "PriorityMailingMethod",
    accessor: "PriorityMailingMethod",
    width: 50
  },
  {
    Header: "MailingLabelAddressee1",
    accessor: "MailingLabelAddressee1",
    width: 50
  },
  {
    Header: "DocumentMailingAddressLine1",
    accessor: "DocumentMailingAddressLine1",
    width: 50
  },
  {
    Header: "DocumentMailingAddressLine2",
    accessor: "DocumentMailingAddressLine2",
    width: 50
  },
  { Header: "DocumentMailingCity", accessor: "DocumentMailingCity", width: 50 },
  {
    Header: "DocumentMailingState",
    accessor: "DocumentMailingState",
    width: 50
  },
  { Header: "DocumentMailingZip", accessor: "DocumentMailingZip", width: 50 },
  {
    Header: "DocumentPriorityMailingMethod",
    accessor: "DocumentPriorityMailingMethod",
    width: 50
  }
];

export const ElectionYear = [
  { Header: "AccountNumber", accessor: "AccountNumber", width: 150 },
  { Header: "TaxYear", accessor: "TaxYear", width: 150 },
  { Header: "ResidentState", accessor: "ResidentState", width: 150 },
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



// export const outerTheme = createMuiTheme({
//   overrides: {
//     MuiInputBase:{
//       input:{
//         //zIndex:-1
//         "&$after": {
//           zIndex: 1,
//         },
//         "&$before": {
//           zIndex: -1,
//         },
//       }
//     },
//     MuiInput:{
//       underline:{
//         //borderBottom: "2px solid #976340",
//         "&:after": {
//           borderBottom: "1px solid #976340!important"
//         },
//         "&:before": {
//           borderBottom: "1px solid #976340!important"
//         }
//       },
//       root: {
//         color: "black",
//         borderColor: "#976340",
//         "& after": {
//           color: "black",
//           borderColor: "#976340"
//         },
//         "& fieldset": {
//           color: "black",
//           borderColor: "#976340"
//         },
//         "& .MuiInput-underline:after": {
//           borderBottomColor: "#976340"
//         }
//       }
//     },
//     MuiInputLabel: {
//       root: {
//         "&$after": {
//           zIndex: 1,
//         },
//         "&$before": {
//           zIndex: -1,
//         },
//         cursor: "auto",
//         color: "#976340",
//         "&$focused": {
//           color: "#976340"
//         },
//         "& .MuiInput-underline:after": {
//           borderBottomColor: "#976340"
//         },
//       }
//     },
//   },
//   palette: {
//     primary: {
//       light: "#ab8266",
//       main: "#976340",
//       dark: "#69452c",
//       contrastText: "#fff"
//     },
//     secondary: {
//       main: "#cb2030"
//     }
//   }
// });


// export const state_DD = [
//   { key: "Alabama", text: "Alabama" },
//   { key: "Alaska", text: "Alaska" },
//   { key: "Arizona", text: "Arizona" },
//   { key: "Arkansas", text: "Arkansas" },
//   { key: "California", text: "California" },
//   { key: "Colorado", text: "Colorado" },
//   { key: "Connecticut", text: "Connecticut" },
//   { key: "Delaware", text: "Delaware" },
//   { key: "District Of Columbia", text: "District Of Columbia" },
//   { key: "Florida", text: "Florida" },
//   { key: "Georgia", text: "Georgia" },
//   { key: "Hawaii", text: "Hawaii" },
//   { key: "Idaho", text: "Idaho" },
//   { key: "Illinois", text: "Illinois" },
//   { key: "Indiana", text: "Indiana" },
//   { key: "Iowa", text: "Iowa" },
//   { key: "Kansas", text: "Kansas" },
//   { key: "Kentucky", text: "Kentucky" },
//   { key: "Louisiana", text: "Louisiana" },
//   { key: "Maine", text: "Maine" },
//   { key: "Maryland", text: "Maryland" },
//   { key: "Massachusetts", text: "Massachusetts" },
//   { key: "Michigan", text: "Michigan" },
//   { key: "Minnesota", text: "Minnesota" },
//   { key: "Mississippi", text: "Mississippi" },
//   { key: "Missouri", text: "Missouri" },
//   { key: "Montana", text: "Montana" },
//   { key: "Nebraska", text: "Nebraska" },
//   { key: "Nevada", text: "Nevada" },
//   { key: "New Hampshire", text: "New Hampshire" },
//   { key: "New Jersey", text: "New Jersey" },
//   { key: "New Mexico", text: "New Mexico" },
//   { key: "New York", text: "New York" },
//   { key: "North Carolina", text: "North Carolina" },
//   { key: "North Dakota", text: "North Dakota" },
//   { key: "Ohio", text: "Ohio" },
//   { key: "Oklahoma", text: "Oklahoma" },
//   { key: "Oregon", text: "Oregon" },
//   { key: "Pennsylvania", text: "Pennsylvania" },
//   { key: "Rhode Island", text: "Rhode Island" },
//   { key: "South Carolina", text: "South Carolina" },
//   { key: "South Dakota", text: "South Dakota" },
//   { key: "Tennessee", text: "Tennessee" },
//   { key: "Texas", text: "Texas" },
//   { key: "Utah", text: "Utah" },
//   { key: "Vermont", text: "Vermont" },
//   { key: "Virginia", text: "Virginia" },
//   { key: "Washington", text: "Washington" },
//   { key: "West Virginia", text: "West Virginia" },
//   { key: "Wisconsin", text: "Wisconsin" },
//   { key: "Wyoming", text: "Wyoming" }
// ];
