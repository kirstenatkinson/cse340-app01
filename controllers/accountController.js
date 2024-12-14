const accountModel = require("../models/account-model")
const reviewModel = require("../models/review-model")
const bcrypt = require("bcryptjs")
const utilities = require("../utilities/")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      mainClass: "login-view",
      errors: null,
    })
  }
  
/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      mainClass: "registration-view",
      errors: null,
    })
  }
  
/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
  
    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
        mainClass: "registration-view"
        })
    }

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).redirect("/account/login")
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
        mainClass: "registration-view"
      })
    }
  }

  /* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Deliver account view
* *************************************** */
async function buildAccount(req, res, next) {
  const account_id = res.locals.accountData.account_id;
  let nav = await utilities.getNav()
  const reviewData = await reviewModel.getReviewsByAccountId(account_id)
  const accountReviews = await utilities.accountReviewList(reviewData)
  res.render("account/account", {
    title: "Account Management",
    nav,
    accountReviews,
    mainClass: "management-view",
    errors: null,
  })
}

/* ***************************
 *  Deliver Update Account View by Account Id
 * ************************** */
async function buildUpdateAccount(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  let nav = await utilities.getNav()
  const userData = await accountModel.getAccountById(account_id)
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_id: userData.account_id,
    account_firstname: userData.account_firstname,
    account_lastname: userData.account_lastname,
    account_email: userData.account_email,
    mainClass: "management-view"
  })
}

/* ***************************
 *  Update Account Data
 * ************************** */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  } = req.body
  const updateResult = await accountModel.updateAccount (
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  )

  if (updateResult) {
    // Create new JWT with updated account data
    const updatedAccount = { account_id, account_firstname, account_lastname, account_email };
    const token = jwt.sign(updatedAccount, process.env.ACCESS_TOKEN_SECRET, {
     expiresIn: "1h", // Adjust as needed
    });

    // Set the new JWT in cookies
    res.cookie("jwt", token, { httpOnly: true });

    req.flash("notice", `Your account was successfully updated.`)
    res.redirect("/account")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_firstname,
    account_lastname,
    account_email,
    account_id,
    mainClass: "management-view"
    })
  }
}

/* ****************************************
*  Process Password Change
* *************************************** */
async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password, account_id } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the update.')
      res.status(500).render("account/update/", {
      title: "Update Account",
      nav,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      errors: null,
      mainClass: "management-view"
      })
  }

  const updatePasswordResult = await accountModel.updatePassword(
    account_id,
    hashedPassword
  )

  if (updatePasswordResult) {
    req.flash(
      "notice",
      `Password successfully updated.`
    )
    res.status(201).redirect("/account")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      account_id,
      errors: null,
      mainClass: "management-view"
    })
  }
}

  module.exports = { buildLogin, 
    buildRegister, 
    registerAccount, 
    accountLogin, 
    buildAccount,
    buildUpdateAccount,
    updateAccount,
    updatePassword }