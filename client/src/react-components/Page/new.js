import { useState, useEffect } from "react";
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { setState, useAppStore } from "../../store";
import { newPage } from "../../actions/page";
import { TEMPLATES } from "./templates";

import "./styles.css";

export default function NewPage() {
  const externalOpen = useAppStore(s => s.newPage);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (externalOpen) {
      setOpen(true);
      setState("newPage", false);
    }
  }, [externalOpen]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setName("");
    setSelectedTemplate(null);
    setError("");
    setOpen(false);
  };

  const handleCreate = () => {
    const trimmed = name.trim();
    if (trimmed.length < 1) {
      setError("A title is required.");
      return;
    }
    if (trimmed.length > 200) {
      setError("Title must be 200 characters or fewer.");
      return;
    }
    newPage(trimmed, selectedTemplate?.data || "");
    handleClose();
  };

  return (
    <>
      <div className="newPage">
        <Fab color="primary" aria-label="add" onClick={handleClickOpen}>
          <AddIcon />
        </Fab>
      </div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="new-dialog-title">
        <DialogTitle id="new-dialog-title">New Page</DialogTitle>
        <DialogContent>
          <TextField
            value={name}
            onChange={e => { setName(e.target.value); setError(""); }}
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            error={!!error}
            helperText={error}
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCreate();
              }
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, mb: 0.75, display: "block" }}>
            Start from a template (optional)
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {TEMPLATES.map(t => {
              const selected = selectedTemplate?.title === t.title;
              return (
                <ButtonBase
                  key={t.title}
                  onClick={() => setSelectedTemplate(selected ? null : t)}
                  aria-pressed={selected}
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    border: 2,
                    borderColor: selected ? "primary.main" : "divider",
                    borderRadius: 1,
                    cursor: "pointer",
                    userSelect: "none",
                    fontSize: "0.8rem",
                    color: selected ? "primary.main" : "text.secondary",
                    transition: "border-color 120ms var(--ease-out-quart), color 120ms var(--ease-out-quart)",
                    "&:hover": { borderColor: "primary.main", color: "primary.main" },
                    "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: "2px" }
                  }}
                >
                  {t.title}
                </ButtonBase>
              );
            })}
          </Box>
          {selectedTemplate && (
            <Box
              sx={{
                mt: 1.5,
                p: 1.5,
                bgcolor: "action.hover",
                borderRadius: 1,
                maxHeight: 100,
                overflow: "hidden",
                position: "relative"
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                component="pre"
                sx={{ fontFamily: "monospace", fontSize: "0.68rem", whiteSpace: "pre-wrap", m: 0, lineHeight: 1.6 }}
              >
                {selectedTemplate.data.split("\n").slice(0, 7).join("\n")}
              </Typography>
              <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 32, background: "linear-gradient(transparent, var(--bg-surface))" }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreate} color="primary" variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
