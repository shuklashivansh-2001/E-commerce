const express = require('express');
const userRouter = require('./router/user');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
const app = express();
app.use(express.json());

app.use("/api/v1/user", userRouter);
//app.use("/api/v1/customer", customerRouter);
//app.use("/api/v1/admin", adminRouter);

// Basic route
app.get('/health', (req, res) => {
    res.send(`Primary Backend is healthy running on ${PORT}and fully functional`);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
