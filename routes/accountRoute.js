// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const validate = require('../utilities/account-validation')

// Login Route
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Logout Route
router.get("/logout", (req, res) => {
    res.clearCookie("jwt");
    req.flash("notice", "You have been logged out.");
    res.redirect("/account/login");
  });

// Registration Route
router.get("/register", 
  utilities.handleErrors(accountController.buildRegister))

// Create Account Route
router.post('/register', 
  validate.registationRules(), 
  validate.checkRegData, 
  utilities.handleErrors(accountController.registerAccount))

// Login to Account Route
router.post("/login", 
  validate.loginRules(), 
  validate.checkLoginData, 
  utilities.handleErrors(accountController.accountLogin))

// Account Management Route
router.get("/", 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildAccount))

// Update Account View
router.get("/update/:account_id", 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildUpdateAccount))

// Update Account Information
router.post("/update", 
  (req, res, next) => {
    console.log("POST /account/update hit");
    next(); // Proceed to the next middleware
  },
  utilities.checkLogin,
  validate.updateAccountRules(),
  validate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Update Account Password
router.post("/update/update-password", 
  utilities.checkLogin, validate.updatePasswordRules(), 
  validate.checkUpdatePasswordData, 
  utilities.handleErrors(accountController.updatePassword))

module.exports = router;