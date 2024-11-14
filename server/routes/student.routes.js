
const router = require("express").Router();
const Student = require("../models/Students.model");


// Create a student
router.post("/api/students", (req, res) => {
    const newStudent = req.body;
    Student.create(newStudent)
      .then((response) => res.json(response))
      .catch((error) => {
        console.log("failed to create new student", error);
        res.status(500).json({ error: "Failed to create student" });
      });
  });
  
  // Get all students
  router.get("/api/students", (req, res) => {
    Student.find()
      .populate("cohort")
      .then((studentsArray) => res.json(studentsArray))
      .catch((error) => {
        console.log("Error getting students array", error);
        res.status(500).json({ error: "Failed to get students array from DB" });
      });
  });
  
  // Get students from specific Cohort
  router.get("/api/students/cohort/:cohortId", (req, res) => {
    const { cohortId } = req.params;
  
    Student.find({ cohort: cohortId })
      .populate("cohort")
      .then((filteredStudents) => res.json(filteredStudents))
      .catch((error) => {
        console.log("Error getting cohorts studetns", e);
        res
          .status(500)
          .json({ error: "Failed to retreive students from that cohort" });
      });
  });
  
  // get students by a specific student ID
  router.get("/api/students/:studentId", (req, res) => {
    const { studentId } = req.params;
  
    Student.findById(studentId)
      .populate("cohort")
      .then((filteredstudent) => res.json(filteredstudent))
      .catch((error) => {
        console.log("Error getting student by ID", error);
        res.status(500).json({ error: "Failed to get student by ID" });
      });
  });
  
  // Edit (Patch) student by its ID
  router.patch("/api/students/:studentId", (req, res) => {
    const { studentId } = req.params;
    const updatedStudent = req.body;
    Student.findByIdAndUpdate(studentId, updatedStudent, { new: true })
      .populate("cohort")
      .then((updatedStudent) => res.json(updatedStudent))
      .catch((error) => {
        console.log("Failed to Update student", error);
        res.status(500).json({ error: "Failed to update student" });
      });
  });
  
  // Delete student by its ID
  router.delete("/api/students/:studentId", (req, res) => {
    const { studentId } = req.params;
  
    Student.findByIdAndDelete(studentId)
      .populate("cohort")
      .then((deletedStudent) => res.json(deletedStudent))
      .catch((error) => {
        console.log("Failed to delete student", error);
        res.status(500).json({ error: "Failed to delete student" });
      });
  });
  
  //router.get("/api/students", (req, res, next) => {
  //  res.json(students);
  //});

module.exports = router;