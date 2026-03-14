import { useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";

import { updateLoginForm, login, register } from "../../actions/user";

export default function InputAdornments(props) {
  const [values, setValues] = useState({
    password: "",
    showPassword: false
  });

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value });
    updateLoginForm(event.target);
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  return (
    <TextField
      variant="standard"
      label="Password"
      type={values.showPassword ? "text" : "password"}
      value={values.password}
      name="password"
      margin="none"
      className="login__input app__horizontal-center"
      onChange={handleChange("password")}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          if (props.login) {
            login();
          } else {
            register();
          }
        }
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {values.showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
}
