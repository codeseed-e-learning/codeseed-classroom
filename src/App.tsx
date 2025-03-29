import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import AuthLayout from './components/AuthLayout';
import NotFound from './pages/NotFound';
import Jobs from './pages/Jobs';

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
          path="/jobs"
          element={
            <AuthLayout>
              <Jobs />
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