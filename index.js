const express = require("express"),
  app = express(),
  cors = require("cors"),
  router = require("./routes/index"),
  swaggerUi = require('swagger-ui-express'),
  swagger = require('./documentation/documentation.js')

require("dotenv").config();
const PORT = process.env.PORT||3000

app.use(express.json({ strict: false }));
app.use(cors());
app.use("/documentation",swaggerUi.serve,swaggerUi.setup(swagger));
app.use("/api/v1", router);

// Handle 404 route
app.get("*", (req, res) => {
  return res.status(404).json({
    error: "berhasi, tetapi endpoint tidak ada",
  });
});

app.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT}`);
});
