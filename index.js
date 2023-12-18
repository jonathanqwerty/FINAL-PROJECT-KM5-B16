const express = require("express"),
  app = express(),
  PORT = process.env.PORT || 3000,
  cors = require("cors"),
  router = require("./routes/index");
  swaggerUi = require('swagger-ui-express'),
  swagger1 = require('./documentation/documentation1.json'),
  swagger2 = require('./documentation/documentation2.json'),
  swagger3 = require('./documentation/documentation3.json'),
  swagger4 = require('./documentation/documentation4.json'),

require("dotenv").config();

app.use(express.json({ strict: false }));
app.use(cors());
app.use("/documentation1",swaggerUi.serve,swaggerUi.setup(swagger1));
app.use("/documentation2",swaggerUi.serve,swaggerUi.setup(swagger2));
app.use("/documentation3",swaggerUi.serve,swaggerUi.setup(swagger3));
app.use("/documentation4",swaggerUi.serve,swaggerUi.setup(swagger4));
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
