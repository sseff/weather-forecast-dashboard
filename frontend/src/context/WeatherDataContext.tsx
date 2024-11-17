// src/context/WeatherDataContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface WeatherData {
  _id: string;
  city: string;
  temperature: number;
  description: string;
  date: string;
  tags: string[];
}

interface WeatherDataContextProps {
  weatherData: WeatherData[];
  setWeatherData: React.Dispatch<React.SetStateAction<WeatherData[]>>;
  fetchWeatherData: () => void;
  refreshData: () => void;
  loading: boolean;
}

export const WeatherDataContext = createContext<WeatherDataContextProps>({
  weatherData: [],
  setWeatherData: () => {},
  fetchWeatherData: () => {},
  refreshData: () => {},
  loading: false,
});

interface WeatherDataProviderProps {
  children: ReactNode;
}

export const WeatherDataProvider: React.FC<WeatherDataProviderProps> = ({
  children,
}) => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Function to fetch all weather data
  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/weather`); // Fetch all data
      setWeatherData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setLoading(false);
    }
  };

  // Function to refresh data
  const refreshData = () => {
    fetchWeatherData();
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  return (
    <WeatherDataContext.Provider
      value={{
        weatherData,
        setWeatherData,
        fetchWeatherData,
        refreshData,
        loading,
      }}
    >
      {children}
    </WeatherDataContext.Provider>
  );
};
