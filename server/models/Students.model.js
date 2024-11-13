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
  // The model() method defines a model (Cohort, Student) and creates a collection (cohorts, students) in MongoDB
  // The collection name will default to the lowercased, plural form of the model name:
  
  const Student = mongoose.model("Student", studentSchema);
  
  // EXPORT THE MODELS
  // Export both models in a single object
  module.exports = Student ;