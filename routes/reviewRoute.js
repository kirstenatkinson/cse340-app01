// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const reviewController = require("../controllers/reviewController")
const validate = require('../utilities/review-validation')

// Route to get update review view
router.get('/update/:review_id', 
    utilities.checkLogin,
    utilities.handleErrors(reviewController.buildUpdate))

// Route to get update review view
router.get('/delete/:review_id', 
    utilities.checkLogin,
    utilities.handleErrors(reviewController.buildDelete))

// Route to submit review form
router.post('/', 
    utilities.checkLogin,
    validate.reviewRules(), 
    validate.checkReviewData, 
    utilities.handleErrors(reviewController.addReview))

// Route to update review
router.post('/update', 
    utilities.checkLogin,
    validate.reviewRules(), 
    validate.checkReviewData, 
    utilities.handleErrors(reviewController.updateReview));


module.exports = router;