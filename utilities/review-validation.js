const utilities = require("../utilities/")
const reviewModel = require("../models/review-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.reviewRules = () => {
  return [
    // Description - optional, but should not exceed a reasonable character limit
    body("review_text")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Review cannot be empty")
      .isLength({ max: 500 })
      .withMessage("Review cannot exceed 500 characters."),

    // Account ID - ensure it's a valid ID from the database
    body("account_id")
      .trim()
      .notEmpty()
      .withMessage("Please ensure the account id is filled.")
      .isInt()
      .withMessage("Invalid account ID."),

    // Inventory ID - ensure it's a valid ID from the database
    body("inv_id")
    .trim()
    .notEmpty()
    .withMessage("Please ensure the inventory id is filled.")
    .isInt()
    .withMessage("Invalid inventory ID.")
  ];
};

/* ******************************
 * Check data and return errors or continue to add inventory
 * ***************************** */
  validate.checkReviewData = async (req, res, next) => {
    const { inv_id } = req.body
    let errors = validationResult(req)
    
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array())
        return res.redirect(`/inv/detail/${inv_id}`)
    }
    next()
}

module.exports = validate