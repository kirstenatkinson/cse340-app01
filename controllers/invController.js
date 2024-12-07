const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

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
    mainClass: "classification-view",
    errors: null,
  })
}

/* ***************************
 *  Build display by vehicle view
 * ************************** */
invCont.buildByVehicleId = async function (req, res, next) {
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
    mainClass: "vehicle-view",
    errors: null,
  })
} catch (err) {
  console.error(err);
  next(err);
}
};

invCont.error = async function (req,res, next) {
  try {
    // Intentionally introduce an error, such as referencing an undefined variable
    const vehicleYear = undefinedVariable; // This will throw a ReferenceError

    res.send("This line will never execute due to the error above.");
  } catch (err) {
    console.error("Intentional error triggered:", err);
    // Pass the error to the next middleware for handling
    next(err);
  }
};

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    mainClass: "management-view",
    classificationSelect,
    errors: null,
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClass = async function (req, res, next) {
  let nav = await utilities.getNav()
  console.log("Creating the add class view")
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    mainClass: "management-view",
    errors: null,
  })
}

/* ****************************************
*  Process classification submission
* *************************************** */
invCont.addClassification = async function(req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const submissionResult = await invModel.addClassification(classification_name)

  if (submissionResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve added ${classification_name}.`
    )

    // Redirect to the management page with flash message
    res.status(201).redirect("/inv")
  } else {
    req.flash("notice", "Sorry, the submission failed.")
    res.status(501).render("inv/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      mainClass: "management-view"
    })
  }
}

/* ****************************************
*  Deliver Add Inventory View
* *************************************** */
invCont.buildAddInventory = async function (req, res) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList() // Fetch dropdown
    res.render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList, // Pass the dropdown list to the view
        errors: null,
        mainClass: "management-view"
    })
}

/* ****************************************
*  Process Inventory Submission
* *************************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, inv_image, inv_thumbnail, classification_id } = req.body

  const submissionResult = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
    inv_image,
    inv_thumbnail,
    classification_id
  )

  if (submissionResult) {
      req.flash(
          "notice",
          `Congratulations, you've added ${inv_make} ${inv_model}.`
      )
      res.status(201).redirect("/inv")
  } else {
      req.flash("notice", "Sorry, the submission failed.")
      res.status(501).render("inv/add-inventory", {
          title: "Add Inventory",
          nav,
          classificationList: await utilities.buildClassificationList(classification_id),
          errors: null,
          inv_make,
          inv_model,
          inv_year,
          inv_description,
          inv_price,
          inv_miles,
          inv_color,
          inv_image,
          inv_thumbnail,
          classification_id,
          mainClass: "management-view"
      })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Deliver Edit Inventory View by Inventory Id
 * ************************** */
invCont.buildEditInventory = async function (req, res) {
  const inv_id = parseInt(req.params.invId)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData[0].classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id,
    mainClass: "management-view"
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
    mainClass: "management-view"
    })
  }
}

/* ***************************
 *  Deliver Delete Inventory View by Inventory Id
 * ************************** */
invCont.buildDelete = async function (req, res) {
  const inv_id = parseInt(req.params.inv_id)
  console.log(inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleById(inv_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price,
    mainClass: "management-view"
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_price,
  } = req.body
  const deleteResult = await invModel.deleteInventory(inv_id)

  if (deleteResult) {
    const itemName = deleteResult[0].inv_make + " " + deleteResult[0].inv_model
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    mainClass: "management-view"
    })
  }
}

module.exports = invCont