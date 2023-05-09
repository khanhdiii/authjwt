const middlewareController = require("../controllers/middlewareController")
const userController = require("../controllers/userController")
const getAllUsers = require("../controllers/userController")

const router = require("express").Router()


//GET
router.get("/", middlewareController.verifyToken, userController.getAllUsers)

//DELETE
router.delete("/:id", middlewareController.verifyTokenAdmin, userController.deleteUser)

module.exports = router