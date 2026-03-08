import { Fragment } from "react";
import Container from "@mui/material/Container";
import { useShallow } from "zustand/react/shallow";

import Delete from "./delete";
import Info from "../Shared/info";
import VerticalDrawer from "./drawers";
import Snackbar from "../Shared/snackbar";
import useAppStore from "../../store";

import "./../../App.css";
import "./styles.css";

export default function Cover() {
  const {
    cover,
    coverError,
    coverSuccess,
    userCovers,
    info,
    deleteC,
    saveSuccess,
    currentUser,
    deleteSuccess
  } = useAppStore(
    useShallow(state => ({
      cover: state.cover,
      coverError: state.coverError,
      coverSuccess: state.coverSuccess,
      userCovers: state.userCovers,
      info: state.info,
      deleteC: state.deleteC,
      saveSuccess: state.saveSuccess,
      currentUser: state.currentUser,
      deleteSuccess: state.deleteSuccess
    }))
  );

  return (
    <Fragment>
      <Container className="cover" maxWidth={false} disableGutters={true}>
        <VerticalDrawer userCovers={userCovers} />
      </Container>

      {coverError && (
        <Snackbar severity="error" message={coverError} />
      )}

      {coverSuccess === true && (
        <Snackbar severity="success" message="Successfully created!" />
      )}
      {saveSuccess === true && (
        <Snackbar severity="success" message="Saved" />
      )}
      {deleteSuccess === true && (
        <Snackbar severity="success" message="Deleted" />
      )}

      {info === true && <Info currentUser={currentUser} />}
      {deleteC === true && <Delete title={cover.title} />}
    </Fragment>
  );
}
