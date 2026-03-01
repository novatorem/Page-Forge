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
    coverShort,
    coverSuccess,
    userCovers,
    info,
    deleteC,
    saveSuccess,
    introCover,
    currentUser,
    deleteSuccess
  } = useAppStore(
    useShallow(state => ({
      cover: state.cover,
      coverShort: state.coverShort,
      coverSuccess: state.coverSuccess,
      userCovers: state.userCovers,
      info: state.info,
      deleteC: state.deleteC,
      saveSuccess: state.saveSuccess,
      introCover: state.introCover,
      currentUser: state.currentUser,
      deleteSuccess: state.deleteSuccess
    }))
  );

  return (
    <Fragment>
      <Container className="cover" maxWidth={false} disableGutters={true}>
        <VerticalDrawer userCovers={userCovers} introCover={introCover} />
      </Container>

      {coverShort === true && (
        <Snackbar
          severity="warning"
          message="Title length has to be between 1 and 12 characters"
        />
      )}

      {coverSuccess === true && (
        <Snackbar severity="success" message="Succesfully created!" />
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
