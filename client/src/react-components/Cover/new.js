import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import { setState, getState } from "statezero";
import { newCover } from "../../actions/cover";

import "./styles.css";

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1)
    }
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  },
  overrides: {
    DialogContentText: {
      root: {
        color: "#00FF00"
      }
    }
  }
}));

const theme = createMuiTheme({
  overrides: {
    MuiInput: {
      underline: {
        "&:before": {
          borderBottom: "1px solid #FFFFFF44"
        },
        "&:hover": {
          borderBottom: "1px solid #FFFFFF88"
        },
        "&:hover:not($disabled):after": {
          borderBottom: "1px solid #FFFFFF"
        },
        "&:hover:not($disabled):before": {
          borderBottom: "1px solid #FFFFFFAA"
        },
        "&:after": {
          borderBottom: "1px solid #FFFFFF44"
        }
      }
    },
    MuiInputLabel: {
      root: {
        color: "#FFFFFFDC",
        "&$focused": {
          color: "#FFFFFF"
        }
      }
    }
  }
});

export default function NewCover() {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");

  const handleChange = event => {
    setName(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = () => {
    setOpen(false);
    console.log(open);

    //Early error detection
    if ((name.length > 12) ^ (name.length < 1)) {
      setState("coverShort", true);
      setTimeout(function() {
        setState("coverShort", false);
      }, 3250);
    } else {
      newCover(name);
    }
  };

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.root}>
        <div className="newCover">
          <Fab color="primary" aria-label="add" onClick={handleClickOpen}>
            <AddIcon />
          </Fab>
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
          PaperProps={{
            style: {
              backgroundColor: "#393939",
              color: "#FFFFFFDE"
            }
          }}
        >
          <DialogTitle id="form-dialog-title">New Page</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <span style={{ color: "#FFFFFFDE" }}>
                To create a new page, please enter the title below.
              </span>
            </DialogContentText>
            <TextField
              value={name}
              onChange={handleChange}
              autoFocus
              margin="dense"
              id="name"
              label="Title"
              type="text"
              fullWidth
              InputProps={{
                style: {
                  color: "#FFFFFFDE"
                }
              }}
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  handleCreate();
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              color="secondary"
              fullWidth="true"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              color="primary"
              fullWidth="true"
              variant="contained"
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </MuiThemeProvider>
  );
}