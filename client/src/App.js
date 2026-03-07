import { useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import MainView from "./MainView";
import Login from "./react-components/Login";
import useAppStore from "./store";
import theme from "./theme";

function syncThemeToCssVars(theme) {
  const { palette } = theme;
  const root = document.documentElement.style;
  root.setProperty("--bg-base",       palette.background.default);
  root.setProperty("--bg-surface",    palette.background.paper);
  root.setProperty("--text-primary",  palette.text.primary);
  root.setProperty("--text-secondary", palette.text.secondary);
}

syncThemeToCssVars(theme);

import { readCookie } from "./actions/user";

import "./App.css";

export default function App() {
  useEffect(() => { readCookie(); }, []);
  const currentUser = useAppStore(state => state.currentUser);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">{!currentUser ? <Login /> : <MainView />}</div>
    </ThemeProvider>
  );
}
