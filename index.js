const express = require("express"),
  app = express(),
  PORT = process.env.PORT || 3000,
  // cors = require("cors"),
  router = require("./routes/index");

require("dotenv").config();

app.use(express.json({ strict: false }));
// app.use(cors());
app.use("/api/v1", router);

// Handle 404 route
app.get("*", (req, res) => {
  return res.status(404).json({
    error: "berhasi, tetapi endpoint tidak ada",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at PORT ${PORT}`);
});
