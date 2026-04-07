import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ReportShortage from './pages/ReportShortage';
import Shortages from './pages/Shortages';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/report" element={<ReportShortage />} />
            <Route path="/shortages" element={<Shortages />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;