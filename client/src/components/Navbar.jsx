import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <nav style={{
            height: '64px',
            background: 'var(--glass)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--glass-border)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            padding: '0 2rem',
            justifyContent: 'space-between'
        }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                <BookOpen size={28} />
                Elevate LMS
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <Link to="/" style={{ color: 'var(--text-main)', fontWeight: 500 }}>Courses</Link>

                {isAuthenticated ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                            <UserIcon size={18} />
                            <span>{user.name}</span>
                        </div>
                        <button
                            onClick={logout}
                            style={{ background: 'transparent', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 500 }}
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                ) : (
                    <Link to="/auth" className="btn-primary" style={{ padding: '0.5rem 1.2rem' }}>
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
