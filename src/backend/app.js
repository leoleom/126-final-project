require('dotenv').config({
  path: '../../.env'
});

const express = require("express");
const cors = require("cors");

const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);