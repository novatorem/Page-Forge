import { createTheme } from "@mui/material/styles";

// Single source of truth for the MUI theme.
// CSS custom properties (--bg-base, --bg-surface, etc.) in App.css
// mirror these values for non-MUI elements.
const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#191919",
      paper: "#262626",
    },
    text: {
      primary: "#e7e8eb",
      secondary: "#9a9ca1",
    },
  },
  typography: {
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
  },
  components: {
    // Make the AppBar match the drawer (dark surface) rather than the
    // default primary-colour blue, unifying the chrome.
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#262626",
          backgroundImage: "none",
        },
      },
    },
  },
});

export default theme;
