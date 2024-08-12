require("dotenv").config();
const express = require("express");
process.env.TZ = "Asia/Kolkata";
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cookieparser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 8000;

app.use(cookieparser());
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection failed");
  }
};
connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to the server");
});

// Routes
app.use("/api/user", require("./src/routes/user"));
app.use("/api/payment", require("./src/routes/payment"));

app.listen(port, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running on port ${port}`);
});
