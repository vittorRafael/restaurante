require('dotenv').config() 
const {initializeApp} = require("firebase/app");
const { getFirestore } = require('firebase/firestore')

const serviceAccount = require("../../firebaseKey.json");

const app = initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
});
 


const db = getFirestore(app)

module.exports = db