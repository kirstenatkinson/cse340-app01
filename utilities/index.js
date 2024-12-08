const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the dynamic classification options
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

  /* **************************************
* Build the vehicle view HTML
* ************************************ */
Util.buildVehicleDisplayGrid = async function(data) {
  let grid
  if(data.length > 0){
    grid = '<section id="vehicle-details">'
    grid += '<p id="price">$' + new Intl.NumberFormat('en-US').format(data[0].inv_price) + '</p>';
    grid += '<p id="description">' + data[0].inv_description + '</p>';
    grid += '<p id="mileage">Mileage: ' + new Intl.NumberFormat('en-US').format(data[0].inv_miles) + ' miles</p>';
    grid += '<p id="color">Color: ' + data[0].inv_color + '</p>';
    grid += '</section>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.errorGrid = async function(data) {
  let grid
  if(data.length > 0){
    grid = '<p>This is an error page</p>'
  } else {
    grid += '<p class="notice">Sorry, no error page could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
    res.locals.loggedin = 0
   next()
  }
 }

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 Util.checkAdminPrivileges = async (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, async (err, accountData) => {
      if (err) {
        req.flash("notice", "Please log in with an authorized account.");
        res.clearCookie("jwt");
        return res.redirect("/account/login");
      }
      try {
        const updatedAccountData = await accountModel.getAccountById(accountData.account_id);
        if (
          updatedAccountData &&
          (updatedAccountData.account_type === "Employee" || updatedAccountData.account_type === "Admin")
        ) {
          // Attach updated account data to `res.locals` for use in views
          res.locals.accountData = updatedAccountData;
          res.locals.loggedin = true;
          next(); // Authorized access
        } else {
          req.flash("notice", "You do not have permission to access this page.");
          return res.redirect("/account/login");
        }
      } catch (error) {
        console.error("Error fetching account data:", error);
        req.flash("notice", "An error occurred while verifying your account. Please log in again.");
        res.clearCookie("jwt");
        return res.redirect("/account/login");
      }
    });
  } else {
    req.flash("notice", "Please log in to access this page.");
    return res.redirect("/account/login");
  }
};

module.exports = Util