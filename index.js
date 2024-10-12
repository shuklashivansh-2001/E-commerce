const express = require('express');
const userRouter = require('./router/user');
const profileRouter = require('./router/profile');
const productRoute = require('./router/product');
const reviewRoute = require('./router/review');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
const app = express();
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/review", reviewRoute);

// Basic route
app.get('/health', (req, res) => {
    res.send(`Primary Backend is healthy running on ${PORT} and fully functional`);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
