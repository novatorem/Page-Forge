import { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
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
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 9999
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
  const [rightPanelActive, setRightPanelActive] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)");

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

  if (isMobile) {
    const isSignUp = rightPanelActive;
    return (
      <ThemeProvider theme={theme}>
        <div className="login__bg-image" style={{ width: "100%", minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", boxSizing: "border-box" }}>
          <div style={{ width: "100%", maxWidth: 340, background: "rgba(18, 20, 32, 0.88)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderRadius: "0.7rem", padding: "2rem", boxSizing: "border-box", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 0.9rem 1.7rem rgba(0,0,0,.3)" }}>
            <h2 className="form__title" style={{ marginTop: 0, color: "#fff" }}>
              {isSignUp ? "Sign Up" : "Sign In"}
            </h2>
            <form className="form" style={{ height: "auto", padding: 0 }}>
              <TextField
                name="username"
                label="Username"
                variant="standard"
                className="login__input app__input app__horizontal-center"
                margin="none"
                autoFocus
                onChange={e => updateLoginForm(e.target)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); isSignUp ? register() : login(); } }}
              />
              <Password login={!isSignUp} />
              <Button className="login__button" sx={{ mt: 2 }} onClick={isSignUp ? register : login}>
                {isSignUp ? "Register" : "Log In"}
              </Button>
            </form>
            <div style={{ textAlign: "center", marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center" }}>
              <button className="btn" style={{ padding: "0.6rem 2rem", fontSize: "0.75rem" }} onClick={() => setRightPanelActive(v => !v)}>
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
              <button className="btn" style={{ padding: "0.6rem 2rem", fontSize: "0.75rem" }} onClick={handleOpen}>
                Try Me
              </button>
            </div>
          </div>

          <Dialog fullScreen open={trying} onClose={handleClose}>
            <MUIDialogTitle onClose={handleClose}>Try Me</MUIDialogTitle>
            <Divider />
            <MUIDialogContent dividers={false}>
              {tryCover && <Page cover={tryCover} />}
            </MUIDialogContent>
          </Dialog>

          {loginClick === true && <MUILinearProgress />}
          {loginError === true && <Snackbar severity="error" message="Error logging in, please refresh." />}
          {failedLogin === true && <Snackbar severity="error" message="Invalid username/password combination" />}
          {invalidUsername === true && <Snackbar severity="error" message="Failed to register, choose a different username" />}
          {passwordShort === true && <Snackbar severity="warning" message="Password too short, minimum of 6 characters" />}
          {registered === true && <Snackbar severity="success" message="Registered, welcome!" />}
        </div>
      </ThemeProvider>
    );
  }

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
