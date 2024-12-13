// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const reviewController = require("../controllers/reviewController")
const validate = require('../utilities/review-validation')

// Route to submit review form
router.post('/', 
    validate.reviewRules(), 
    validate.checkReviewData, 
    utilities.handleErrors(reviewController.addReview));

    
module.exports = router;