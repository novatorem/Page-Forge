import { useState } from "react";
import PropTypes from "prop-types";
import List from "@mui/material/List";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { blue } from "@mui/material/colors";
import ListItemButton from "@mui/material/ListItemButton";
import SubjectIcon from "@mui/icons-material/Subject";
import Typography from "@mui/material/Typography";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DialogTitle from "@mui/material/DialogTitle";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import "./styles.css";

function SimpleDialog(props) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = value => {
    onClose(value);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">Add a Paragraph</DialogTitle>
      <List>
        {props.paragraphs.map(
          paragraph => {
            paragraph = paragraph[0].substring(1, paragraph[0].length - 1);
            return (
              <ListItemButton
                onClick={() => handleListItemClick(paragraph.split("|")[1])}
                key={paragraph.split("|")[1]}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                    <SubjectIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={paragraph.split("|")[0]} />
              </ListItemButton>
            );
          }
        )}

        <ListItemButton autoFocus onClick={() => handleListItemClick("")}>
          <ListItemAvatar>
            <Avatar>
              <ClearAllIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Clear" />
        </ListItemButton>
      </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired
};

export default function Para(props) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = value => {
    props.paraArr[props.closureCount] = value;
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
      <Typography align="left">{selectedValue}</Typography>
      <br />
      <Grid container justifyContent="center">
        <Button
          variant="outlined"
          aria-label="paragraph"
          onClick={handleClickOpen}
        >
          <SubjectIcon />
        </Button>
      </Grid>

      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        paragraphs={props.paragraphs}
      />
    </div>
  );
}
