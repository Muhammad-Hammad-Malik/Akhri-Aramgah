const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const graveyardController = require("./controllers/graveyardController");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
// Routes
app.post("/api/graveyard/create", graveyardController.createGraveyard);
app.get("/api/hello", (req, res) => {
  res.send("Hello, World!");
});

// Server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
