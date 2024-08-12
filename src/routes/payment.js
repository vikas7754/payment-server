const router = require("express").Router();
const paymentController = require("../controllers/paymentController");
const { auth, roleAuth } = require("../middlewares/auth");

/**
 * @route POST /api/payment/add
 * @description Add a payment
 * @access Private
 */
router.post("/add", auth, roleAuth, paymentController.addPayment);

/**
 * @route PUT /api/payment/update/:id
 * @description Update a payment
 * @access Private
 */
router.put("/update/:id", auth, roleAuth, paymentController.updatePayment);

/**
 * @route DELETE /api/payment/delete/:id
 * @description Delete a payment
 * @access Private
 */
router.delete("/delete/:id", auth, roleAuth, paymentController.deletePayment);

/**
 * @route GET /api/payment/all
 * @description Get all payments
 * @access Private
 */
router.get("/all", auth, roleAuth, paymentController.getPayments);

/**
 * @route GET /api/payment/summary
 * @description Get payment summary
 * @access Private
 */
router.get("/summary", auth, roleAuth, paymentController.getPaymentSummary);

/**
 * @route GET /api/payment/:id
 * @description Get payment by id
 * @access Private
 */
router.get("/get/:id", auth, roleAuth, paymentController.getPaymentById);

/**
 * @route PUT /api/payment/complete/:id
 * @description Complete a payment
 * @access Private
 */
router.put("/complete/:id", auth, roleAuth, paymentController.completePayment);

module.exports = router;
