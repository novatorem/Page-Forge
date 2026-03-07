import { createRoot } from "react-dom/client";

import App from "./App";
import { setEmptyState } from "./actions/helpers";

import "./index.css";

setEmptyState();

const root = createRoot(document.getElementById("root"));
root.render(<App />);
