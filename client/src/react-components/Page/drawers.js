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
import NewPage from "./new";
import EmptyState from "../Shared/EmptyState";
import ErrorBoundary from "../Shared/ErrorBoundary";
import { setState, getState, useAppStore } from "../../store";
import { logout } from "../../actions/user";
import { saveUserPage, renameUserPage, duplicateUserPage, getUserPages } from "../../actions/page";

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
    overflowY: "auto",
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

function SortablePageItem({ userPage, selectedPageId, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: userPage._id });
  return (
    <ListItemButton
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      selected={selectedPageId === userPage._id}
      onClick={onClick}
      {...attributes}
    >
      <DragHandleIcon
        fontSize="small"
        sx={{ mr: 0.5, color: "text.secondary", cursor: "grab", flexShrink: 0 }}
        {...listeners}
      />
      <ListItemText primary={userPage.title} />
    </ListItemButton>
  );
}

function orderKey(userId) {
  return `pageforge-order-${userId}`;
}

function applyStoredOrder(pages, userId) {
  const saved = JSON.parse(localStorage.getItem(orderKey(userId)) || "[]");
  if (saved.length === 0) return pages;
  return [...pages].sort((a, b) => {
    const aIndex = saved.indexOf(a._id);
    const bIndex = saved.indexOf(b._id);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}

export default function VerticalDrawer(props) {
  const navigate = useNavigate();
  const { pageId: routePageId } = useParams();
  const deleteSuccess = useAppStore(s => s.deleteSuccess);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const defaultContent = <EmptyState userPages={props.userPages} />;

  const [open, setOpen] = useState(() => window.innerWidth >= 600);
  const [page, setPage] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [content, setContent] = useState(defaultContent);
  const [title, setTitle] = useState("Welcome to Page Forge!");
  const [editingTitle, setEditingTitle] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [orderedPages, setOrderedPages] = useState([]);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [duplicateName, setDuplicateName] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  useEffect(() => {
    if (isMobile) setOpen(false);
  }, [isMobile]);

  useEffect(() => {
    if (!props.userPages) return;
    setOrderedPages(applyStoredOrder(props.userPages, getState("userID")));
  }, [props.userPages]);

  useEffect(() => {
    if (!routePageId || !props.userPages) return;
    const found = props.userPages.find(c => c._id === routePageId);
    if (found) {
      setPage(found);
      setTitle(found.title);
      setState("page", found);
      setContent(<Page page={found} />);
      setSelectedPageId(found._id);
    }
  }, [routePageId, props.userPages]);

  useEffect(() => {
    document.title = page ? `${page.title} | Page Forge` : "Page Forge";
  }, [page]);

  useEffect(() => {
    if (deleteSuccess) resetContent();
  }, [deleteSuccess]);

  const handleDragEnd = event => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setOrderedPages(pages => {
      const oldIndex = pages.findIndex(c => c._id === active.id);
      const newIndex = pages.findIndex(c => c._id === over.id);
      const reordered = arrayMove(pages, oldIndex, newIndex);
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

  const savePage = () => saveUserPage();
  const deletePage = () => setState("deleteC", true);

  const openDuplicateDialog = () => {
    menuClose();
    setDuplicateName(page.title + " (copy)");
    setDuplicateDialogOpen(true);
  };

  const handleDuplicateConfirm = () => {
    const name = duplicateName.trim();
    if (!name) return;
    duplicateUserPage({ ...page, title: name });
    setDuplicateDialogOpen(false);
  };

  const handleTitleBlur = event => {
    const newTitle = event.target.value.trim();
    setEditingTitle(false);
    if (newTitle && newTitle !== page.title) {
      renameUserPage(page._id, newTitle).then(() => getUserPages());
      setTitle(newTitle);
      setPage(c => ({ ...c, title: newTitle }));
    }
  };

  const handleTitleKeyDown = event => {
    if (event.key === "Enter") event.target.blur();
    if (event.key === "Escape") setEditingTitle(false);
  };

  const resetContent = () => {
    setPage(null);
    setState("page", null);
    setContent(<EmptyState userPages={props.userPages} />);
    setTitle("Welcome to Page Forge!");
    setEditingTitle(false);
    setSelectedPageId(null);
    navigate("/dashboard");
  };

  const filteredPages = orderedPages.filter(c =>
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
          {page && editingTitle ? (
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
              sx={{ flex: 1, cursor: page ? "text" : "default" }}
              onClick={() => { if (page) setEditingTitle(true); }}
              onKeyDown={e => { if (page && (e.key === "Enter" || e.key === " ")) setEditingTitle(true); }}
              tabIndex={page ? 0 : undefined}
              role={page ? "button" : undefined}
              aria-label={page ? `Rename page: ${title}` : undefined}
            >
              {title}
            </Typography>
          )}

          {page ? (
            <IconButton aria-label="save" onClick={savePage}>
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

            {page ? (
              <MenuItem onClick={openDuplicateDialog}>
                <ListItemIcon>
                  <FileCopyIcon fontSize="small" />
                </ListItemIcon>
                <Typography>Duplicate</Typography>
              </MenuItem>
            ) : null}

            {page ? (
              <MenuItem onClick={deletePage}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <Typography>Delete</Typography>
              </MenuItem>
            ) : null}

            <Divider />
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
          <IconButton onClick={handleDrawerClose} aria-label="Close drawer">
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
          inputProps={{ "aria-label": "Search pages" }}
        />
        <List sx={{ pt: 0 }}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredPages.map(c => c._id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredPages.map(userPage => (
                <SortablePageItem
                  key={userPage._id}
                  userPage={userPage}
                  selectedPageId={selectedPageId}
                  onClick={() => {
                    setPage(userPage);
                    setTitle(userPage.title);
                    setState("page", userPage);
                    setContent(<Page page={userPage} />);
                    setSelectedPageId(userPage._id);
                    navigate(`/dashboard/${userPage._id}`);
                    if (isMobile) setOpen(false);
                  }}
                />
              ))}
            </SortableContext>
          </DndContext>
        </List>

        <NewPage />
      </Drawer>
      <Main open={isMobile ? true : open}>
        <ErrorBoundary>
          {content}
        </ErrorBoundary>
      </Main>
    </div>
  );
}
