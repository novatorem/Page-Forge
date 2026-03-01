import { useState } from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import { useShallow } from "zustand/react/shallow";

import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import baseTheme from "../../theme";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import Page from "../Cover/page";
import Password from "./password";
import Snackbar from "../Shared/snackbar";
import useAppStore from "../../store";

import { updateLoginForm, login, register } from "../../actions/user";

import "./styles.css";
import "./../../App.css";

const MUIDialogContent = styled(DialogContent)({
  overflow: "scroll",
  scrollbarWidth: "none"
});

const MUILinearProgress = styled(LinearProgress)({
  margin: "2rem"
});

function MUIDialogTitle(props) {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

const theme = createTheme(baseTheme, {
  components: {
    MuiInput: {
      styleOverrides: {
        underline: {
          "&:before":                          { borderBottom: "1px solid #FFFFFF44" },
          "&:hover:not(.Mui-disabled):before": { borderBottom: "1px solid #FFFFFFAA" },
          "&:after":                           { borderBottom: "1px solid #FFFFFF44" }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#FFFFFFDC",
          "&.Mui-focused": { color: "#FFFFFF" }
        }
      }
    },
    MuiInputBase: {
      styleOverrides: { root: { color: "#FFFFFFDE" } }
    },
    MuiIconButton: {
      styleOverrides: { root: { color: "#FFFFFFDC" } }
    }
  }
});

export default function Login() {
  const [trying, setTrying] = useState(false);
  const [rightPanelActive, setRightPanelActive] = useState(true);

  const {
    loginClick,
    loginError,
    failedLogin,
    invalidUsername,
    passwordShort,
    registered,
    tryCover
  } = useAppStore(
    useShallow(state => ({
      loginClick: state.loginClick,
      loginError: state.loginError,
      failedLogin: state.failedLogin,
      invalidUsername: state.invalidUsername,
      passwordShort: state.passwordShort,
      registered: state.registered,
      tryCover: state.tryCover
    }))
  );

  const handleOpen = e => {
    e.preventDefault();
    setTrying(true);
  };

  const handleClose = e => {
    e.preventDefault();
    setTrying(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="login__bg-image center">
        <div
          className={`container center ${
            rightPanelActive ? "right-panel-active" : null
          }`}
        >
          <div className="container__form container--signup">
            <form action="#" className="form center" id="form1">
              <h2 className="form__title">Sign Up</h2>
              <TextField
                name="username"
                label="Username"
                variant="standard"
                className="login__input app__input app__horizontal-center"
                margin="none"
                autoFocus={true}
                onChange={e => updateLoginForm(e.target)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    register();
                  }
                }}
              />
              <Password login={false} />
              <Button className="login__button" onClick={register}>
                Register
              </Button>
              <Button className="login__button" onClick={handleOpen}>
                Try Me
              </Button>
            </form>
          </div>

          <div className="container__form container--signin">
            <form action="#" className="form center" id="form2">
              <h2 className="form__title">Sign In</h2>
              <TextField
                name="username"
                label="Username"
                variant="standard"
                className="login__input app__input app__horizontal-center"
                margin="none"
                autoFocus={true}
                onChange={e => updateLoginForm(e.target)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    login();
                  }
                }}
              />
              <Password login={true} />

              <Button className="login__button" onClick={login}>
                Log In
              </Button>
              <Button
                className="login__button"
                onClick={() =>
                  window.open(
                    "https://github.com/novatorem/Page-Forge",
                    "_blank"
                  )
                }
              >
                Info
              </Button>
            </form>
          </div>

          <div className="container__overlay">
            <div className="overlay">
              <div className="overlay__panel overlay--left">
                <button
                  className="btn"
                  id="signIn"
                  onClick={() => setRightPanelActive(v => !v)}
                >
                  Sign In
                </button>
              </div>
              <div className="overlay__panel overlay--right">
                <button
                  className="btn"
                  id="signUp"
                  onClick={() => setRightPanelActive(v => !v)}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
        <Dialog
          maxWidth={false}
          open={trying}
          onClose={handleClose}
        >
          <MUIDialogTitle onClose={handleClose}>Try Me</MUIDialogTitle>
          <Divider />
          <MUIDialogContent dividers={false}>
            {tryCover && <Page cover={tryCover} />}
          </MUIDialogContent>
        </Dialog>

        {loginClick === true && <MUILinearProgress />}

        {/* Snackbars for notifications */}
        {loginError === true && (
          <Snackbar
            severity="error"
            message="Error logging in, please refresh. If this continues, post an issue on github."
          />
        )}
        {failedLogin === true && (
          <Snackbar
            severity="error"
            message="Invalid username/password combination"
          />
        )}
        {invalidUsername === true && (
          <Snackbar
            severity="error"
            message="Failed to register, choose a different username"
          />
        )}
        {passwordShort === true && (
          <Snackbar
            severity="warning"
            message="Password too short, minimum of 6 characters"
          />
        )}
        {registered === true && (
          <Snackbar severity="success" message="Registered, welcome!" />
        )}
      </div>
    </ThemeProvider>
  );
}
