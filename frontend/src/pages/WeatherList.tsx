// src/pages/WeatherList.tsx

import React, { useContext, useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  CircularProgress,
  Stack,
  Pagination,
  Snackbar,
  Alert,
} from "@mui/material";
import { WeatherDataContext } from "../context/WeatherDataContext";
import WeatherItem from "../components/WeatherItem";
import debounce from "lodash.debounce";
import Autocomplete from "@mui/material/Autocomplete";
import { germanCities } from "../data/cities"; // Import the list of cities

interface WeatherData {
  _id: string;
  city: string;
  temperature: number;
  description: string;
  date: string; // ISO string
  tags: string[];
  timezone: number; // Seconds shift from UTC
}

const ITEMS_PER_PAGE = 15; // Adjust as needed

const WeatherList: React.FC = () => {
  const {
    weatherData,
    fetchWeatherData,
    refreshData,
    loading: globalLoading,
  } = useContext(WeatherDataContext);
  const [filterTag, setFilterTag] = useState<string>("");
  const [selectedCities, setSelectedCities] = useState<
    { label: string; value: string }[]
  >([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filteredData, setFilteredData] = useState<WeatherData[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning"
  >("success");

  const [loading, setLoading] = useState<boolean>(false); // Local loading state

  // Debounced filter handler to minimize state updates
  const handleTagFilterChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const tag = event.target.value.trim();
      setFilterTag(tag);
      setPage(1); // Reset to first page on filter change
    },
    300
  );

  useEffect(() => {
    // Cleanup debounce on unmount
    return () => {
      handleTagFilterChange.cancel();
    };
  }, []);

  // Effect to fetch data when selectedCities changes
  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        setLoading(true);
        // Build query parameters for selected cities
        const params = new URLSearchParams();
        if (selectedCities.length > 0) {
          const cityNames = selectedCities.map((city) => city.value).join(",");
          params.append("city", cityNames);
        }

        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/weather?${params.toString()}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch weather data.");
        }

        const data = await response.json();
        console.log("Fetched Data:", data); // Inspect data

        // Apply case-insensitive tag filtering on the frontend
        let tempFilteredData = data.data;

        if (filterTag) {
          const lowerCaseFilter = filterTag.toLowerCase();
          tempFilteredData = tempFilteredData.filter((entry: WeatherData) =>
            entry.tags.some((tag) => tag.toLowerCase() === lowerCaseFilter)
          );
        }

        setFilteredData(tempFilteredData);
        setTotalPages(Math.ceil(tempFilteredData.length / ITEMS_PER_PAGE));
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching filtered data:", error.message);
        setSnackbarMessage(`Error: ${error.message}`);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        setLoading(false);
      }
    };

    fetchFilteredData();
  }, [selectedCities, filterTag, weatherData]);

  const handleCityFetch = async () => {
    if (selectedCities.length > 0) {
      try {
        // Fetch weather data for each selected city
        for (const city of selectedCities) {
          await fetchWeatherDataForCity(city.value);
        }
        setPage(1); // Reset to first page after fetching new cities
        setSnackbarMessage("Selected cities added successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      } catch (error: any) {
        console.error("Error fetching data for city:", error.message);
        setSnackbarMessage(`Failed to add cities: ${error.message}`);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };

  // Function to fetch weather data for a specific city
  const fetchWeatherDataForCity = async (city: string) => {
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL
        }/weather/fetch?city=${encodeURIComponent(city)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch weather data.");
      }
      await refreshData(); // Refresh the weather data context
    } catch (error: any) {
      console.error("Error fetching weather data for city:", error.message);
      throw error; // Rethrow to handle in the calling function
    }
  };

  // Pagination logic
  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top on page change
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Calculate the data to display on the current page
  const paginatedData = filteredData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div>
      <Container maxWidth="lg" sx={{ marginTop: 4, marginBottom: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Weather Forecasts
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          sx={{ marginBottom: 2 }}
        >
          {/* City Selection Autocomplete for Filtering */}
          <Autocomplete
            multiple
            options={germanCities}
            getOptionLabel={(option) => option.label}
            value={selectedCities}
            onChange={(event, newValue) => {
              setSelectedCities(newValue);
              // setPage(1); // Reset to first page when cities change if needed
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Filter by City"
                variant="outlined"
                size="small"
              />
            )}
            sx={{ minWidth: 500 }}
          />
          {/* Tag Filter */}
          <TextField
            label="Filter by tag"
            variant="outlined"
            onChange={handleTagFilterChange}
            size="small"
            fullWidth
          />
          <Typography variant="body1" color="textSecondary">
            Showing {filteredData.length} forecasts
          </Typography>
        </Stack>
        {loading || globalLoading ? (
          <Stack alignItems="center" sx={{ marginTop: 4 }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              Loading weather data...
            </Typography>
          </Stack>
        ) : (
          <>
            {filteredData.length === 0 ? (
              <Typography variant="h6">
                No forecasts match the selected filters.
              </Typography>
            ) : (
              <>
                <Stack spacing={2}>
                  {paginatedData.map((data) => (
                    <WeatherItem key={data._id} data={data} />
                  ))}
                </Stack>
                {/* Pagination */}
                {totalPages > 1 && (
                  <Stack alignItems="center" sx={{ marginTop: 4 }}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handleChangePage}
                      color="primary"
                    />
                  </Stack>
                )}
              </>
            )}
          </>
        )}
      </Container>
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
    </div>
  );
};

export default WeatherList;
