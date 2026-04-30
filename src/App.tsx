import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { Toaster } from './components/ui/sonner';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { Stethoscope } from 'lucide-react';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-deep-black font-sans antialiased text-white/80">
          <Navbar />
          <main className="container mx-auto px-6 py-12">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          
          <footer className="px-10 py-10 bg-black border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8">
              <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium">Primary: (555) 010-2300</span>
              <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium">Emergency: (555) 010-9911</span>
            </div>
            <div className="text-[10px] text-white/20 tracking-widest uppercase">
              © 2026 AVENUE MEDICAL GROUP • 1400 CENTRAL PLAZA, NY
            </div>
          </footer>
          <Toaster position="top-center" theme="dark" />
        </div>
      </AuthProvider>
    </Router>
  );
}
