require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Import the Search Route
const searchRoutes = require('./routes/search');

const app = express();

app.use(cors());
app.use(express.json());

// Mount the Search Route
// This connects the '/api/search' URL to the logic in search.js
app.use('/api/search', searchRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));