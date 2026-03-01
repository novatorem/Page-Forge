import { useEffect } from "react";

import MainView from "./MainView";
import Login from "./react-components/Login";
import useAppStore from "./store";

import { readCookie } from "./actions/user";

import "./App.css";

export default function App() {
  useEffect(() => { readCookie(); }, []);
  const currentUser = useAppStore(state => state.currentUser);

  return (
    <div className="app">{!currentUser ? <Login /> : <MainView />}</div>
  );
}
