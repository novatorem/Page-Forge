import { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import List from "@mui/material/List";
import Menu from "@mui/material/Menu";
import Dialog from "@mui/material/Dialog";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import MenuIcon from "@mui/icons-material/Menu";
import InfoIcon from "@mui/icons-material/Info";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";

import { useNavigate, useParams } from "react-router-dom";

import Page from "./page";
import NewCover from "./new";
import EmptyState from "../Shared/EmptyState";
import ErrorBoundary from "../Shared/ErrorBoundary";
import { setState, getState, useAppStore } from "../../store";
import { logout } from "../../actions/user";
import { saveUserCover, renameUserCover, duplicateUserCover, getUserCovers } from "../../actions/cover";

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
  const edgePadding = theme.spacing(2);
  return {
    flexGrow: 1,
    paddingLeft: edgePadding,
    paddingRight: edgePadding,
    paddingBottom: edgePadding,
    paddingTop: `calc(${theme.spacing(9)} + ${edgePadding})`, // 72px toolbar (mobile 56px + 16px gap)
    [theme.breakpoints.up("sm")]: {
      paddingTop: `calc(${theme.spacing(8)} + ${edgePadding})` // 80px toolbar (desktop 64px + 16px gap)
    },
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

function SortableCoverItem({ userCover, selectedCoverId, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: userCover._id });
  return (
    <ListItemButton
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      selected={selectedCoverId === userCover._id}
      onClick={onClick}
      {...attributes}
    >
      <DragHandleIcon
        fontSize="small"
        sx={{ mr: 0.5, color: "text.secondary", cursor: "grab", flexShrink: 0 }}
        {...listeners}
      />
      <ListItemText primary={userCover.title} />
    </ListItemButton>
  );
}

function orderKey(userId) {
  return `pageforge-order-${userId}`;
}

function applyStoredOrder(covers, userId) {
  const saved = JSON.parse(localStorage.getItem(orderKey(userId)) || "[]");
  if (saved.length === 0) return covers;
  return [...covers].sort((a, b) => {
    const aIndex = saved.indexOf(a._id);
    const bIndex = saved.indexOf(b._id);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}

export default function VerticalDrawer(props) {
  const navigate = useNavigate();
  const { coverId: routeCoverId } = useParams();
  const deleteSuccess = useAppStore(s => s.deleteSuccess);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const defaultContent = <EmptyState userCovers={props.userCovers} />;

  const [open, setOpen] = useState(() => window.innerWidth >= 600);
  const [cover, setCover] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [content, setContent] = useState(defaultContent);
  const [title, setTitle] = useState("Welcome to Page Forge!");
  const [editingTitle, setEditingTitle] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCoverId, setSelectedCoverId] = useState(null);
  const [orderedCovers, setOrderedCovers] = useState([]);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [duplicateName, setDuplicateName] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  useEffect(() => {
    if (isMobile) setOpen(false);
  }, [isMobile]);

  useEffect(() => {
    if (!props.userCovers) return;
    setOrderedCovers(applyStoredOrder(props.userCovers, getState("userID")));
  }, [props.userCovers]);

  useEffect(() => {
    if (!routeCoverId || !props.userCovers) return;
    const found = props.userCovers.find(c => c._id === routeCoverId);
    if (found) {
      setCover(found);
      setTitle(found.title);
      setState("cover", found);
      setContent(<Page cover={found} />);
      setSelectedCoverId(found._id);
    }
  }, [routeCoverId, props.userCovers]);

  useEffect(() => {
    document.title = cover ? `${cover.title} | Page Forge` : "Page Forge";
  }, [cover]);

  useEffect(() => {
    if (deleteSuccess) resetContent();
  }, [deleteSuccess]);

  const handleDragEnd = event => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setOrderedCovers(covers => {
      const oldIndex = covers.findIndex(c => c._id === active.id);
      const newIndex = covers.findIndex(c => c._id === over.id);
      const reordered = arrayMove(covers, oldIndex, newIndex);
      localStorage.setItem(orderKey(getState("userID")), JSON.stringify(reordered.map(c => c._id)));
      return reordered;
    });
  };

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const menuOpen = event => setAnchorEl(event.currentTarget);
  const menuClose = () => setAnchorEl(null);

  const handleInfoOpen = () => {
    menuClose();
    setState("info", true);
  };

  const saveCover = () => saveUserCover();
  const deleteCover = () => setState("deleteC", true);

  const openDuplicateDialog = () => {
    menuClose();
    setDuplicateName(cover.title + " (copy)");
    setDuplicateDialogOpen(true);
  };

  const handleDuplicateConfirm = () => {
    const name = duplicateName.trim();
    if (!name) return;
    duplicateUserCover({ ...cover, title: name });
    setDuplicateDialogOpen(false);
  };

  const handleTitleBlur = event => {
    const newTitle = event.target.value.trim();
    setEditingTitle(false);
    if (newTitle && newTitle !== cover.title) {
      renameUserCover(cover._id, newTitle).then(() => getUserCovers());
      setTitle(newTitle);
      setCover(c => ({ ...c, title: newTitle }));
    }
  };

  const handleTitleKeyDown = event => {
    if (event.key === "Enter") event.target.blur();
    if (event.key === "Escape") setEditingTitle(false);
  };

  const resetContent = () => {
    setCover(null);
    setState("cover", null);
    setContent(<EmptyState userCovers={props.userCovers} />);
    setTitle("Welcome to Page Forge!");
    setEditingTitle(false);
    setSelectedCoverId(null);
    navigate("/dashboard");
  };

  const filteredCovers = orderedCovers.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <StyledAppBar position="fixed" open={isMobile ? false : open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(!isMobile && open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          {cover && editingTitle ? (
            <TextField
              variant="standard"
              defaultValue={title}
              autoFocus
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              sx={{ flex: 1 }}
              inputProps={{ style: { fontSize: "1.25rem", fontWeight: 500 } }}
            />
          ) : (
            <Typography
              variant="h6"
              noWrap
              align="left"
              sx={{ flex: 1, cursor: cover ? "text" : "default" }}
              onClick={() => { if (cover) setEditingTitle(true); }}
            >
              {title}
            </Typography>
          )}

          {cover ? (
            <IconButton aria-label="save" onClick={saveCover}>
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
              <MenuItem onClick={openDuplicateDialog}>
                <ListItemIcon>
                  <FileCopyIcon fontSize="small" />
                </ListItemIcon>
                <Typography>Duplicate</Typography>
              </MenuItem>
            ) : null}

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

      <Dialog open={duplicateDialogOpen} onClose={() => setDuplicateDialogOpen(false)}>
        <DialogTitle>Duplicate Page</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="New page name"
            value={duplicateName}
            onChange={e => setDuplicateName(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleDuplicateConfirm();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDuplicateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDuplicateConfirm} color="primary" disabled={!duplicateName.trim()}>
            Duplicate
          </Button>
        </DialogActions>
      </Dialog>

      <Drawer
        sx={{
          position: "relative",
          width: isMobile ? 0 : drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: drawerWidth }
        }}
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
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
        <TextField
          size="small"
          placeholder="Search..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          sx={{ mx: 1, my: 1 }}
        />
        <List sx={{ pt: 0 }}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredCovers.map(c => c._id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredCovers.map(userCover => (
                <SortableCoverItem
                  key={userCover._id}
                  userCover={userCover}
                  selectedCoverId={selectedCoverId}
                  onClick={() => {
                    setCover(userCover);
                    setTitle(userCover.title);
                    setState("cover", userCover);
                    setContent(<Page cover={userCover} />);
                    setSelectedCoverId(userCover._id);
                    navigate(`/dashboard/${userCover._id}`);
                    if (isMobile) setOpen(false);
                  }}
                />
              ))}
            </SortableContext>
          </DndContext>
        </List>

        <NewCover />
      </Drawer>
      <Main open={isMobile ? true : open}>
        <ErrorBoundary>
          {content}
        </ErrorBoundary>
      </Main>
    </div>
  );
}
