import clsx from "clsx";
import React, { useState } from "react";

import List from "@material-ui/core/List";
import Menu from "@material-ui/core/Menu";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import MenuIcon from "@material-ui/icons/Menu";
import InfoIcon from "@material-ui/icons/Info";
import Toolbar from "@material-ui/core/Toolbar";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import MenuItem from "@material-ui/core/MenuItem";
import DeleteIcon from "@material-ui/icons/Delete";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CssBaseline from "@material-ui/core/CssBaseline";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import Page from "./page";
import NewCover from "./new";
import { setState, getState } from "statezero";
import { logout } from "../../actions/user";
import { saveUserCover } from "../../actions/cover";

const drawerWidth = 175;
const darkTheme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    height: "100%"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  titleTypo: {
    flex: 1
  },
  hide: {
    display: "none"
  },
  drawer: {
    position: "relative",
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  content: {
    flexGrow: 1,
    paddingTop: theme.spacing(8),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth,
    height: "100%",
    backgroundImage:
      'url("https://cdn.glitch.com/0ae08cca-f72e-4675-be70-b794f4bd0b72%2Fbg.jpg?v=1588962305935")',
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover"
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  },
  button: {
    textTransform: "none"
  },
  paper: {
    height: "100%",
    marginLeft: "12px",
    marginRight: "12px"
  }
}));

export default function VerticalDrawer(props) {
  let selectCount = -1;
  const classes = useStyles();
  
  const introCover = {
    data: "Hello, " + getState("currentUser") + "! " + props.introCover
  };
  const defaultContent = <Page cover={introCover} />;

  const [open, setOpen] = useState(true);
  const [cover, setCover] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [content, setContent] = useState(defaultContent);
  const [title, setTitle] = useState("Welcome to Page Forge!");
  const [selectedIndex, setSelectedIndex] = React.useState(null);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const menuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const menuClose = () => {
    setAnchorEl(null);
  };

  const handleInfoOpen = () => {
    menuClose();
    setState("info", true);
  };

  const saveCover = () => {
    saveUserCover();
  };

  const deleteCover = () => {
    setState("deleteC", true);
  };

  const resetContent = () => {
    setCover(null);
    setState("cover", null);
    setContent(defaultContent);
    setTitle("Welcome to Page Forge!");
    setSelectedIndex(-1);
  };

  return (
    <div className={classes.root}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              align="left"
              className={clsx(classes.titleTypo)}
            >
              {title}
            </Typography>

            {/* SAVE - if in a cover, show the save button */}
            {cover ? (
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={saveCover}
              >
                <SaveIcon />
              </IconButton>
            ) : null}

            {/* MORE - Extra menu items */}
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={menuOpen}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={menuClose}
            >
              {/* INFO - opens the info dialogue page */}
              <MenuItem onClick={handleInfoOpen}>
                <ListItemIcon>
                  <InfoIcon fontSize="small" />
                </ListItemIcon>
                <Typography>Info</Typography>
              </MenuItem>

              {/* DELETE - if in a cover, show the delete button*/}
              {cover ? (
                <MenuItem onClick={deleteCover}>
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography>Delete</Typography>
                </MenuItem>
              ) : null}

              {/* LOGOUT - Submenu option to log out */}
              <MenuItem onClick={logout}>
                <ListItemIcon>
                  <ExitToAppRoundedIcon fontSize="small" />
                </ListItemIcon>
                <Typography>Log out</Typography>
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.drawerHeader}>
            <Button onClick={resetContent} className={classes.button}>
              Page Forge
            </Button>
            {/*<Typography align="left" variant="subtitle1">
              Pages
            </Typography>*/}
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            {/* Drawer List - Populates all the pages on the drawer */}
            {props.userCovers
              ? props.userCovers.map(userCover => {
                  return (function() {
                    selectCount++;
                    let currentDraw = selectCount;
                    return (
                      <ListItem
                        button
                        selected={selectedIndex === currentDraw}
                        key={userCover.title}
                        onClick={event => (
                          setCover(userCover),
                          setTitle(userCover.title),
                          setState("cover", userCover),
                          setContent(<Page cover={userCover} />),
                          handleListItemClick(event, currentDraw)
                        )}
                      >
                        <ListItemText primary={userCover.title} />
                      </ListItem>
                    );
                  })();
                })
              : null}
          </List>

          <NewCover />
        </Drawer>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open
          })}
        >
          {content}
        </main>
      </ThemeProvider>
    </div>
  );
}
