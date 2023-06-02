const { db, auth, app } = require("./firebase");
const { getToken, getMessaging } = require("firebase/messaging");
require("dotenv").config();

const pushNotification = async (req, res) => {
 
};

module.exports = { pushNotification };
