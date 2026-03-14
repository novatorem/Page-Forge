import React from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

import "./../../App.css";
import "./styles.css";

export default function Input({ label, value, onChange, name }) {
  return (
    <Grid size={{ xs: 12, sm: 12, md: 4, lg: 3, xl: 3 }}>
      <TextField
        name={name}
        label={label}
        defaultValue={value}
        className="input"
        margin="normal"
        fullWidth
        onChange={onChange}
      />
    </Grid>
  );
}
