import { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import SubjectIcon from "@mui/icons-material/Subject";

import {
  parseForgeContent,
  initLocalValues,
  makePartsGetter,
  renderForgeParts
} from "./forgeComponents";

export default function Para(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedParts, setSelectedParts] = useState(null);
  const localValues = useRef([]);

  const handleOpen = event => setAnchorEl(event.currentTarget);

  const handleSelect = raw => {
    if (raw !== undefined) {
      const parts = parseForgeContent(raw);
      localValues.current = initLocalValues(parts);
      setSelectedParts(parts);
      props.paragraphValues[props.closureCount] = makePartsGetter(parts, localValues);
    }
    setAnchorEl(null);
  };

  const handleClear = () => {
    setSelectedParts(null);
    localValues.current = [];
    props.paragraphValues[props.closureCount] = "";
    setAnchorEl(null);
  };

  return (
    <Box sx={{ mt: 1 }}>
      {selectedParts && (
        <Box sx={{ mb: 0.5, whiteSpace: "pre-line" }}>
          {renderForgeParts(selectedParts, localValues)}
        </Box>
      )}
      <Button
        size="small"
        variant="outlined"
        color="primary"
        startIcon={<SubjectIcon />}
        onClick={handleOpen}
      >
        {selectedParts ? "Change" : "Select paragraph"}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {props.paragraphs.map(paragraph => {
          const raw = paragraph[0].substring(1, paragraph[0].length - 1);
          const label = raw.split("|")[0];
          const value = raw.split("|")[1];
          return (
            <MenuItem key={value} onClick={() => handleSelect(value)}>
              {label}
            </MenuItem>
          );
        })}
        <Divider />
        <MenuItem onClick={handleClear}>Clear</MenuItem>
      </Menu>
    </Box>
  );
}
