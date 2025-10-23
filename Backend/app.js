require("dotenv").config(); // ✅ Ensure env variables are loaded first

const express = require("express");
const connectDB = require("./config/database");
const config = require("./config/config");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const PORT = config.port;

// ✅ Connect to MongoDB
connectDB();

// ✅ CORS setup (make sure it matches frontend URL & allows credentials)
app.use(cors({
    origin: "http://localhost:5173",  // Replace with your actual frontend origin
    credentials: true                // Important: allow cookies and headers
}));

// ✅ Parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// ✅ Root Test Endpoint
app.get("/", (req, res) => {
    res.json({ message: "Hello from POS Server!" });
});

// ✅ Route Mounts
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/order", require("./routes/orderRoute"));
app.use("/api/table", require("./routes/tableRoute"));
app.use("/api/payment", require("./routes/paymentRoute"));

// ✅ Global Error Handler
app.use(globalErrorHandler);

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`☑️  POS Server is listening on port ${PORT}`);
});
