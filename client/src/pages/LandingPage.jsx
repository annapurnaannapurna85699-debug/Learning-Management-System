import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Play, Clock, User } from 'lucide-react';

const LandingPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/courses');
                setCourses(res.data);
            } catch (err) {
                console.error('Error fetching courses:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (loading) return <div className="container">Loading courses...</div>;

    return (
        <div className="container animate-fade">
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(to right, #6366f1, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Elevate Your Skills
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    Explore our premium courses and start your learning journey today.
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {courses.map(course => (
                    <div key={course.id} className="glass-card">
                        <img
                            src={course.thumbnail}
                            alt={course.title}
                            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.5rem' }}
                        />
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{course.title}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <User size={16} /> {course.instructor}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <Clock size={16} /> {course.duration}
                            </span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {course.shortDescription}
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link to={`/course/${course.id}`} className="btn-primary" style={{ flex: 1, textAlign: 'center' }}>
                                View Details
                            </Link>
                            <Link to={`/learn/${course.id}`} className="btn-primary" style={{ background: 'var(--accent)', flex: 1, textAlign: 'center' }}>
                                Enroll
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LandingPage;
