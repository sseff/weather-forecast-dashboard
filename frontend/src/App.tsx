// src/App.tsx

import React from "react";
import { CssBaseline, Container } from "@mui/material";
import Navbar from "./components/Navbar";
import WeatherList from "./pages/WeatherList";

const App: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="lg" sx={{ marginTop: 4 }}>
        <WeatherList />
      </Container>
    </>
  );
};

export default App;
