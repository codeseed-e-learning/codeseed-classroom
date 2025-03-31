import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Learn from './pages/Learn';
import AuthLayout from './components/AuthLayout';
import NotFound from './pages/NotFound';
import Jobs from './pages/Jobs';
import Profile from "./pages/Profile";
import ResumeBuilder from './pages/ResumeBuilder';
import AutoSender from './pages/AutoSender';
import Dashboard from './pages/Dashboard';
import Test from "./pages/Test"
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <AuthLayout>
              <Dashboard />
            </AuthLayout>
          }
        />
        <Route
          path="/learn"
          element={
            <AuthLayout>
              <Learn />
            </AuthLayout>
          }
        />
        <Route
          path="/learn/:courseId" // Dynamic route for learning a specific course
          element={
            <AuthLayout>
              <Learn />
            </AuthLayout>
          }
        />
        <Route
          path="/jobs"
          element={
            <AuthLayout>
              <Jobs />
            </AuthLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthLayout>
              <Profile />
            </AuthLayout>
          }
        />
        <Route
          path="/resume-building"
          element={
            <AuthLayout>
              <ResumeBuilder />
            </AuthLayout>
          }
        />
        <Route
          path="/sender"
          element={
            <AuthLayout>
              <AutoSender />
            </AuthLayout>
          }
        />
        <Route
          path="/test"
          element={
            <AuthLayout>
              <Test />
            </AuthLayout>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;