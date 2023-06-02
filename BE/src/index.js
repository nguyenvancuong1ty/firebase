const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routers = require("./routes");
// const db = require("./firebase");

const app = express();
app.use(cors());
const port = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/firebase/api/", routers);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
