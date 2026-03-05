import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CourseDetails from './pages/CourseDetails';
import LearningPage from './pages/LearningPage';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="app">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/course/:id" element={<CourseDetails />} />
                        <Route path="/learn/:id" element={<LearningPage />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
