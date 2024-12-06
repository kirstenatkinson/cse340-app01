const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("First name is required."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Last name is required."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("Please provide a valid email.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements. Password must be at least 12 characters long and include uppercase, lowercase, numbers, and special characters."),
    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors: errors.array(),
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }

  /*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required and must already exist in the DB
    body("account_email")
    .trim()
    .escape()
    .notEmpty()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("Please provide a valid email.")
    .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email)
      if (!emailExists){
        throw new Error("Email or password is incorrect. Please try again")
      }
    }),

    // lastname is required and must be string
    body("account_password")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a password.") // on error this message is sent.
      .custom(async (account_password, { req }) => {
        const isValid = await accountModel.verifyPassword(req.body.account_email, account_password);
        if (!isValid) {
          throw new Error("Email or password is incorrect. Please try again.");
        }
      }),
  ]
}

/* ******************************
* Check data and return errors or continue to registration
* ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email} = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/account", {
      errors: errors.array(),
      title: `Welcome to your account!`,
      nav,
      account_email,
    })
    return
  }
  next()
}
  
  module.exports = validate