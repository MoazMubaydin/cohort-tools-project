const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cohortSchema = new Schema({
  inprogress: { type: Boolean, required: true, default: false },
  cohortSlug: { type: String, required: true },
  cohortName: { type: String, required: true },
  program: { type: String, required: true },
  campus: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  programManager: { type: String, required: true },
  leadTeacher: { type: String, required: true },
  totalHours: { type: Number, required: true, min: 0 },
});

// CREATE MODEL
const Cohort = mongoose.model("Cohort", cohortSchema);

// EXPORT THE MODELS
module.exports = Cohort;
