import { useState, useEffect, useRef } from "react";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DoneIcon from "@mui/icons-material/Done";
import PrintIcon from "@mui/icons-material/Print";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SubjectIcon from "@mui/icons-material/Subject";
import FormatClearIcon from "@mui/icons-material/FormatClear";

import Parse from "../Parse";
import dimensions from "../Shared/dimensions";
import { setState } from "../../store";
import { saveUserCover } from "../../actions/cover";

const AUTOSAVE_DELAY = 1500;
const UNDO_COMMIT_DELAY = 500;

const MUIGrid = styled(Grid)({
  height: "100%",
  position: "relative"
});

const MUITextField = styled(TextField)({
  flex: 1,
  minHeight: 0,
  marginTop: "16px",
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [data, setData] = useState(cover.data);
  const [visibility, setVisibility] = useState(true);
  const [activePanel, setActivePanel] = useState("true");
  const [richCopy, setRichCopy] = useState(false);
  const [cIcon, setCIcon] = useState(<FileCopyIcon />);
  const [saveStatus, setSaveStatus] = useState("idle");
  const parseRef = useRef(null);
  const autoSaveTimer = useRef(null);
  const undoHistory = useRef([cover.data]);
  const undoIndex = useRef(0);
  const undoCommitTimer = useRef(null);

  let direction = "column";
  const { height, width } = dimensions();
  if (width >= height) {
    direction = "row";
  }

  useEffect(() => {
    setData(cover.data);
    setSaveStatus("idle");
    clearTimeout(autoSaveTimer.current);
    clearTimeout(undoCommitTimer.current);
    undoHistory.current = [cover.data];
    undoIndex.current = 0;
  }, [cover.data]);

  useEffect(() => {
    return () => {
      clearTimeout(autoSaveTimer.current);
      clearTimeout(undoCommitTimer.current);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = event => {
      if (!(event.ctrlKey || event.metaKey)) return;

      if (event.key === "s") {
        event.preventDefault();
        if (!cover._id) return;
        clearTimeout(autoSaveTimer.current);
        saveUserCover();
        setSaveStatus("idle");
        return;
      }

      const isUndo = event.key === "z" && !event.shiftKey;
      const isRedo = (event.key === "z" && event.shiftKey) || event.key === "y";
      if (!isUndo && !isRedo) return;
      event.preventDefault();

      if (isUndo && undoIndex.current > 0) {
        undoIndex.current--;
      } else if (isRedo && undoIndex.current < undoHistory.current.length - 1) {
        undoIndex.current++;
      } else {
        return;
      }

      const restoredValue = undoHistory.current[undoIndex.current];
      setData(restoredValue);
      setState("cover", { _id: cover._id, data: restoredValue });

      if (cover._id) {
        setSaveStatus("unsaved");
        clearTimeout(autoSaveTimer.current);
        autoSaveTimer.current = setTimeout(async () => {
          setSaveStatus("saving");
          await saveUserCover(true);
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2000);
        }, AUTOSAVE_DELAY);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cover._id]);

  const handleChange = event => {
    const value = event.target.value;
    setData(value);
    setState("cover", { _id: cover._id, data: value });

    if (cover._id) {
      setSaveStatus("unsaved");
      clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(async () => {
        setSaveStatus("saving");
        await saveUserCover(true);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      }, AUTOSAVE_DELAY);
    }

    clearTimeout(undoCommitTimer.current);
    undoCommitTimer.current = setTimeout(() => {
      undoHistory.current = undoHistory.current.slice(0, undoIndex.current + 1);
      undoHistory.current.push(value);
      undoIndex.current = undoHistory.current.length - 1;
    }, UNDO_COMMIT_DELAY);
  };

  const handleVisibility = () => setVisibility(v => !v);

  const handleCopy = () => {
    if (richCopy) {
      parseRef.current?.copyRich();
    } else {
      parseRef.current?.copy();
    }
    setCIcon(<DoneIcon />);
    setTimeout(() => setCIcon(<FileCopyIcon />), 1250);
  };

  const handlePrint = () => parseRef.current?.print();

  const saveStatusLabel = {
    unsaved: "Unsaved",
    saving: "Saving...",
    saved: "Saved"
  }[saveStatus];

  // Mobile: tabs control which panel is shown; desktop: visibility toggle
  const showForge = isMobile ? activePanel === "forge" : visibility;
  const showTrue = isMobile ? activePanel === "true" : true;

  const forgePaper = (
    <Paper sx={{ padding: "16px 20px", height: "100%", position: "relative", display: "flex", flexDirection: "column", overflow: "hidden" }} elevation={0}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {!isMobile && <Typography variant="h6" noWrap>Forge</Typography>}
          {cover._id && saveStatus !== "idle" && (
            <Typography variant="caption" color={saveStatus === "saved" ? "success.main" : "text.secondary"}>
              {saveStatusLabel}
            </Typography>
          )}
        </Box>
        {!isMobile && (
          <IconButton size="small" onClick={handleVisibility} color="primary">
            <VisibilityOffIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      {!isMobile && <Divider />}
      <MUITextField
        id="standard-multiline-flexible"
        multiline={true}
        fullWidth={true}
        value={data}
        onChange={handleChange}
        autoFocus={!isMobile}
        sx={{ marginTop: isMobile ? "8px" : "16px" }}
      />
    </Paper>
  );

  const truePaper = (
    <Paper sx={{ padding: "16px 20px", height: "100%", position: "relative", display: "flex", flexDirection: "column", overflow: "hidden" }} elevation={0}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {!isMobile && <Typography variant="h6" noWrap>True</Typography>}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: isMobile ? "auto" : 0 }}>
          {!isMobile && !visibility && (
            <IconButton size="small" onClick={handleVisibility} color="primary">
              <VisibilityIcon fontSize="small" />
            </IconButton>
          )}
          <Tooltip title={richCopy ? "Rich text copy (for email clients)" : "Plain text copy"}>
            <IconButton size="small" color={richCopy ? "primary" : "default"} onClick={() => setRichCopy(r => !r)}>
              {richCopy ? <SubjectIcon fontSize="small" /> : <FormatClearIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <IconButton size="small" color="primary" onClick={handlePrint}>
            <PrintIcon fontSize="small" />
          </IconButton>
          <Button size="small" color="primary" variant="text" startIcon={cIcon} onClick={handleCopy}>
            Copy
          </Button>
        </Box>
      </Box>
      {!isMobile && <Divider />}
      <Parse ref={parseRef} data={data} />
    </Paper>
  );

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {isMobile && (
        <Tabs
          value={activePanel}
          onChange={(_, v) => setActivePanel(v)}
          sx={{ minHeight: 40, mb: 1 }}
          TabIndicatorProps={{ style: { height: 2 } }}
        >
          <Tab label="Forge" value="forge" sx={{ minHeight: 40, py: 0.5 }} />
          <Tab label="True" value="true" sx={{ minHeight: 40, py: 0.5 }} />
        </Tabs>
      )}
      <MUIGrid
        container
        alignItems="stretch"
        spacing={isMobile ? 0 : 2}
        direction={isMobile ? "row" : direction}
        sx={{ flex: 1, minHeight: 0 }}
      >
        <MUIGrid size="grow" sx={{ display: showForge ? undefined : "none" }}>
          {forgePaper}
        </MUIGrid>
        <MUIGrid size="grow" sx={{ display: showTrue ? undefined : "none" }}>
          {truePaper}
        </MUIGrid>
      </MUIGrid>
    </div>
  );
}
