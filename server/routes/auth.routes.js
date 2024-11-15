const express = require("express");
const bcyrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const router = express.Router();
const saltRounds = 10;
const isAuthenticated = require("../middleware/jwt.middleware");

router.post("/singup", (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Please provide a vaild email address." });
    return;
  }

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 charecters and contain at least one number, one lowercase and one uppercase letter.'",
    });
    return;
  }
  User.findOne({ email: email })
    .then((foundUser) => {
      if (foundUser) {
        res.status(400).json({ message: "Email already used by another user" });
        return;
      }

      const salt = bcyrpt.genSaltSync(saltRounds);
      const hashedPassword = bcyrpt.hashSync(password, salt);
      return User.create({ email, password: hashedPassword, name });
    })
    .then((createdUser) => {
      const { email, name, _id } = createdUser;

      const user = { email, name, _id };

      res.status(201).json({ user });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        res.status(401).json({ message: "User not found." });
        return;
      }

      const passwordCorrect = bcyrpt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        const { _id, email, name } = foundUser;

        const payload = { _id, email, name };

        console.log(process.env.TOKEN_SECRET);

        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: "Unable to authenticate the user" });
      }
    })
    .catch((err) => {
      console.log("Error", err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.get("/verify", isAuthenticated, (req, res, next) => {
  console.log("req.payload:", req.payload);
  res.status(200).json(req.payload);
});

module.exports = router;
