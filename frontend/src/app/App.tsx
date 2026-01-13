import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ProfileSetup } from './pages/ProfileSetup';
import { OpportunitiesFeed } from './pages/OpportunitiesFeed';
import { MatchResults } from './pages/MatchResults';

// Mock user for demo purposes
export const mockUser = {
  id: 'demo-user-1',
  name: 'Demo User'
};

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/opportunities" replace />} />
          <Route path="/profile" element={<ProfileSetup />} />
          <Route path="/opportunities" element={<OpportunitiesFeed />} />
          <Route path="/matches" element={<MatchResults />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
