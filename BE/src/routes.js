const express = require("express");
const {
  getCake,
  addCake,
  updateCake,
  deleteCake,
  register,
  addCakes,
  getCartbyUser,
  addToCart,
  updateCart,
  deleteShallowCart,
  authenticateToken,
  addAccounts,
} = require("./function");
const { pushNotification } = require("./notification");
const {
  getOrder,
  distance,
  getNewOrder,
  addOrder,
  updateOrder,
  login,
} = require("./api");
const { getDistance } = require("./middleware/getDistance");
const router = express.Router();
router.get("/", (req, res) => {
  res.send("<h1>Chào chúng mày</h1>");
});

router.get("/cake", getCake);
router.post("/cake", addCake);
router.patch("/cake", updateCake);
router.delete("/cake", deleteCake);

router.get("/cakes", addCakes);

router.get("/accounts", addAccounts);

router.get("/order", getOrder);
router.get("/new-order", getNewOrder);
router.post("/order", addOrder);
router.patch("/order", updateOrder);

router.post("/login", login);
router.post("/register", register);

router.get("/cart/:uid", getCartbyUser);
router.post("/cart", addToCart);
router.patch("/cart/:id", updateCart);
router.patch("/cart/", deleteShallowCart);

router.get("/distance", distance);

router.get("/notification", pushNotification);
module.exports = router;
