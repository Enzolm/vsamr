const express = require("express");
const router = express.Router();
const UsersController = require("../../Controllers/User/UsersController.js");

router.get("/get/all/users", UsersController.getUsers);

router.get("/get/user/:id", UsersController.getUserById);

router.post("/create/user", UsersController.createUser);

router.post("/login/user", UsersController.loginUser);

router.post("/request-password-reset", UsersController.requestPasswordReset);

router.post("/reset-password", UsersController.resetPassword);

module.exports = router;
