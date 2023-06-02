const axios = require("axios");
const getDistance = (req, res, next) => {
  const apiKey = "AIzaSyAzaga_IWnHVoBVEMGXazTE3HbFZ_uBkg4";
  const origin = req.query.origin;
  const destination = req.query.destination;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;
  axios
    .get(url)
    .then((response) => {
      res.header("Access-Control-Allow-Origin", "*");
      req.distance = response.data.rows[0].elements[0].distance.value;
      next();
    })
    .catch((error) => {
      res.status(500).json({ error: "Đã xảy ra lỗi" });
    });
};

module.exports = { getDistance };
