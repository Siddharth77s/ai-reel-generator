import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ScriptsProvider } from './contexts/ScriptsContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ScriptGenerator from './pages/ScriptGenerator';
import ThumbnailGenerator from './pages/ThumbnailGenerator';
import MyScripts from './pages/MyScripts';
import ScriptDetail from './pages/ScriptDetail';
import TrendingTopics from './pages/TrendingTopics';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <ScriptsProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/generate" element={<ScriptGenerator />} />
                <Route path="/thumbnails" element={<ThumbnailGenerator />} />
                <Route path="/scripts" element={<MyScripts />} />
                <Route path="/scripts/:id" element={<ScriptDetail />} />
                <Route path="/trending" element={<TrendingTopics />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ScriptsProvider>
    </AuthProvider>
  );
}

export default App;
