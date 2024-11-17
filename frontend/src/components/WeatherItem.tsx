import React, { useState, useContext } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  Snackbar,
  Alert,
  Autocomplete,
  TextField,
  Box,
} from "@mui/material";
import { WeatherDataContext } from "../context/WeatherDataContext";
import axios from "axios";
import {
  WbSunny,
  Cloud,
  AcUnit,
  Grain,
  Thunderstorm,
} from "@mui/icons-material";
import { format, toZonedTime } from "date-fns-tz";
import { cityTimezones } from "../data/cities";

interface WeatherData {
  _id: string;
  city: string;
  temperature: number;
  description: string;
  date: string; // ISO string
  tags: string[];
  timezone: number; // Timezone offset from UTC in seconds
}

interface WeatherItemProps {
  data: WeatherData;
}

const WeatherItem: React.FC<WeatherItemProps> = ({ data }) => {
  const { refreshData } = useContext(WeatherDataContext);

  // Snackbar state for notifications
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning"
  >("success");

  // Local state for new tag input
  const [newTag, setNewTag] = useState<string>("");

  // Example existing tags for autocomplete suggestions
  const existingTags = [
    "Sunny",
    "Rainy",
    "Cloudy",
    "Windy",
    "Snowy",
    "Thunderstorm",
    "Foggy",
    "Drizzle",
    "Hail",
    "Cold",
    "Warm",
    "Humid",
    "Dry",
    "Clear",
    "Overcast",
  ];

  const handleAddTag = async () => {
    const trimmedTag = newTag.trim(); // Preserve original case
    if (
      trimmedTag &&
      !data.tags.some((tag) => tag.toLowerCase() === trimmedTag.toLowerCase())
    ) {
      const updatedTags = [...data.tags, trimmedTag];
      try {
        await axios.put(`/api/weather/${data._id}/tags`, { tags: updatedTags });
        setNewTag("");
        refreshData(); // Refresh data to ensure consistency
        setSnackbarMessage("Tag added successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      } catch (error) {
        console.error("Error updating tags:", error);
        setSnackbarMessage("Failed to add tag.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } else if (!trimmedTag) {
      setSnackbarMessage("Tag cannot be empty.");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
    } else {
      setSnackbarMessage("Tag already exists.");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
    }
  };

  const handleDeleteTag = async (tagToDelete: string) => {
    const updatedTags = data.tags.filter(
      (tag) => tag.toLowerCase() !== tagToDelete.toLowerCase()
    );
    try {
      await axios.put(`/api/weather/${data._id}/tags`, { tags: updatedTags });
      refreshData(); // Refresh data to ensure consistency
      setSnackbarMessage("Tag deleted successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error deleting tag:", error);
      setSnackbarMessage("Failed to delete tag.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Function to select appropriate icon based on weather description
  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes("cloud")) return <Cloud color="action" />;
    if (desc.includes("sun") || desc.includes("clear"))
      return <WbSunny color="action" />;
    if (desc.includes("snow")) return <AcUnit color="action" />;
    if (desc.includes("rain") || desc.includes("drizzle"))
      return <Grain color="action" />;
    if (desc.includes("thunderstorm")) return <Thunderstorm color="action" />;
    return null;
  };

  // Adjust date based on timezone with validation
  let formattedDate = "Invalid date";
  if (data.date) {
    const dateUTC = new Date(data.date);
    if (!isNaN(dateUTC.getTime())) {
      // Get the timezone name based on the city
      const timezoneName = cityTimezones[data.city] || "UTC";
      try {
        const zonedDate = toZonedTime(dateUTC, timezoneName);
        formattedDate = format(zonedDate, "yyyy-MM-dd HH:mm:ss zzz", {
          timeZone: timezoneName,
        });
      } catch (error) {
        console.error("Error in timezone conversion:", error);
      }
    }
  }

  return (
    <>
      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h5" component="div">
              {data.city}
            </Typography>
            {getWeatherIcon(data.description)}
          </Stack>
          <Typography color="text.secondary">{formattedDate}</Typography>
          <Typography variant="body1">
            Temperature: {data.temperature} °C
          </Typography>
          <Typography variant="body1" sx={{ textTransform: "capitalize" }}>
            Description: {data.description}
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{ marginTop: 1, flexWrap: "wrap" }}
          >
            {data.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => handleDeleteTag(tag)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
          {/* Widened Tag Input Line using Box */}
          <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
            <Autocomplete
              freeSolo
              options={existingTags}
              value={newTag}
              onChange={(event, newValue) => {
                setNewTag(newValue || "");
              }}
              onInputChange={(event, newInputValue) => {
                setNewTag(newInputValue);
              }}
              sx={{ flexGrow: 1, marginRight: 1 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Add a tag"
                  variant="outlined"
                  size="small"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
              )}
            />
            <Button variant="contained" onClick={handleAddTag}>
              Add Tag
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default WeatherItem;
