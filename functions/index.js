const serviceAccount = require("./zanzan-18f89-firebase-adminsdk-rsvba-1b86b86c9b");
const admin = require("firebase-admin");
const dotenv = require("dotenv");

dotenv.config();

let firebase;
if (admin.apps.length === 0) {
  firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  firebase = admin.app();
}

module.exports = {
  api: require("./src"),
};
