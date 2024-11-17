// src/controllers/weatherController.ts

import { Request, Response, NextFunction } from "express";
import axios from "axios";
import WeatherData from "../models/WeatherData";

// Fetch Weather Data for a Specific City
export const fetchWeatherData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const city = req.query.city as string;
    if (!city) {
      res.status(400).json({ error: "City parameter is required." });
      return;
    }

    // Fetch weather data from external API (e.g., OpenWeatherMap)
    const apiKey = process.env.WEATHER_API_KEY;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await axios.get(apiUrl);
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
    const weatherData = new WeatherData(weatherEntry);
    await weatherData.save();

    res
      .status(201)
      .json({
        message: "Weather data fetched and saved successfully.",
        data: weatherData,
      });
  } catch (error: any) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data." });
  }
};

// Get All Weather Data with Optional Pagination and Filtering
export const getAllWeatherData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt((req.query.page as string) || "1");
    const limit = parseInt((req.query.limit as string) || "10");
    const tag = req.query.tag as string | undefined;
    const city = req.query.city as string | undefined;

    // Build query object
    let query: any = {};
    if (tag) {
      query.tags = tag;
    }
    if (city) {
      const cities = city.split(",").map((c) => c.trim());
      query.city = { $in: cities };
    }

    const weatherData = await WeatherData.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ date: -1 }); // Optional: Sort by date descending

    const total = await WeatherData.countDocuments(query);

    res.status(200).json({
      data: weatherData,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("Error fetching weather data:", error.message);
    next(error);
  }
};

// Update Tags for a Specific Weather Data Entry
export const updateTags = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { tags } = req.body;

    if (!tags || !Array.isArray(tags)) {
      res.status(400).json({ error: "Tags must be provided as an array." });
      return;
    }

    const updatedWeatherData = await WeatherData.findByIdAndUpdate(
      id,
      { tags },
      { new: true }
    );

    if (!updatedWeatherData) {
      res.status(404).json({ error: "Weather data not found." });
      return;
    }

    res.status(200).json(updatedWeatherData);
  } catch (error: any) {
    console.error("Error updating tags:", error.message);
    next(error);
  }
};
