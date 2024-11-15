const router = require("express").Router();
const isAuthenticated = require("../middleware/jwt.middleware");
const Cohort = require("../models/Cohorts.model");

// Create (post) new cohort
router.post("/cohorts", isAuthenticated, (req, res) => {
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
    totalHours: req.body.totalHours,
  })
    .then((createdCohort) => {
      console.log("cohort created ->", createdCohort);
      res.status(201).json(createdCohort);
    })
    .catch((error) => {
      console.error("Error while creating the cohort ->", error);
      res.status(500).json({ error: "Failed to create the cohort" });
    });
});

// Get all cohorts
router.get("/cohorts", (req, res) => {
  Cohort.find()
    .then((cohortsArray) => res.json(cohortsArray))
    .catch((error) => {
      console.log("Error getting cohorts array", error);
      res.status(500).json({ error: "Failed to get cohorts array from DB" });
    });
});

// Get cohort by id
router.get("/cohorts/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  Cohort.find({ _id: cohortId })
    .then((cohortById) => res.json(cohortById))
    .catch((error) => {
      console.log("Error getting cohort by its ID", error);
      res.status(500).json({ error: "Failed to get cohort by its Id from DB" });
    });
});

// Edit cohort by id
router.patch("/cohorts/:cohortId", isAuthenticated, (req, res) => {
  const { cohortId } = req.params;

  const updatedCohort = req.body;
  console.log(updatedCohort);

  Cohort.findByIdAndUpdate(cohortId, updatedCohort, { new: true })
    .then((newcohort) => res.json(newcohort))
    .catch((error) => {
      console.log("Failed to Update cohort", error);
      res.status(500).json({ error: "Failed to update cohort" });
    });
});

// Delete cohort by id
router.delete("/cohorts/:cohortId", isAuthenticated, (req, res) => {
  const { cohortId } = req.params;

  Cohort.findByIdAndDelete(cohortId)
    .then((deletedCohort) => res.json(deletedCohort))
    .catch((error) => {
      console.log("Failed to delete cohort", error);
      res.status(500).json({ error: "Failed to delete cohort" });
    });
});

module.exports = router;
