const utilities = require("../utilities/")
const accountModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.addClassRules = () => {
    console.log("Now Validating rules")
    return [
      // class name is required and must be string
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a classification name.") // on error this message is sent.
        .matches(/^[a-zA-Z0-9]+$/) // Regular expression to allow only alphanumeric characters
        .withMessage("Classification name must not contain spaces or special characters.")
    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      console.log("There are problems here! (validate.checkClassData")
      res.render("inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name
      })
      return
    }
    next()
  }

  validate.checkInventoryData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(req.body.classification_id) // Pre-select classification
        res.render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            classificationList,
            errors,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_price,
            inv_miles,
            inv_color,
        })
        return
    }
    next()
}

  
  module.exports = validate