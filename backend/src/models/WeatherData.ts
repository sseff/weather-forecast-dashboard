// src/models/WeatherData.ts

import { Schema, model, Document } from "mongoose";

interface WeatherData extends Document {
  city: string;
  temperature: number;
  description: string;
  date: string; // ISO string
  tags: string[];
  timezone: number; // Timezone offset in seconds
}

const WeatherDataSchema = new Schema<WeatherData>({
  city: { type: String, required: true },
  temperature: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  tags: { type: [String], default: [] },
  timezone: { type: Number, required: true },
});

export default model<WeatherData>("WeatherData", WeatherDataSchema);
