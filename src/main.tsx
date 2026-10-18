import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { activeConfig } from "./config";
import "@fontsource-variable/nunito";
import "./styles/gma-theme.css";

document.title = `${activeConfig.title} ${activeConfig.municipality}`;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <App config={activeConfig} />
    </HashRouter>
  </React.StrictMode>
);
