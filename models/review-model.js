const pool = require("../database/")

/* ***************************
 *  Get all reviews associated with a vehicle by inv_id
 * ************************** */
async function getReviewsByVehicleId(inv_id) {
    try {
      const data = await pool.query(
        `SELECT * 
        FROM public.review AS r 
        JOIN public.account AS a 
        ON r.account_id = a.account_id 
        WHERE r.inv_id = $1
        ORDER BY r.review_date DESC`, 
       [inv_id]
      )
      return data.rows
    } catch (error) {
      console.error("getReviewsByVehicleId error " + error)
    }
  }

/* *****************************
*   Create a new review
* *************************** */
async function addReview(review_text, inv_id, account_id){
    try {
      const sql = `INSERT INTO review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *`
      return await pool.query(sql, [review_text, inv_id, account_id])
    } catch (error) {
      return error.message
    }
  }

/* ***************************
 *  Get all reviews associated with an account by account_id
 * ************************** */
async function getReviewsByAccountId(account_id) {
    try {
      const data = await pool.query(
        `SELECT * 
        FROM public.review AS r 
        JOIN public.inventory AS i 
        ON r.inv_id = i.inv_id
        WHERE r.account_id = $1
        ORDER BY r.review_date DESC`, 
       [account_id]
      )
      return data.rows
    } catch (error) {
      console.error("getReviewsByAccountId error " + error)
    }
  }

/* ***************************
 *  Get all reviews associated with a vehicle by inv_id
 * ************************** */
async function getReviewById(review_id) {
    try {
      const data = await pool.query(
        `SELECT * 
        FROM public.review AS r 
        JOIN public.inventory AS i 
        ON r.inv_id = i.inv_id 
        WHERE r.review_id = $1`, 
       [review_id]
      )
      return data.rows
    } catch (error) {
      console.error("getReviewById error " + error)
    }
  }

/* *****************************
*   Update a review
* *************************** */
async function updateReview (
    review_text, 
    review_id
  ) {
    try {
      const sql =
        "UPDATE public.review SET review_text = $1 WHERE review_id = $2 RETURNING *"
      const data = await pool.query(sql, [
        review_text, 
        review_id
      ])
      return data.rows[0]
    } catch (error) {
      console.error("Update review model error: " + error)
    }
  }

/* ***************************
 *  Delete Review Data
 * ************************** */
async function deleteReview(review_id) {
    try {
      const sql =
        "DELETE FROM public.review WHERE review_id = $1;"
      const data = await pool.query(sql, [review_id])
      return data
    } catch (error) {
      console.error("Delete review Error: " + error)
    }
  }

  module.exports = {getReviewsByVehicleId, addReview, getReviewsByAccountId, getReviewById, updateReview, deleteReview};