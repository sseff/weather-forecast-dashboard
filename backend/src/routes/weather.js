"use strict";
// src/routes/weather.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const weatherController_1 = require("../controllers/weatherController");
const router = (0, express_1.Router)();
// Endpoint to fetch and store weather data for a specific city
router.get("/fetch", weatherController_1.fetchWeatherData);
// Endpoint to get all weather data with optional pagination and filtering
router.get("/", weatherController_1.getAllWeatherData);
// Endpoint to update tags for a specific weather data entry
router.put("/:id/tags", weatherController_1.updateTags);
exports.default = router;
