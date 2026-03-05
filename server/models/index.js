const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('student', 'instructor'), defaultValue: 'student' }
});

const Course = sequelize.define('Course', {
    title: { type: DataTypes.STRING, allowNull: false },
    thumbnail: { type: DataTypes.STRING },
    instructor: { type: DataTypes.STRING },
    shortDescription: { type: DataTypes.TEXT },
    fullDescription: { type: DataTypes.TEXT },
    learningOutcomes: { type: DataTypes.TEXT }, // JSON stringified array
    duration: { type: DataTypes.STRING }
});

const Section = sequelize.define('Section', {
    title: { type: DataTypes.STRING, allowNull: false },
    order: { type: DataTypes.INTEGER }
});

const Lesson = sequelize.define('Lesson', {
    title: { type: DataTypes.STRING, allowNull: false },
    videoUrl: { type: DataTypes.STRING }, // YouTube URL or ID
    duration: { type: DataTypes.STRING },
    order: { type: DataTypes.INTEGER }
});

const Enrollment = sequelize.define('Enrollment', {
    enrolledAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

const Progress = sequelize.define('Progress', {
    isCompleted: { type: DataTypes.BOOLEAN, defaultValue: false }
});

// Associations
Course.hasMany(Section, { onDelete: 'CASCADE' });
Section.belongsTo(Course);

Section.hasMany(Lesson, { onDelete: 'CASCADE' });
Lesson.belongsTo(Section);

User.belongsToMany(Course, { through: Enrollment });
Course.belongsToMany(User, { through: Enrollment });

User.hasMany(Progress);
Progress.belongsTo(User);

Lesson.hasMany(Progress);
Progress.belongsTo(Lesson);

module.exports = {
    sequelize,
    User,
    Course,
    Section,
    Lesson,
    Enrollment,
    Progress
};
