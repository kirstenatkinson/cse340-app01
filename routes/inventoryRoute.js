// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const invController = require("../controllers/invController")
const validate = require('../utilities/inv-validation')

//Route to manage
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build individual vehicle view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByVehicleId));

// Route for error link
router.get("/error", utilities.handleErrors(invController.error));

// Route for adding a classification form view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClass));

// Route for adding a vehicle form view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Route to submit classification form
router.post('/add-classification', validate.addClassRules(), validate.checkClassData, utilities.handleErrors(invController.addClassification));

// Route to submit inventory form
router.post("/add-inventory", validate.checkInventoryData, utilities.handleErrors(invController.addInventory));

// Get delete
//router.get("/delete/:inv_id", utilities.handleErrors(invController.builDelete))

// Delete inventory
//router.post("/delete/", utilities.handleErrors(invController.deleteInventory))

module.exports = router;