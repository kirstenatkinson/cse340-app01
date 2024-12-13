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
       [inv_id] // Pass the inv_id as a parameter
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
      const sql = "INSERT INTO review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *"
      return await pool.query(sql, [review_text, inv_id, account_id])
    } catch (error) {
      return error.message
    }
  }


  module.exports = {getReviewsByVehicleId, addReview};