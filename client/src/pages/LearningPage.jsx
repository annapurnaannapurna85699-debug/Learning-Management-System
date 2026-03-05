import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlayCircle, CheckCircle, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LearningPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/auth');
            return;
        }

        const fetchData = async () => {
            try {
                const [courseRes, progressRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/courses/${id}`),
                    axios.get(`http://localhost:5000/api/courses/${id}/progress/${user.id}`)
                ]);

                setCourse(courseRes.data);
                const completedIds = progressRes.data.map(p => p.LessonId);
                setCompletedLessons(completedIds);

                // Resume from last watched or first lesson
                const allLessons = courseRes.data.Sections.flatMap(s => s.Lessons);
                const lastCompletedIdx = allLessons.findLastIndex(l => completedIds.includes(l.id));
                const nextIdx = lastCompletedIdx + 1 < allLessons.length ? lastCompletedIdx + 1 : 0;
                setCurrentLesson(allLessons[nextIdx]);
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, user, navigate]);

    const handleMarkComplete = async (lessonId) => {
        if (completedLessons.includes(lessonId)) return;

        try {
            await axios.post('http://localhost:5000/api/courses/progress/mark-complete', {
                userId: user.id,
                lessonId
            });
            setCompletedLessons([...completedLessons, lessonId]);
        } catch (err) {
            console.error('Error marking complete:', err);
        }
    };

    const allLessons = course?.Sections?.flatMap(s => s.Lessons) || [];
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson?.id);
    const progressPercent = allLessons.length > 0 ? (completedLessons.length / allLessons.length) * 100 : 0;

    const goToNext = () => {
        if (currentIndex < allLessons.length - 1) {
            setCurrentLesson(allLessons[currentIndex + 1]);
        }
    };

    const goToPrev = () => {
        if (currentIndex > 0) {
            setCurrentLesson(allLessons[currentIndex - 1]);
        }
    };

    if (loading) return <div className="container">Loading learning area...</div>;
    if (!course) return <div className="container">Course not found</div>;

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
            {/* Sidebar */}
            <div style={{
                width: sidebarOpen ? '350px' : '0',
                transition: 'width 0.3s ease',
                background: 'var(--bg-card)',
                borderRight: '1px solid var(--glass-border)',
                overflowY: 'auto',
                position: 'relative'
            }}>
                <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>{course.title}</h3>
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                            <span>Course Progress</span>
                            <span>{Math.round(progressPercent)}%</span>
                        </div>
                        <div className="progress-container">
                            <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                    </div>

                    {course.Sections?.map(section => (
                        <div key={section.id} style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.8rem', textTransform: 'uppercase' }}>
                                {section.title}
                            </h4>
                            {section.Lessons?.map(lesson => (
                                <div
                                    key={lesson.id}
                                    onClick={() => setCurrentLesson(lesson)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.8rem',
                                        padding: '0.8rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        background: currentLesson?.id === lesson.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                        color: currentLesson?.id === lesson.id ? 'var(--primary)' : 'inherit',
                                        marginBottom: '0.3rem',
                                        transition: 'all 0.2s'
                                    }}
                                    className="lesson-item"
                                >
                                    {completedLessons.includes(lesson.id) ? (
                                        <CheckCircle size={18} color="var(--accent)" />
                                    ) : (
                                        <PlayCircle size={18} />
                                    )}
                                    <div style={{ fontSize: '0.9rem', flex: 1 }}>{lesson.title}</div>
                                    <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{lesson.duration}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)', overflowY: 'auto' }}>
                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
                    <iframe
                        src={`${currentLesson?.videoUrl}?rel=0&modestbranding=1`}
                        title={currentLesson?.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    ></iframe>
                </div>

                <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <h2 style={{ marginBottom: '0.5rem' }}>{currentLesson?.title}</h2>
                            <p style={{ color: 'var(--text-muted)' }}>Lesson {currentIndex + 1} of {allLessons.length}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={goToPrev}
                                className="btn-primary"
                                style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)' }}
                                disabled={currentIndex === 0}
                            >
                                <ChevronLeft /> Previous
                            </button>
                            <button
                                onClick={() => handleMarkComplete(currentLesson?.id)}
                                className="btn-primary"
                                style={{ background: completedLessons.includes(currentLesson?.id) ? 'var(--accent)' : 'var(--primary)' }}
                            >
                                {completedLessons.includes(currentLesson?.id) ? 'Completed' : 'Mark as Complete'}
                            </button>
                            <button
                                onClick={goToNext}
                                className="btn-primary"
                            >
                                Next <ChevronRight />
                            </button>
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3>About this lesson</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
                            In this lesson, we will cover the core concepts of {currentLesson?.title}.
                            Make sure to follow along and practice the examples provided in the video.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningPage;
