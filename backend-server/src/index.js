require("dotenv").config();
const express = require("express");
const cors = require("cors");
const carRoutes = require("./routes/carRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/cars", carRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
