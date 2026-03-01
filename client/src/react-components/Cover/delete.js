import { useState, useRef } from "react";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

import { ThemeProvider } from "@mui/material/styles";
import theme from "../../theme";

import { setState } from "../../store";
import { deleteUserCover } from "../../actions/cover";

function PaperComponent(props) {
  const paperRef = useRef(null);
  const drag = useRef({ startX: 0, startY: 0, posX: 0, posY: 0 });

  const handlePointerDown = e => {
    if (!e.target.closest("#delete-dialog-title")) return;
    e.preventDefault();
    drag.current.startX = e.clientX - drag.current.posX;
    drag.current.startY = e.clientY - drag.current.posY;

    const onMove = e => {
      drag.current.posX = e.clientX - drag.current.startX;
      drag.current.posY = e.clientY - drag.current.startY;
      if (paperRef.current) {
        paperRef.current.style.transform =
          `translate(${drag.current.posX}px, ${drag.current.posY}px)`;
      }
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return <Paper ref={paperRef} onPointerDown={handlePointerDown} {...props} />;
}


export default function Delete(props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");

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
    <ThemeProvider theme={theme}>
      <Dialog
        open={true}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title" style={{ cursor: "move" }}>
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
              if (e.key === 'Enter') {
                handleDelete();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
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
