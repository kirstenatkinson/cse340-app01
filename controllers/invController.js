const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}
const vehicleCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    mainClass: "classification-view"
  })
}

/* ***************************
 *  Build display by vehicle view
 * ************************** */
vehicleCont.buildByVehicleId = async function (req, res, next) {
  const vehicle_id = req.params.invId
  try {
    const data = await invModel.getVehicleById(vehicle_id); // Fetch vehicle by ID
    if (!data) {
      return res.status(404).send("Vehicle not found");
    }
  const grid = await utilities.buildVehicleDisplayGrid(data)
  let nav = await utilities.getNav()
  const vehicleYear = data[0].inv_year
  const vehicleMake = data[0].inv_make
  const vehicleModel = data[0].inv_model
  const vehicleImage = data[0].inv_image
  res.render("./inventory/vehicle", {
    title: `${vehicleYear} ${vehicleMake} ${vehicleModel}`,
    nav,
    vehicleImage,
    grid,
    mainClass: "vehicle-view"
  })
} catch (err) {
  console.error(err);
  next(err);
}
};

module.exports = {
  buildByClassificationId: invCont.buildByClassificationId, 
  buildByVehicleId: vehicleCont.buildByVehicleId}