# Weather Forecast Dashboard

Welcome to the **Weather Forecast Dashboard**! This application is designed to gather, tag, and visualize weather forecast data for Germany, providing valuable insights for renewable energy operations. Built with TypeScript, Node.js, React.js, and MongoDB, this project showcases a full-stack implementation tailored to meet the requirements of BayWa r.e. Data Services GmbH's technical challenge.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Project Overview

The **Weather Forecast Dashboard** serves as a tool for renewable energy companies to monitor and analyze weather conditions crucial for their operations. The application performs the following primary functions:

1. **Data Ingestion:** Fetches weather data from the OpenWeatherMap API and stores it in a MongoDB database.
2. **Tagging:** Allows users to tag specific weather data entries through an intuitive React.js interface.
3. **Visualization:** Provides visual representations of the weather data, enabling users to filter and analyze based on applied tags.

## Features

- **Automated Data Fetching:** Retrieve real-time weather data for selected German cities using the OpenWeatherMap API.
- **User-Friendly Tagging Interface:** Easily tag weather data with customizable labels to categorize and prioritize information.
- **Dynamic Visualization:** Interactive tables that update based on user-selected tags, offering insightful data analysis.
- **Responsive Design:** Optimized for various devices, ensuring seamless access from desktops, tablets, and mobile devices.
- **Secure Deployment:** Hosted on Heroku (backend) and Vercel (frontend) with proper CORS configurations and environment variable management.

## Technologies Used

- **Frontend:**
  - React.js
  - TypeScript
  - Material-UI (MUI)
  - Axios
  - date-fns-tz
- **Backend:**
  - Node.js
  - Express.js
  - TypeScript
  - MongoDB & Mongoose
  - Axios
  - dotenv
  - CORS
- **Deployment:**
  - Heroku (Backend)
  - Vercel (Frontend)

## Prerequisites

Before setting up the project locally, ensure you have the following installed:

- **Node.js:** [Download and install](https://nodejs.org/)
- **npm or yarn:** Comes with Node.js, but you can [install yarn](https://yarnpkg.com/) if preferred.
- **MongoDB Atlas Account:** [Sign up here](https://www.mongodb.com/cloud/atlas)
- **Git:** [Download and install](https://git-scm.com/)
- **Heroku CLI:** [Download and install](https://devcenter.heroku.com/articles/heroku-cli)
- **Vercel CLI:** [Optional] [Download and install](https://vercel.com/download)

## Installation

### Backend Setup

1. **Clone the Repository:**

2. **Install Dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the backend directory.

4. **Build the Backend:**

   ```bash
   npm run build
   # or
   yarn build
   ```

5. **Run the Backend Locally:**
   ```bash
   npm start
   # or
   yarn start
   ```
   The backend server should be running at http://localhost:5001.

### Frontend Setup

1. **Navigate to Frontend Directory:**

   ```bash
   cd ../frontend
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the frontend directory:

4. **Run the Frontend Locally:**
   ```bash
   npm start
   # or
   yarn start
   ```
   The frontend application should be running at http://localhost:3000.

## Deployment

### Backend Deployment (Heroku)

1. **Login to Heroku:**

   ```bash
   heroku login
   ```

2. **Create a New Heroku App:**

   ```bash
   heroku create your-backend-app-name
   ```

3. **Set Environment Variables on Heroku:**

   ```bash
   heroku config:set MONGO_URI=your_mongodb_atlas_connection_string --app your-backend-app-name
   heroku config:set WEATHER_API_KEY=your_openweathermap_api_key --app your-backend-app-name
   heroku config:set FRONTEND_URL=https://your-frontend-domain.com --app your-backend-app-name
   ```

4. **Deploy to Heroku:**

   ```bash
   git add .
   git commit -m "Deploy backend to Heroku"
   git push heroku main
   ```

5. **Monitor Deployment Logs:**
   ```bash
   heroku logs --tail --app your-backend-app-name
   ```

### Frontend Deployment (Vercel)

1. Login to Vercel and import your GitHub repository.
2. Configure environment variables during setup.
3. Add `REACT_APP_API_BASE_URL` with the value `https://your-backend-app-name.herokuapp.com/api`.
4. Follow the prompts to complete deployment.

## Usage

1. **Access the Application:**
   Visit your deployed frontend URL (e.g., https://your-frontend-domain.vercel.app).

2. **Fetch Weather Data:**

   - Use the interface to manually trigger data fetching for selected German cities.
   - Alternatively, set up a scheduled task to automate data ingestion.

3. **Tag Weather Data:**

   - Navigate to the tagging section to assign relevant tags.
   - Categorize and prioritize weather conditions.

4. **Visualize Weather Forecasts:**
   - Use visualization tools to view weather data.
   - Apply filters based on tags for specific analyses.

## API Endpoints

### Fetch Weather Data

- **Endpoint:** GET `/api/weather/fetch?city={cityName}`
- **Description:** Fetches and stores weather data for a specified city.
- **Parameters:**
  - `city` (query parameter): Name of the city (e.g., Berlin,de)

### Get All Weather Data

- **Endpoint:** GET `/api/weather`
- **Description:** Retrieves stored weather data with optional pagination and filtering.

## Contact

- **Name:** Sefika Akman
- **Email:** sefikaakman4@hotmail.com

Thank you for exploring the Weather Forecast Dashboard! We hope this tool aids in effective weather data management and visualization for your renewable energy projects.
