const express = require("express");
const {
  getCake,
  addCake,
  updateCake,
  deleteCake,
  login,
  register,
  loginWithGoogle,
  addCakes,
  getCartbyUser,
  addToCart,
  updateCart,
  deleteShallowCart,
} = require("./function");
const router = express.Router();
router.get("/", (req, res) => {
  res.send("<h1>Chào chúng mày</h1>");
});

router.get("/cake", getCake);
router.post("/cake", addCake);
router.post("/cakes", addCakes);
router.patch("/cake", updateCake);
router.delete("/cake", deleteCake);

router.post("/login", login);
router.post("/register", register);
router.get("/login/google", loginWithGoogle);

router.get("/cart/:uid", getCartbyUser);
router.post("/cart", addToCart);
router.patch("/cart/:id", updateCart);
router.patch("/cart/", deleteShallowCart);
module.exports = router;
