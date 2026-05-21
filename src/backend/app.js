require('dotenv').config({
  path: '.env'
});

// Import the Search Route
const express = require("express");
const cors = require("cors");

const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const searchRoutes = require('./routes/search');

const app = express();

app.use(cors());
app.use(express.json());

// Mount the Search Route
// This connects the '/api/search' URL to the logic in search.js
app.use('/api/search', searchRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);