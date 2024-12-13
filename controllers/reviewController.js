const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")

const reviewCont = {}

/* ****************************************
*  Process classification submission
* *************************************** */
reviewCont.addReview = async function(req, res) {
  let nav = await utilities.getNav()
  const { review_text, inv_id, account_id } = req.body

  const submissionResult = await reviewModel.addReview(review_text, inv_id, account_id)

  if (submissionResult) {
    req.flash(
      "notice",
      `Thank you for your review`
    )

    // Redirect to the management page with flash message
    res.status(201).redirect(`/inv/detail/${inv_id}`)
  } else {
    req.flash("notice", "Sorry, the review submission failed.")
    res.status(501).redirect(`/inv/detil/${inv_id}`)
  }
}

module.exports = reviewCont