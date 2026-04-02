const express = require("express");
const { body } = require("express-validator");
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");
const { getServicesByStudent } = require("../controllers/serviceController");
const { getPaymentsByStudent } = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getStudents);
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("phone")
      .matches(/^[6-9]\d{9}$/)
      .withMessage("Valid 10-digit phone required"),
    body("serviceType").notEmpty().withMessage("Service type is required"),
    body("feeAmount").isNumeric().withMessage("Fee amount must be a number"),
    body("paymentMode").notEmpty().withMessage("Payment mode is required"),
    body("startDate").notEmpty().withMessage("Start date is required"),
    validate,
  ],
  createStudent,
);

router.get("/:id", getStudentById);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

router.get("/:studentId/services", getServicesByStudent);
router.get("/:studentId/payments", getPaymentsByStudent);

module.exports = router;
