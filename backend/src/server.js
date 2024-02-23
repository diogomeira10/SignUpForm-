require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const userRoutes = require("./routes/user")


app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

app.use('/api', userRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database");
    app.listen(process.env.PORT, () => {
      console.log("Listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });
