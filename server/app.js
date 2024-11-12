const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose")
const DATABASE_URL = "mongodb://127.0.0.1:27017/cohort-tools-api";
const Cohort = require("./models/Cohorts.model")
const Student = require("./models/Students.model")
const PORT = 5005;


// STATIC DATA 
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
const cohorts = require("./cohorts.json"); // added this day1
const students = require("./students.json"); // added this day1
// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE: Research Team - Set up CORS middleware here (R-D1)
const cors = require("cors"); // Import CORS (R-D1)

// Option 1: Enable CORS with default options:
// app.use(cors());
// Option 2: Restrictive access, allowing requests from specific IP addresses and domains


mongoose
  .connect(DATABASE_URL)
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

app.use(
  cors({
    origin: ["http://localhost:5005", "http://localhost:5173/"], // Add the URLs of allowed origins to this array
  })
);

// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});
// added on day 1
app.get("/api/cohorts", (req, res, next) => {
  res.json(cohorts);
});
//added on day 1
app.get("/api/students", (req, res, next) => {
  res.json(students);
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
