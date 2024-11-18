"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const weather_1 = __importDefault(require("./routes/weather"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
// Connect to MongoDB
mongoose_1.default
    .connect(process.env.MONGO_URI || "", {})
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("MongoDB connection error:", error));
// Middleware
app.use(express_1.default.json());
// Routes will be added here later
app.use("/api/weather", weather_1.default);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
