import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, PlayCircle, Clock, BookOpen, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await axios.get(`/api/courses/${id}`);
                setCourse(res.data);
            } catch (err) {
                console.error('Error fetching course:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const handleEnroll = async () => {
        if (!user) {
            navigate('/auth');
            return;
        }
        try {
            await axios.post(`/api/courses/${id}/enroll`, { userId: user.id });
            navigate(`/learn/${id}`);
        } catch (err) {
            alert('Enrollment failed');
        }
    };

    if (loading) return <div className="container">Loading details...</div>;
    if (!course) return <div className="container">Course not found</div>;

    const outcomes = JSON.parse(course.learningOutcomes || '[]');
    const totalLessons = course.Sections?.reduce((acc, s) => acc + (s.Lessons?.length || 0), 0) || 0;

    return (
        <div className="container animate-fade">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{course.title}</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>{course.shortDescription}</p>

                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <User size={24} color="var(--primary)" />
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Instructor</div>
                            <div style={{ fontWeight: 600 }}>{course.instructor}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Clock size={24} color="var(--primary)" />
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Duration</div>
                            <div style={{ fontWeight: 600 }}>{course.duration}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <BookOpen size={24} color="var(--primary)" />
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lessons</div>
                            <div style={{ fontWeight: 600 }}>{totalLessons}</div>
                        </div>
                    </div>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>What you will learn</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {outcomes.map((outcome, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-muted)' }}>
                                    <CheckCircle size={20} color="var(--accent)" />
                                    {outcome}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 style={{ marginBottom: '1.5rem' }}>Course Content</h2>
                        {course.Sections?.map(section => (
                            <div key={section.id} style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '8px', marginBottom: '0.5rem' }}>
                                    {section.title}
                                </h3>
                                {section.Lessons?.map(lesson => (
                                    <div key={lesson.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                            <PlayCircle size={18} color="var(--primary)" />
                                            {lesson.title}
                                        </div>
                                        <span style={{ color: 'var(--text-muted)' }}>{lesson.duration}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </section>
                </div>

                <div style={{ position: 'sticky', top: '2rem' }}>
                    <div className="glass-card">
                        <img
                            src={course.thumbnail}
                            alt={course.title}
                            style={{ width: '100%', borderRadius: '12px', marginBottom: '1.5rem' }}
                        />
                        <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem' }}>Free</div>
                        <button onClick={handleEnroll} className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                            Enroll Now
                        </button>
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '1rem', fontSize: '0.9rem' }}>
                            Lifetime access to course materials
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
