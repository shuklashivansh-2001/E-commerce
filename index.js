const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get('/health', (req, res) => {
    res.send(`Primary Backend is healthy running on ${PORT}and fully functional`);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
