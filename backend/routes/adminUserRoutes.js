const router = require("express").Router();
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const controller = require("../controllers/adminUserController");

router.post("/", auth, adminOnly, controller.addUser);
router.get("/", auth, adminOnly, controller.getUsers);
router.put("/:id", auth, adminOnly, controller.updateUser);

module.exports = router;
