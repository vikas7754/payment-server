const router = require("express").Router();
const userController = require("../controllers/userController");
const { isLogin } = require("../middlewares/auth");

/**
 * @method GET
 * @route /api/user/me
 * @description Get user profile
 */
router.get("/me", isLogin, userController.me);

/**
 * @method POST
 * @route /api/user/login
 * @description Login user
 */
router.post("/login", userController.login);

/**
 * @method POST
 * @route /api/user/logout
 * @description Logout user
 */
router.post("/logout", userController.logout);

module.exports = router;
