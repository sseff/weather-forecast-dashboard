"use strict";
// src/models/WeatherData.ts
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const WeatherDataSchema = new mongoose_1.Schema({
    city: { type: String, required: true },
    temperature: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    tags: { type: [String], default: [] },
    timezone: { type: Number, required: true },
});
exports.default = (0, mongoose_1.model)("WeatherData", WeatherDataSchema);
