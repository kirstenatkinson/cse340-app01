const utilities = require("../utilities/")
const accountModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.addClassRules = () => {
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

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.newInventoryRules = () => {
  return [
    // Classification ID - ensure it's a valid ID from the database
    body("classification_id")
      .trim()
      .notEmpty()
      .withMessage("Please select a classification for the vehicle.")
      .isInt()
      .withMessage("Invalid classification ID."),

    // Make of the vehicle - alphanumeric (can allow spaces for multi-word makes like "Chevrolet Corvette")
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide the make of the vehicle.")
      .matches(/^[a-zA-Z0-9\s]+$/)
      .withMessage("Make can only contain alphanumeric characters and spaces."),

    // Model of the vehicle - alphanumeric (e.g., "Mustang", "Civic")
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide the model of the vehicle.")
      .matches(/^[a-zA-Z0-9\s]+$/)
      .withMessage("Model can only contain alphanumeric characters and spaces."),

    // Year of the vehicle - must be a 4-digit number and within a reasonable range (e.g., 1900-2024)
    body("inv_year")
      .trim()
      .notEmpty()
      .withMessage("Please provide the year of the vehicle.")
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage("The year must be a valid 4-digit number and within a reasonable range."),

    // Description - optional, but should not exceed a reasonable character limit
    body("inv_description")
      .trim()
      .escape()
      .optional()
      .isLength({ max: 500 })
      .withMessage("Description cannot exceed 500 characters."),

    // Price - should be a positive number and reasonable (greater than 0)
    body("inv_price")
      .trim()
      .notEmpty()
      .withMessage("Please provide the price of the vehicle.")
      .isFloat({ gt: 0 })
      .withMessage("Price must be a valid number greater than 0."),

    // Mileage - should be a non-negative number
    body("inv_miles")
      .trim()
      .notEmpty()
      .withMessage("Please provide the mileage of the vehicle.")
      .isInt({ min: 0 })
      .withMessage("Mileage must be a non-negative integer."),

    // Color - optional, but should be a string
    body("inv_color")
      .trim()
      .optional()
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage("Color can only contain alphabetic characters and spaces."),
  ];
};

    /* ******************************
 * Check data and return errors or continue to add inventory
 * ***************************** */
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
            inv_image,
            inv_thumbnail,
            mainClass: "management-view"
        })
        return
    }
    next()
}

  /* ******************************
 * Check data and return errors or continue to update inventory
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let classificationList = await utilities.buildClassificationList(req.body.classification_id) // Pre-select classification
      res.render("inventory/edit-inventory", {
          title: "Edit Inventory",
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
          inv_id
      })
      return
  }
  next()
}
  
  module.exports = validate