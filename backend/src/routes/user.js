const express = require("express");
const {
  userSignUp,
  userLogin,
  getUser,
  getUserById,
} = require("../controllers/userController");

const router = express.Router(); //Creating an instance of the express Router

//REQUEST HANDLERS

//criar um novo user
router.post("/auth/signup", userSignUp);

//login de um user
router.post("/auth/login", userLogin);

// get a user
router.get("/user", getUser);

//get a user by id
router.get("/user/:id", getUserById);

module.exports = router;
