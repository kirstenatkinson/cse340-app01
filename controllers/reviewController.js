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

/* ***************************
 *  Deliver Edit Review View by Review Id
 * ************************** */
reviewCont.buildUpdate = async function (req, res) {
  const review_id = parseInt(req.params.review_id)
  let nav = await utilities.getNav()
  const reviewData = await reviewModel.getReviewById(review_id)
  const vehicleName = `${reviewData[0].inv_year} ${reviewData[0].inv_make} ${reviewData[0].inv_model}`
  const formatter = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const formattedDate = formatter.format(new Date(reviewData[0].review_date))
  console.log(reviewData[0].review_text)
  res.render("./account/review-update", {
    title: `Edit ${vehicleName} Review`,
    nav,
    errors: null,
    inv_id: reviewData[0].inv_id,
    account_id: reviewData[0].account_id,
    review_id: reviewData[0].review_id,
    review_date: formattedDate,
    review_text: reviewData[0].review_text,
    mainClass: "management-view"
  })
}

/* ***************************
 *  Update Review Data
 * ************************** */
reviewCont.updateReview = async function (req, res) {
  let nav = await utilities.getNav()
  const {
    review_text, 
    review_id
  } = req.body
  const updateResult = await reviewModel.updateReview (
    review_text, 
    review_id
  )

  if (updateResult) {
      req.flash("notice", `Your review was successfully updated.`)
      res.redirect("/account/")
    } else {
      req.flash("notice", "Sorry, the review update failed.")
      res.status(501).redirect(`/review/update/${review_id}`)
    }
}

/* ***************************
 *  Deliver Delete Review View by Review Id
 * ************************** */
reviewCont.buildDelete = async function (req, res) {
    const review_id = parseInt(req.params.review_id)
    let nav = await utilities.getNav()
    const reviewData = await reviewModel.getReviewById(review_id)
    const vehicleName = `${reviewData[0].inv_year} ${reviewData[0].inv_make} ${reviewData[0].inv_model}`
    const formatter = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    const formattedDate = formatter.format(new Date(reviewData[0].review_date))
    res.render("./account/review-delete", {
      title: `Edit ${vehicleName} Review`,
      nav,
      errors: null,
      inv_id: reviewData[0].inv_id,
      review_id: reviewData[0].review_id,
      account_id: reviewData[0].account_id,
      review_date: formattedDate,
      review_text: reviewData[0].review_text,
      mainClass: "management-view"
    })
  }

/* ***************************
 * Delete Review Data
 * ************************** */
reviewCont.deleteReview = async function (req, res) {
    let nav = await utilities.getNav()
    console.log("Deleting review:", req.body)
    const { 
      review_id
    } = req.body
    const deleteResult = await reviewModel.deleteReview (
      review_id
    )
  
    if (deleteResult) {
        req.flash("notice", `Your review was successfully deleted.`)
        res.redirect("/account/")
      } else {
        req.flash("notice", "Sorry, the review deletion failed.")
        res.status(501).redirect(`/review/delete/${review_id}`)
      }
  }

module.exports = reviewCont