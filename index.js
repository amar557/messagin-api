/** @format */

const { GoogleAuth } = require("google-auth-library");
const express = require("express");
const cors = require("cors");
const app = express();
const functions = require("firebase-functions");
const admin = require("firebase-admin");
require("dotenv").config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const PORT = 3001;
app.use(cors());
app.use(express.json());

// Define scopes for Firebase Cloud Messaging
const SCOPES = ["https://www.googleapis.com/auth/firebase.messaging"];

// Function to get access token
async function getAccessToken() {
  try {
    const auth = new GoogleAuth({
      credentials: {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
      },
      scopes: SCOPES,
    });

    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    return tokenResponse.token;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw new Error("Failed to get access token");
  }
}

app.get("/", async (req, res) => {
  try {
    res.send({
      token: "hello",
      key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });
  } catch (error) {
    res.status(500).send({ err: "hoem page is not loaded" });
  }
});
app.get("/token", async (req, res) => {
  try {
    const token = await getAccessToken();
    res.send({ token });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
