const express = require("express");
const app = express();

require("./scheduler");

app.use("/data", express.static("data"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server läuft auf Port", PORT);
});
