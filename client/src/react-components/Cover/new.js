import { useState } from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import baseTheme from "../../theme";

import { setState } from "../../store";
import { newCover } from "../../actions/cover";
import { autoHide } from "../../actions/helpers";

import "./styles.css";

const theme = createTheme(baseTheme, {
  components: {
    MuiInput: {
      styleOverrides: {
        underline: {
          "&:before": { borderBottom: "1px solid #FFFFFF44" },
          "&:hover": { borderBottom: "1px solid #FFFFFF88" },
          "&:hover:not(.Mui-disabled):after": { borderBottom: "1px solid #FFFFFF" },
          "&:hover:not(.Mui-disabled):before": { borderBottom: "1px solid #FFFFFFAA" },
          "&:after": { borderBottom: "1px solid #FFFFFF44" }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#FFFFFFDC",
          "&.Mui-focused": { color: "#FFFFFF" }
        }
      }
    }
  }
});

export default function NewCover() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

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
    //Early error detection
    if (name.length > 12 || name.length < 1) {
      setState("coverShort", true);
      autoHide("coverShort");
    } else {
      newCover(name);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <>
        <div className="newCover">
          <Fab color="primary" aria-label="add" onClick={handleClickOpen}>
            <AddIcon />
          </Fab>
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">New Page</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To create a new page, please enter the title below.
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
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleCreate();
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              color="secondary"
              fullWidth={true}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              color="primary"
              fullWidth={true}
              variant="contained"
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </ThemeProvider>
  );
}
