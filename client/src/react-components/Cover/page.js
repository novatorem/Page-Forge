import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
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
  marginTop: "15px",
  height: "calc(100% - 18px)",
  overflow: "scroll",
  scrollbarWidth: "none",
  // Remove the browser's default bright focus ring on the underlying <textarea>
  "& textarea": { outline: "none" }
});

const MUIHeader = styled(Typography)({
  marginBottom: "4px"
});

// Positioned relative to whichever Paper it lives inside
const VisButton = styled(Button)({
  position: "absolute",
  bottom: "var(--spacing-edge)",
  left: "var(--spacing-edge)",
  zIndex: 1
});

export default function Page(props) {
  const cover = props.cover;
  const [data, setData] = useState(cover.data);
  const [visibility, setVisibility] = useState(true);
  const [visibilityIcon, setvisibilityIcon] = useState(
    <VisibilityIcon />
  );

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
    if (visibility === true) {
      setVisibility(false);
      setvisibilityIcon(<VisibilityOffIcon />);
    } else {
      setVisibility(true);
      setvisibilityIcon(<VisibilityIcon />);
    }
  };

  return (
    <div style={{ height: "100%" }}>
      <MUIGrid container alignItems="stretch" spacing={2} direction={direction}>
        {visibility ? (
          <MUIGrid size="grow">
            <Paper sx={{ padding: "12px 20px", height: "100%", position: "relative" }} elevation={0}>
              <MUIHeader variant="h6" noWrap>
                Forge
              </MUIHeader>
              <Divider />
              <MUITextField
                id="standard-multiline-flexible"
                multiline={true}
                fullWidth={true}
                InputProps={{ disableUnderline: true }}
                value={data}
                onChange={handleChange}
                autoFocus={true}
              />
              <VisButton
                variant="contained"
                color="primary"
                onClick={handleVisibility}
              >
                {visibilityIcon}
              </VisButton>
            </Paper>
          </MUIGrid>
        ) : null}
        <MUIGrid size="grow">
          <Paper sx={{ padding: "12px 20px", height: "100%", position: "relative" }} elevation={0}>
            <MUIHeader variant="h6" noWrap>
              True
            </MUIHeader>
            <Divider />
            <Parse data={data} />
          </Paper>
        </MUIGrid>
      </MUIGrid>
    </div>
  );
}
