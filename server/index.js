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

// Database connection & Server Start
const startServer = async () => {
    try {
        await sequelize.sync();
        console.log('Database connected and synced');

        // Auto-seed if empty (for demo/deployment ease)
        const { Course } = require('./models');
        const count = await Course.count();
        if (count === 0) {
            console.log('Database is empty, seeding...');
            try {
                // Ensure seeder won't crash the server
                require('./seeders/init');
            } catch (seedErr) {
                console.error('Auto-seeding failed:', seedErr);
            }
        }

        // Only start listening if this file is run directly (not as a serverless function)
        if (require.main === module) {
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        }
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
};

startServer();

module.exports = app;
