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

export default function PageDashboard() {
  const {
    pageError,
    pageSuccess,
    userPages,
    info,
    deleteC,
    saveSuccess,
    currentUser,
    deleteSuccess
  } = useAppStore(
    useShallow(state => ({
      pageError: state.pageError,
      pageSuccess: state.pageSuccess,
      userPages: state.userPages,
      info: state.info,
      deleteC: state.deleteC,
      saveSuccess: state.saveSuccess,
      currentUser: state.currentUser,
      deleteSuccess: state.deleteSuccess
    }))
  );

  return (
    <Fragment>
      <Container className="page" maxWidth={false} disableGutters={true}>
        <VerticalDrawer userPages={userPages} />
      </Container>

      {pageError && (
        <Snackbar severity="error" message={pageError} />
      )}

      {pageSuccess === true && (
        <Snackbar severity="success" message="Successfully created!" />
      )}
      {saveSuccess === true && (
        <Snackbar severity="success" message="Saved" />
      )}
      {deleteSuccess === true && (
        <Snackbar severity="success" message="Deleted" />
      )}

      {info === true && <Info currentUser={currentUser} />}
      {deleteC === true && <Delete />}
    </Fragment>
  );
}
