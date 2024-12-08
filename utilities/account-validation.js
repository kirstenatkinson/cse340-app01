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
      body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail()
        .withMessage("Please provide a valid email."),
      body("account_password")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Password is required."),
    ];
  };

/* ******************************
* Check data and return errors or continue to registration
* ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array());
    return res.status(400).render("account/login", {
      title: "Login",
      nav: await utilities.getNav(),
      errors: errors.array(),
    });
  }
  next();
};

/*  **********************************
  *  Update Data Validation Rules
  * ********************************* */
validate.updateAccountRules = () => {
  console.log("Checking with account rules")
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
    .custom(async (account_email, { req }) => {
      // Fetch the account using account_id from the request body
      const accountId = req.body.account_id;
      const currentAccount = await accountModel.getAccountById(accountId);

      // Check if the email is already in use by another account
      const emailExists = await accountModel.checkExistingEmail(account_email);

      if (emailExists && account_email !== currentAccount.account_email) {
        throw new Error("Email exists. Please log in or use a different email.");
      }
    }),
];
};

  /* ******************************
 * Check data and return errors or continue to update
 * ***************************** */
  validate.checkUpdateData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      console.log("Validation errors:", errors.array());
      res.render("account/update", {
        error: errors.array(),
        title: "Update Account",
        nav,
        account_firstname,
        account_lastname,
        account_email,
        account_id,
        mainClass: "management-view"
      })
      return
    }
    next()
  }

  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.updatePasswordRules = () => {
  return [
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
 * Check data and return errors or continue to update password
 * ***************************** */
  validate.checkUpdatePasswordData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/update", {
        error: errors.array(),
        title: "Update Account",
        nav,
        account_firstname: account_firstname || req.session.account_firstname,
        account_lastname: account_lastname || req.session.account_lastname,
        account_email: account_email || req.session.account_email,
        account_id: account_id || req.session.account_id,
        mainClass: "management-view"
      })
      return
    }
    next()
  }
  
  module.exports = validate