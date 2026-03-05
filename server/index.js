require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/auth', authRoutes);

// Database connection
sequelize.sync().then(() => {
    console.log('Database connected and synced');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
