const express = require("express");
const {
  getServiceById,
  createService,
  updateService,
  addSession,
} = require("../controllers/serviceController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/:id", getServiceById);
router.post("/", createService);
router.put("/:id", updateService);
router.post("/:id/sessions", addSession);

module.exports = router;
