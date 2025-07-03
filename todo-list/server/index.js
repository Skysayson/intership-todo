const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoute = require('./routes/authentication');
const todoRoute = require('./routes/tasks')

app.use('/api/auth', authRoute);
app.use('/api/todo', todoRoute)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
