const { sequelize, Course, Section, Lesson } = require('../models');

const seed = async () => {
    await sequelize.sync({ force: true });

    const courses = [
        {
            title: 'Complete Java Masterclass',
            instructor: 'Dr. James Gosling',
            thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
            shortDescription: 'Master Java from basics to advanced concepts including Spring Boot.',
            fullDescription: 'This course is designed to take you from a complete beginner to a professional Java developer. You will learn the core concepts of Java, Object-Oriented Programming, and how to build robust applications.',
            learningOutcomes: JSON.stringify(['Understand Java syntax', 'Master OOP concepts', 'Build multi-threaded apps', 'Connect to databases']),
            duration: '45 hours'
        },
        {
            title: 'Python for Data Science',
            instructor: 'Guido van Rossum',
            thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60',
            shortDescription: 'Learn Python programming specifically for data analysis and visualization.',
            fullDescription: 'The most comprehensive Python course for Data Science. You will use libraries like Pandas, NumPy, and Matplotlib to analyze real-world datasets.',
            learningOutcomes: JSON.stringify(['Python Basics', 'Pandas for Data Manipulation', 'Data Visualization with Seaborn', 'Introduction to Scikit-Learn']),
            duration: '32 hours'
        },
        {
            title: 'Intro to Machine Learning',
            instructor: 'Andrew Ng',
            thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop&q=60',
            shortDescription: 'A beginner-friendly introduction to the world of AI and Machine Learning.',
            fullDescription: 'Go from zero to building your first ML model. This course covers Supervised and Unsupervised learning in depth.',
            learningOutcomes: JSON.stringify(['Linear Regression', 'Logistic Regression', 'Neural Networks', 'Clustering Algorithms']),
            duration: '28 hours'
        }
    ];

    for (const courseData of courses) {
        const course = await Course.create(courseData);

        // Map titles to IDs for realism
        let videoId = 'A740M55JtZ0'; // Java (Intro to Java Programming - Tim Ruscica)
        if (course.title.includes('Python')) videoId = 'rfscVS0vtbw';
        if (course.title.includes('Machine Learning')) videoId = 'i_LwzRVP7bg';

        // Create sections and lessons
        const section1 = await Section.create({ title: 'Phase 1: Foundations', order: 1, CourseId: course.id });
        await Lesson.create({ title: 'Introduction & Overview', videoUrl: `https://www.youtube.com/embed/${videoId}`, duration: '12:45', order: 1, SectionId: section1.id });
        await Lesson.create({ title: 'Setting Up Your Workspace', videoUrl: `https://www.youtube.com/embed/${videoId}`, duration: '08:20', order: 2, SectionId: section1.id });

        const section2 = await Section.create({ title: 'Phase 2: Core Concepts', order: 2, CourseId: course.id });
        await Lesson.create({ title: 'Variables and Data Types', videoUrl: `https://www.youtube.com/embed/${videoId}`, duration: '15:10', order: 1, SectionId: section2.id });
        await Lesson.create({ title: 'Control Flow & Logic', videoUrl: `https://www.youtube.com/embed/${videoId}`, duration: '22:30', order: 2, SectionId: section2.id });
    }

    console.log('Database seeded successfully!');
};

seed().catch(err => {
    console.error('Error seeding database:', err);
});
