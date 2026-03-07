import { useState } from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import SubjectIcon from "@mui/icons-material/Subject";

export default function Para(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedValue, setSelectedValue] = useState(props.initialValue || "");

  const handleOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = value => {
    if (value !== undefined) {
      props.paragraphValues[props.closureCount] = value;
      setSelectedValue(value);
    }
    setAnchorEl(null);
  };

  return (
    <Box sx={{ mt: 1 }}>
      {selectedValue && (
        <Typography align="left" sx={{ mb: 0.5 }}>{selectedValue}</Typography>
      )}
      <Button
        size="small"
        variant="outlined"
        color="primary"
        startIcon={<SubjectIcon />}
        onClick={handleOpen}
      >
        {selectedValue ? "Change" : "Select paragraph"}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose(undefined)}
      >
        {props.paragraphs.map(paragraph => {
          const raw = paragraph[0].substring(1, paragraph[0].length - 1);
          const label = raw.split("|")[0];
          const value = raw.split("|")[1];
          return (
            <MenuItem key={value} onClick={() => handleClose(value)}>
              {label}
            </MenuItem>
          );
        })}
        <Divider />
        <MenuItem onClick={() => handleClose("")}>Clear</MenuItem>
      </Menu>
    </Box>
  );
}
