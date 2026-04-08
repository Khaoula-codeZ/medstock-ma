import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ReportShortage from './pages/ReportShortage';
import Shortages from './pages/Shortages';
import Footer from './components/Footer';
import { usePageTracking } from './hooks/usePageTracking';

function AppContent() {
  usePageTracking();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/report" element={<ReportShortage />} />
          <Route path="/shortages" element={<Shortages />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;