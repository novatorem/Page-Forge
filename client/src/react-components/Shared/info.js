import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TableContainer from "@mui/material/TableContainer";
import DialogContentText from "@mui/material/DialogContentText";
import { setState } from "../../store";

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
  );
}
