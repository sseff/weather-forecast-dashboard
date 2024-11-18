"use strict";
// src/controllers/weatherController.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTags = exports.getAllWeatherData = exports.fetchWeatherData = void 0;
const axios_1 = __importDefault(require("axios"));
const WeatherData_1 = __importDefault(require("../models/WeatherData"));
// Fetch Weather Data for a Specific City
const fetchWeatherData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const city = req.query.city;
        if (!city) {
            res.status(400).json({ error: "City parameter is required." });
            return;
        }
        // Fetch weather data from external API (e.g., OpenWeatherMap)
        const apiKey = process.env.WEATHER_API_KEY;
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const response = yield axios_1.default.get(apiUrl);
        const data = response.data;
        // Extract necessary fields, including timezone
        const weatherEntry = {
            city: data.name,
            temperature: data.main.temp,
            description: data.weather[0].description,
            date: new Date(data.dt * 1000).toISOString(), // Convert UNIX timestamp to ISO string
            tags: [],
            timezone: data.timezone, // Timezone offset in seconds
        };
        // Save to database
        const weatherData = new WeatherData_1.default(weatherEntry);
        yield weatherData.save();
        res
            .status(201)
            .json({
            message: "Weather data fetched and saved successfully.",
            data: weatherData,
        });
    }
    catch (error) {
        console.error("Error fetching weather data:", error.message);
        res.status(500).json({ error: "Failed to fetch weather data." });
    }
});
exports.fetchWeatherData = fetchWeatherData;
// Get All Weather Data with Optional Pagination and Filtering
const getAllWeatherData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page || "1");
        const limit = parseInt(req.query.limit || "10");
        const tag = req.query.tag;
        const city = req.query.city;
        // Build query object
        let query = {};
        if (tag) {
            query.tags = tag;
        }
        if (city) {
            const cities = city.split(",").map((c) => c.trim());
            query.city = { $in: cities };
        }
        const weatherData = yield WeatherData_1.default.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ date: -1 }); // Optional: Sort by date descending
        const total = yield WeatherData_1.default.countDocuments(query);
        res.status(200).json({
            data: weatherData,
            total,
            page,
            pages: Math.ceil(total / limit),
        });
    }
    catch (error) {
        console.error("Error fetching weather data:", error.message);
        next(error);
    }
});
exports.getAllWeatherData = getAllWeatherData;
// Update Tags for a Specific Weather Data Entry
const updateTags = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { tags } = req.body;
        if (!tags || !Array.isArray(tags)) {
            res.status(400).json({ error: "Tags must be provided as an array." });
            return;
        }
        const updatedWeatherData = yield WeatherData_1.default.findByIdAndUpdate(id, { tags }, { new: true });
        if (!updatedWeatherData) {
            res.status(404).json({ error: "Weather data not found." });
            return;
        }
        res.status(200).json(updatedWeatherData);
    }
    catch (error) {
        console.error("Error updating tags:", error.message);
        next(error);
    }
});
exports.updateTags = updateTags;
