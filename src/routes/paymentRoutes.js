const express = require("express");
const {
  getAllPayments,
  createPayment,
  updatePayment,
  getPaymentSummary,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getAllPayments);
router.get("/summary", getPaymentSummary);
router.post("/", createPayment);
router.put("/:id", updatePayment);

module.exports = router;
