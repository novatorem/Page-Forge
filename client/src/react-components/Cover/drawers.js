import { useState } from "react";
import { styled } from "@mui/material/styles";

import List from "@mui/material/List";
import Menu from "@mui/material/Menu";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import MenuIcon from "@mui/icons-material/Menu";
import InfoIcon from "@mui/icons-material/Info";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";

import Page from "./page";
import NewCover from "./new";
import { setState, getState } from "../../store";
import { logout } from "../../actions/user";
import { saveUserCover } from "../../actions/cover";

const drawerWidth = 175;

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: prop => prop !== "open"
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end"
}));

const Main = styled("main", {
  shouldForwardProp: prop => prop !== "open"
})(({ theme, open }) => {
  const appBarClearance = `calc(${theme.spacing(8)} + ${theme.spacing(2)})`;
  const edgePadding = theme.spacing(2);
  return {
    flexGrow: 1,
    padding: `${appBarClearance} ${edgePadding} ${edgePadding}`,
    boxSizing: "border-box",
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: `-${drawerWidth}px`,
    height: "100%",
    background: "var(--bg-base)",
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }),
      marginLeft: 0
    })
  };
});

export default function VerticalDrawer(props) {
  const introCover = {
    data: "Hello, " + getState("currentUser") + "! " + props.introCover
  };
  const defaultContent = <Page cover={introCover} />;

  const [open, setOpen] = useState(true);
  const [cover, setCover] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [content, setContent] = useState(defaultContent);
  const [title, setTitle] = useState("Welcome to Page Forge!");
  const [selectedIndex, setSelectedIndex] = useState(null);

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
    <div style={{ display: "flex", height: "100%" }}>
        <StyledAppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              align="left"
              sx={{ flex: 1 }}
            >
              {title}
            </Typography>

            {cover ? (
              <IconButton
                aria-label="save"
                onClick={saveCover}
              >
                <SaveIcon />
              </IconButton>
            ) : null}

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
              <MenuItem onClick={handleInfoOpen}>
                <ListItemIcon>
                  <InfoIcon fontSize="small" />
                </ListItemIcon>
                <Typography>Info</Typography>
              </MenuItem>

              {cover ? (
                <MenuItem onClick={deleteCover}>
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography>Delete</Typography>
                </MenuItem>
              ) : null}

              <MenuItem onClick={logout}>
                <ListItemIcon>
                  <ExitToAppRoundedIcon fontSize="small" />
                </ListItemIcon>
                <Typography>Log out</Typography>
              </MenuItem>
            </Menu>
          </Toolbar>
        </StyledAppBar>
        <Drawer
          sx={{
            position: "relative",
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": { width: drawerWidth }
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <Button onClick={resetContent} sx={{ textTransform: "none" }}>
              Page Forge
            </Button>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {props.userCovers
              ? props.userCovers.map((userCover, index) => (
                  <ListItemButton
                    selected={selectedIndex === index}
                    key={userCover.title}
                    onClick={event => {
                      setCover(userCover);
                      setTitle(userCover.title);
                      setState("cover", userCover);
                      setContent(<Page cover={userCover} />);
                      handleListItemClick(event, index);
                    }}
                  >
                    <ListItemText primary={userCover.title} />
                  </ListItemButton>
                ))
              : null}
          </List>

          <NewCover />
        </Drawer>
        <Main open={open}>
          {content}
        </Main>
    </div>
  );
}
