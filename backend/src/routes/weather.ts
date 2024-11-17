// src/routes/weather.ts

import { Router } from "express";
import {
  fetchWeatherData,
  getAllWeatherData,
  updateTags,
} from "../controllers/weatherController";

const router = Router();

// Endpoint to fetch and store weather data for a specific city
router.get("/fetch", fetchWeatherData);

// Endpoint to get all weather data with optional pagination and filtering
router.get("/", getAllWeatherData);

// Endpoint to update tags for a specific weather data entry
router.put("/:id/tags", updateTags);

export default router;
