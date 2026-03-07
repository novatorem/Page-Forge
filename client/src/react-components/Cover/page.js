import { useState, useEffect, useRef } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DoneIcon from "@mui/icons-material/Done";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import Parse from "../Parse";
import dimensions from "../Shared/dimensions";
import { setState } from "../../store";

const MUIGrid = styled(Grid)({
  height: "100%",
  position: "relative"
});

const MUITextField = styled(TextField)({
  flex: 1,
  minHeight: 0,
  marginTop: "15px",
  "& .MuiInputBase-root": {
    height: "100%",
    alignItems: "flex-start",
    overflow: "auto"
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none"
  },
  "& textarea": {
    outline: "none",
    resize: "none"
  }
});

export default function Page(props) {
  const cover = props.cover;
  const [data, setData] = useState(cover.data);
  const [visibility, setVisibility] = useState(true);
  const [cIcon, setCIcon] = useState(<FileCopyIcon />);
  const parseRef = useRef(null);

  // Detect if mobile or laptop to orient grid
  let direction = "column";
  const { height, width } = dimensions();
  if (width >= height) {
    direction = "row";
  }

  useEffect(() => {
    setData(cover.data);
  }, [cover.data]);

  const handleChange = event => {
    setData(event.target.value);
    setState("cover", { _id: cover._id, data: event.target.value });
  };

  const handleVisibility = () => {
    setVisibility(v => !v);
  };

  const handleCopy = () => {
    parseRef.current?.copy();
    setCIcon(<DoneIcon />);
    setTimeout(() => setCIcon(<FileCopyIcon />), 1250);
  };

  return (
    <div style={{ height: "100%" }}>
      <MUIGrid container alignItems="stretch" spacing={2} direction={direction}>
        {visibility ? (
          <MUIGrid size="grow">
            <Paper sx={{ padding: "12px 20px", height: "100%", position: "relative", display: "flex", flexDirection: "column", overflow: "hidden" }} elevation={0}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: "4px" }}>
                <Typography variant="h6" noWrap>Forge</Typography>
                <IconButton size="small" onClick={handleVisibility} color="primary">
                  <VisibilityOffIcon fontSize="small" />
                </IconButton>
              </Box>
              <Divider />
              <MUITextField
                id="standard-multiline-flexible"
                multiline={true}
                fullWidth={true}
                value={data}
                onChange={handleChange}
                autoFocus={true}
              />
            </Paper>
          </MUIGrid>
        ) : null}
        <MUIGrid size="grow">
          <Paper sx={{ padding: "12px 20px", height: "100%", position: "relative", display: "flex", flexDirection: "column", overflow: "hidden" }} elevation={0}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: "4px" }}>
              <Typography variant="h6" noWrap>True</Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                {!visibility && (
                  <IconButton size="small" onClick={handleVisibility} color="primary">
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                )}
                <Button
                  size="small"
                  color="primary"
                  variant="text"
                  startIcon={cIcon}
                  onClick={handleCopy}
                >Copy
                </Button>
              </Box>
            </Box>
            <Divider />
            <Parse ref={parseRef} data={data} />
          </Paper>
        </MUIGrid>
      </MUIGrid>
    </div>
  );
}
