import { createTheme, alpha } from "@mui/material/styles";

// Single source of truth for the MUI theme.
// CSS custom properties (--bg-base, --bg-surface, etc.) in App.css
// mirror these values for non-MUI elements.
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00e1ff",
      light: "#66edff",
      dark: "#00a1b5",
      contrastText: "#000000",
    },
    secondary: {
      main: "#808080",
      light: "#b3b3b3",
      dark: "#4d4d4d",
      contrastText: "#ffffff",
    },
    background: {
      default: "#10141e",
      paper: "#1a1f2e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b3b3b3",
    },
  },
  typography: {
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          backgroundImage: "none",
        })
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: "none",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: "none",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundImage: "none",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: theme => `
        ::selection {
          background: ${alpha(theme.palette.primary.main, 0.35)};
          color: ${theme.palette.text.primary};
        }
      `,
    },
  },
});

export default theme;
