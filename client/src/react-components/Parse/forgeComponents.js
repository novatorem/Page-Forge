import { useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export const MUITextField = styled(TextField)({
  display: "inline-flex",
  verticalAlign: "middle",
  marginTop: "2px",
  marginBottom: "2px",
  "& .MuiInputBase-input": {
    padding: "2px 8px"
  }
});

export const MUIFormControl = styled(FormControl)({
  display: "inline-flex",
  verticalAlign: "middle",
  marginTop: "2px",
  marginBottom: "2px",
  minWidth: 120,
  "& .MuiSelect-select": {
    padding: "2px 32px 2px 8px"
  }
});

// Parses a content string into typed parts for forge rendering.
// Handles nested {_}, {#}, {date}, and {opt1/opt2/...}.
export function parseForgeContent(contentStr) {
  const parts = [];
  const forgeRegex = /\{([^}]*)\}/g;
  let lastIndex = 0;
  let match;
  while ((match = forgeRegex.exec(contentStr)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: contentStr.slice(lastIndex, match.index) });
    }
    const inner = match[1];
    if (inner === "_") {
      parts.push({ type: "input" });
    } else if (inner === "#") {
      parts.push({ type: "number" });
    } else if (inner === "date") {
      parts.push({ type: "date" });
    } else if (inner.includes("/")) {
      parts.push({ type: "select", options: inner.split("/") });
    } else {
      parts.push({ type: "text", value: match[0] });
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < contentStr.length) {
    parts.push({ type: "text", value: contentStr.slice(lastIndex) });
  }
  return parts;
}

export function formatIsoDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return new Date(+y, +m - 1, +d).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  });
}

// Returns initial local values for a parts array (number → "0", date → today, else "").
export function initLocalValues(parts) {
  const today = new Date().toISOString().split("T")[0];
  return parts.map(p =>
    p.type === "number" ? "0" : p.type === "date" ? today : ""
  );
}

// Creates a getter function that combines parts with current local ref values.
export function makePartsGetter(parts, localValuesRef) {
  return () => parts.map((p, i) => {
    if (p.type === "text") return p.value;
    if (p.type === "date") return formatIsoDate(localValuesRef.current[i]);
    return localValuesRef.current[i] || "";
  }).join("");
}

// Reusable number input with +/− buttons. Notifies via onChange callback.
export function NumberForge({ onChange }) {
  const [value, setValue] = useState(0);
  const update = next => { setValue(next); onChange?.(String(next)); };
  return (
    <Box
      component="span"
      sx={{ display: "inline-flex", alignItems: "center", verticalAlign: "middle", mx: 0.25, gap: 0.25 }}
    >
      <IconButton
        size="small"
        color="primary"
        aria-label="decrease"
        onClick={e => { e.stopPropagation(); update(Math.max(0, value - 1)); }}
        sx={{ p: 0.25 }}
      >
        <RemoveIcon sx={{ fontSize: 14 }} />
      </IconButton>
      <MUITextField
        value={value}
        onChange={e => { const n = parseInt(e.target.value); update(isNaN(n) ? 0 : Math.max(0, n)); }}
        onClick={e => e.stopPropagation()}
        size="small"
        inputProps={{ "aria-label": "number", style: { textAlign: "center", width: 32 } }}
      />
      <IconButton
        size="small"
        color="primary"
        aria-label="increase"
        onClick={e => { e.stopPropagation(); update(value + 1); }}
        sx={{ p: 0.25 }}
      >
        <AddIcon sx={{ fontSize: 14 }} />
      </IconButton>
    </Box>
  );
}

// Renders a parts array as inline forge components. stopPropagation controls
// whether interactive elements should prevent click bubbling (needed inside OptionalForge).
export function renderForgeParts(parts, localValuesRef, stopPropagation = false) {
  const today = new Date().toISOString().split("T")[0];
  const stop = e => { if (stopPropagation) e.stopPropagation(); };

  return parts.map((p, i) => {
    if (p.type === "text") {
      return <span key={i}>{p.value}</span>;
    }
    if (p.type === "input") {
      return (
        <MUITextField
          key={i}
          size="small"
          onChange={e => { localValuesRef.current[i] = e.target.value; }}
          onClick={stop}
        />
      );
    }
    if (p.type === "number") {
      return (
        <NumberForge
          key={i}
          onChange={v => { localValuesRef.current[i] = v; }}
        />
      );
    }
    if (p.type === "date") {
      return (
        <MUITextField
          key={i}
          type="date"
          size="small"
          defaultValue={today}
          sx={{ width: 155, colorScheme: "dark" }}
          onChange={e => { localValuesRef.current[i] = e.target.value; }}
          onClick={stop}
        />
      );
    }
    if (p.type === "select") {
      return (
        <MUIFormControl key={i} onClick={stop}>
          <Select
            size="small"
            defaultValue=""
            onChange={e => { localValuesRef.current[i] = e.target.value; }}
          >
            {p.options.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
          </Select>
        </MUIFormControl>
      );
    }
    return null;
  });
}
