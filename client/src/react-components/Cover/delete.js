import React from "react";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import { setState } from "statezero";
import { deleteUserCover } from "../../actions/cover";

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const darkTheme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

export default function Delete(props) {
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState("");

  const handleChange = event => {
    setValue(event.target.value);
  };

  const handleClose = () => {
    setState("deleteC", false);
  };

  const handleDelete = () => {
    if (value === props.title) {
      deleteUserCover();
      handleClose();
    } else {
      setError(true);
      setHelperText("Incorrect Title");
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Dialog
        open={true}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          Delete Page
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            To delete, please re-enter the title of the page you'd like
            to delete ({props.title}).
          </DialogContentText>
          <TextField
            autoFocus
            error={error}
            margin="dense"
            id="title"
            label="Page Title"
            helperText={helperText}
            type="title"
            fullWidth
            value={value}
            onChange={handleChange}
            onKeyDown={e => {
              if (e.keyCode === 13) {
                handleDelete();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="default">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
