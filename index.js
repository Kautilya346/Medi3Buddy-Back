import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Utils/db.js";
import post from "./Controllers/dataEntry.js";
import Pinata from "./Utils/pinata.js";
const app = express();

dotenv.config();

connectDB();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/data-entry", (req, res) => {
  res.send(
    "This endpoint accepts POST requests for data entry. Use a tool like Postman or curl to send POST requests."
  );
});

app.post("/data-entry", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .send("Request body is required and must be valid JSON");
    }
    await post(JSON.stringify(req.body));
    res.status(200).send("Data uploaded successfully");
  } catch (error) {
    console.error("Error in data-entry:", error);
    res.status(500).send(`Error uploading data: ${error.message}`);
  }
});

app.get("/get-data", async (req, res) => {
  const cid = req.query.cid;
  if (!cid) {
    return res.status(400).send("cid query parameter is required");
  }
  await Pinata.gateways.public
    .get(cid)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      console.error("Error fetching data from Pinata:", error);
      res.status(500).send(`Error fetching data: ${error.message}`);
    });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(
    `Medi3Buddy Backend Server running on port ${process.env.PORT || 5000}`
  );
});
