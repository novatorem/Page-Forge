import React from "react";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Divider from "@material-ui/core/Divider";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import TableContainer from "@material-ui/core/TableContainer";
import DialogContentText from "@material-ui/core/DialogContentText";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import { setState } from "statezero";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

function createData(name, text, symbol, comment) {
  return { name, text, symbol, comment };
}

const rows = [
  createData("Input", "{_}", "_____", "Creates an input field"),
  createData(
    "Selector",
    "{.../.../...}",
    "__ ↓",
    "Allows you to select from any number of text"
  ),
  createData(
    "Paragraph Data",
    "{Title|Paragraph Text}",
    "",
    "Fills paragraph data to be picked by a field"
  ),
  createData(
    "Paragraph Field",
    "{*}",
    "☰",
    "Creates a paragraph selector to choose a set of data"
  )
];

export default function Info(props) {
  const handleClose = () => {
    setState("info", false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Dialog fullWidth={true} maxWidth="lg" open={true} onClose={handleClose}>
        <DialogTitle id="max-width-dialog-title">Page Forge</DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText>Hi there, {props.currentUser}!</DialogContentText>
          <br /> <br />
          <TableContainer component={Paper}>
            <Table aria-label="info table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Text</TableCell>
                  <TableCell>Symbol</TableCell>
                  <TableCell>Comment</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell>{row.text}</TableCell>
                    <TableCell>{row.symbol}</TableCell>
                    <TableCell>{row.comment}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <br /> <br />
          <Button
            variant="outlined"
            color="default"
            fullWidth
            href="https://github.com/novatorem/Page-Forge"
          >
            GitHub
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
