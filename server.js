const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.listen(9000, () => {
  console.log("File Server is running on port 9K.");
});
