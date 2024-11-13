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
//const cohorts = require("./cohorts.json"); // added this day1
//const students = require("./students.json"); // added this day1
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
// Cohort REST

// posting (creating) new cohort
app.post("/api/cohorts",(req,res)=>{
  Cohort.create({
    inprogress: req.body.inprogress,
    cohortSlug: req.body.cohortSlug,
    cohortName: req.body.cohortName,
    program: req.body.program,
    campus: req.body.campus,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    programManager: req.body.programManager,
    leadTeacher: req.body.leadTeacher,
    totalHours: req.body.totalHours
  }).then((createdCohort) => {
    console.log("cohort created ->", createdCohort);
    res.status(201).json(createdCohort);
})
  .catch((error) => {
    console.error("Error while creating the cohort ->", error);
    res.status(500).json({ error: "Failed to create the cohort" });
  });
})

//app.get("/api/cohorts", (req, res, next) => {
 // res.json(cohorts);
//});

//getting all cohorts
app.get('/api/cohorts',(req,res)=>{
  Cohort.find()
  .then(cohortsArray => res.json(cohortsArray))
  .catch((error)=>{console.log("Error getting cohorts array",error);
    res.status(500).json({error:"Failed to get cohorts array from DB"})
  })
})
//getting cohort by ID
app.get('/api/cohorts/:cohortId',(req,res)=>{
  const {cohortId} = req.params;
  Cohort.find({_id:cohortId})
  .then(cohortById => res.json(cohortById))
  .catch((error)=>{console.log("Error getting cohort by its ID",error);
    res.status(500).json({error:"Failed to get cohort by its Id from DB"})
  })
})
//Editing (Patch) cohort
app.patch("/api/cohorts/:cohortId", (req,res)=>{
  const {cohortId} = req.params;
  
  const updatedCohort = req.body;
  console.log(updatedCohort)

  Cohort.findByIdAndUpdate(cohortId,updatedCohort,{new:true})
  .then((newcohort)=> res.json(newcohort))
  .catch((error)=>{
    console.log("Failed to Update cohort", error)
    res.status(500).json({error:"Failed to update cohort"})
  })
})
//deleteing cohort by its id
app.delete("/api/cohorts/:cohortId", (req,res)=>{
  const {cohortId} = req.params;
  
  Cohort.findByIdAndDelete(cohortId)
  .then((deletedCohort)=> res.json(deletedCohort))
  .catch((error)=>{
    console.log("Failed to delete cohort", error)
    res.status(500).json({error:"Failed to delete cohort"})
  })
})
//Create a student
app.post('/api/students',(req,res)=>{
  const newStudent = req.body;
  Student.create(newStudent)
  .then((response)=>res.json(response))
  .catch((error)=>{console.log("failed to create new student", error)
    res.status(500).json({error: "Failed to create student"})
  })
})

//Get all students
app.get('/api/students',(req,res)=>{
  Student.find()
  .populate("cohort")
  .then(studentsArray => res.json(studentsArray))
  .catch((error)=>{console.log("Error getting students array",error);
    res.status(500).json({error:"Failed to get students array from DB"})
  })
})
//Get students from specific Cohort
app.get('/api/students/cohort/:cohortId',(req,res)=>{
    const {cohortId} = req.params;

    Student.find({cohort: cohortId})
    .populate("cohort")
    .then((filteredStudents)=> res.json(filteredStudents))
    .catch((error)=>{
      console.log("Error getting cohorts studetns",e)
      res.status(500).json({error: "Failed to retreive students from that cohort"})
    })
})
//get students by a specific student ID
app.get('/api/students/:studentId', (req,res)=>{
  const {studentId} = req.params;

  Student.findById(studentId)
  .populate("cohort")
  .then((filteredstudent)=>res.json(filteredstudent))
  .catch((error)=>{
    console.log("Error getting student by ID",error);
    res.status(500).json({error: "Failed to get student by ID"})
    })
})

//edit (Patch) student by its ID
app.patch("/api/students/:studentId", (req,res)=>{
  const {studentId} = req.params;
  const updatedStudent = req.body;
  Student.findByIdAndUpdate(studentId,updatedStudent,{new:true})
  .populate("cohort")
  .then((updatedStudent)=> res.json(updatedStudent))
  .catch((error)=>{
    console.log("Failed to Update student", error)
    res.status(500).json({error:"Failed to update student"})
  })
})

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
