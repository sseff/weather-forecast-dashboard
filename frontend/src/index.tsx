// src/index.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { WeatherDataProvider } from "./context/WeatherDataContext";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WeatherDataProvider>
        <App />
      </WeatherDataProvider>
    </ThemeProvider>
  </React.StrictMode>
);
