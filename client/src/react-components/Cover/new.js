import { useState, useEffect } from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { setState, useAppStore } from "../../store";
import { newCover } from "../../actions/cover";
import { autoHide } from "../../actions/helpers";

import "./styles.css";

export default function NewCover() {
  const externalOpen = useAppStore(s => s.newCover);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (externalOpen) {
      setOpen(true);
      setState("newCover", false);
    }
  }, [externalOpen]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setName("");
    setOpen(false);
  };

  const handleCreate = () => {
    if (name.length < 1 || name.length > 200) {
      setState("coverShort", true);
      autoHide("coverShort");
    } else {
      newCover(name);
    }
    handleClose();
  };

  return (
    <>
      <div className="newCover">
        <Fab color="primary" aria-label="add" onClick={handleClickOpen}>
          <AddIcon />
        </Fab>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="new-dialog-title"
      >
        <DialogTitle id="new-dialog-title">New Page</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a new page, please enter the title below.
          </DialogContentText>
          <TextField
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
            margin="dense"
            id="name"
            label="Title"
            type="text"
            fullWidth
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCreate();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreate} color="primary" variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
