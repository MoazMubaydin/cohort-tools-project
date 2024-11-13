const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    linkedinUrl: { type: String },
    languages: { type: [String], required: true },
    program: { type: String, required: true },
    background: { type: String },
    image: { type: String },
    projects: { type: Array },
    cohort: { type: Schema.Types.ObjectId, ref: "Cohort", required: true }
  });
  
  // CREATE MODEL
  const Student = mongoose.model("Student", studentSchema);
  
  // EXPORT THE MODELS
  module.exports = Student;