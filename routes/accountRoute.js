// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Login Route
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Registration Route
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Create Account Route
router.post('/register', regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

// Login to Account Route
router.post("/login",  
  (req, res, next) => {
    console.log("Login route hit!");
    next(); // Ensure subsequent middleware runs
  }, regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors(accountController.accountLogin))

// Account Management Route
router.get("/", utilities.handleErrors(accountController.buildAccount))

module.exports = router;