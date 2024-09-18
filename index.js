/** @format */

const { GoogleAuth } = require("google-auth-library");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const app = express();
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// const a = require('');
const keyPath = path.join(
  __dirname,
  "./kaaryaar-5d266-firebase-adminsdk-5em5t-1ee20380b5.json"
);
admin.initializeApp();

const PORT = 3001;
app.use(cors());
app.use(express.json());
const key = JSON.parse(fs.readFileSync(keyPath, "utf8"));

// Define scopes for Firebase Cloud Messaging
const SCOPES = ["https://www.googleapis.com/auth/firebase.messaging"];

// Function to get access token
async function getAccessToken() {
  try {
    const auth = new GoogleAuth({
      credentials: key,
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
