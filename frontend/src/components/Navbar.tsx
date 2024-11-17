import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";

const Navbar: React.FC = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <WbSunnyIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div">
          Weather Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
