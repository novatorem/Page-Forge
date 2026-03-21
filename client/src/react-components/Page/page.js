import { useState, useEffect, useRef } from "react";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DoneIcon from "@mui/icons-material/Done";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import Parse from "../Parse";
import dimensions from "../Shared/dimensions";
import { setState } from "../../store";
import { saveUserPage } from "../../actions/page";

const AUTOSAVE_DELAY = 1500;
const UNDO_COMMIT_DELAY = 500;

const MUITextField = styled(TextField)({
  marginTop: "16px",
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  "& .MuiInputBase-root": {
    alignItems: "flex-start",
    flex: 1,
    overflowY: "auto",
    padding: 0,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none"
  },
  "& textarea": {
    outline: "none",
    resize: "none",
    padding: 0,
  },
  "& textarea::placeholder": {
    opacity: 0.4,
    fontStyle: "italic",
    whiteSpace: "pre-line"
  }
});

export default function Page(props) {
  const page = props.page;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [data, setData] = useState(page.data);
  const [visibility, setVisibility] = useState(true);
  const [activePanel, setActivePanel] = useState("true");
  const [cIcon, setCIcon] = useState(<FileCopyIcon fontSize="small" />);
  const [saveStatus, setSaveStatus] = useState("idle");
  const parseRef = useRef(null);
  const autoSaveTimer = useRef(null);
  const undoHistory = useRef([page.data]);
  const undoIndex = useRef(0);
  const undoCommitTimer = useRef(null);

  let direction = "column";
  const { height, width } = dimensions();
  if (width >= height) {
    direction = "row";
  }

  useEffect(() => {
    setData(page.data);
    setSaveStatus("idle");
    clearTimeout(autoSaveTimer.current);
    clearTimeout(undoCommitTimer.current);
    undoHistory.current = [page.data];
    undoIndex.current = 0;
  }, [page.data]);

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
        if (!page._id) return;
        clearTimeout(autoSaveTimer.current);
        saveUserPage();
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
      setState("page", { _id: page._id, data: restoredValue });

      if (page._id) {
        setSaveStatus("unsaved");
        clearTimeout(autoSaveTimer.current);
        autoSaveTimer.current = setTimeout(async () => {
          setSaveStatus("saving");
          await saveUserPage(true);
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2000);
        }, AUTOSAVE_DELAY);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [page._id]);

  const handleChange = event => {
    const value = event.target.value;
    setData(value);
    setState("page", { _id: page._id, data: value });

    if (page._id) {
      setSaveStatus("unsaved");
      clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(async () => {
        setSaveStatus("saving");
        await saveUserPage(true);
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
    parseRef.current?.copy();
    setCIcon(<DoneIcon fontSize="small" />);
    setTimeout(() => setCIcon(<FileCopyIcon fontSize="small" />), 1250);
  };

  const handleSave = () => {
    if (!page._id) return;
    clearTimeout(autoSaveTimer.current);
    saveUserPage();
    setSaveStatus("idle");
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
    <Paper sx={{ padding: isMobile ? "8px 12px" : "16px 20px", height: "100%", boxSizing: "border-box", overflow: "hidden", display: "flex", flexDirection: "column" }} elevation={0}>
      {!isMobile && (
        <>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6" noWrap>Forge</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {page._id && (
                <>
                  {saveStatus !== "idle" && (
                    <Typography
                      key={saveStatus}
                      variant="caption"
                      color={saveStatus === "saved" ? "success.main" : "text.secondary"}
                      aria-live="polite"
                      aria-atomic="true"
                      sx={{ animation: "fade-slide-up 180ms var(--ease-out-quart) both" }}
                    >
                      {saveStatusLabel}
                    </Typography>
                  )}
                  <IconButton size="small" color="primary" onClick={handleSave} aria-label="Save page">
                    <SaveIcon fontSize="small" />
                  </IconButton>
                </>
              )}
              <IconButton size="small" onClick={handleVisibility} color="primary" aria-label="Hide editor">
                <VisibilityOffIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Divider />
        </>
      )}
      <MUITextField
        id="standard-multiline-flexible"
        multiline={true}
        fullWidth={true}
        value={data}
        onChange={handleChange}
        autoFocus={!isMobile}
        placeholder={"Write your template here.\n\nUse {_} for a text field, {date} for a date picker,\n{this/that} for a dropdown, {#} for a number,\nor {?:optional text} to make a line optional."}
        sx={{ marginTop: isMobile ? "8px" : "16px" }}
      />
    </Paper>
  );

  const truePaper = (
    <Paper sx={{ padding: isMobile ? "8px 12px" : "16px 20px", height: "100%", boxSizing: "border-box", overflow: "hidden", display: "flex", flexDirection: "column" }} elevation={0}>
      {!isMobile && (
        <>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6" noWrap>True</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {!visibility && (
                <IconButton size="small" onClick={handleVisibility} color="primary" aria-label="Show editor">
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              )}
              <IconButton size="small" color="primary" onClick={handlePrint} aria-label="Print page">
                <PrintIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="primary" onClick={handleCopy} aria-label="Copy page">
                {cIcon}
              </IconButton>
            </Box>
          </Box>
          <Divider />
        </>
      )}
      <Parse ref={parseRef} data={data} sx={{ marginTop: isMobile ? "8px" : "16px" }} />
    </Paper>
  );

  const gridColumns = !isMobile && direction === "row" && showForge && showTrue
    ? "1fr 1fr" : "1fr";

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {isMobile && (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Tabs
            value={activePanel}
            onChange={(_, v) => setActivePanel(v)}
            sx={{ minHeight: 44 }}
            TabIndicatorProps={{ style: { height: 2 } }}
          >
            <Tab label="Forge" value="forge" sx={{ minHeight: 44, py: 0.75 }} />
            <Tab label="True" value="true" sx={{ minHeight: 44, py: 0.75 }} />
          </Tabs>
          {activePanel === "true" && (
            <Box sx={{ display: "flex", alignItems: "center", px: 1 }}>
              <IconButton size="medium" color="primary" onClick={handlePrint} aria-label="Print page">
                <PrintIcon fontSize="small" />
              </IconButton>
              <IconButton size="medium" color="primary" onClick={handleCopy} aria-label="Copy page">
                {cIcon}
              </IconButton>
            </Box>
          )}
          {activePanel === "forge" && page._id && (
            <Box sx={{ display: "flex", alignItems: "center", px: 1 }}>
              {saveStatus !== "idle" && (
                <Typography
                  key={saveStatus}
                  variant="caption"
                  color={saveStatus === "saved" ? "success.main" : "text.secondary"}
                  aria-live="polite"
                  aria-atomic="true"
                  sx={{ animation: "fade-slide-up 180ms var(--ease-out-quart) both", mr: 1 }}
                >
                  {saveStatusLabel}
                </Typography>
              )}
              <IconButton size="medium" color="primary" onClick={handleSave} aria-label="Save page">
                <SaveIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      )}
      <Box sx={{
        display: "grid",
        gridTemplateColumns: gridColumns,
        gridTemplateRows: "1fr",
        gap: isMobile ? 0 : 2,
        flex: 1,
        minHeight: 0
      }}>
        {showForge && forgePaper}
        {showTrue && truePaper}
      </Box>
    </div>
  );
}
