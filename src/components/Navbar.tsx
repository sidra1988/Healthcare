import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { signInWithGoogle, logout } from '../lib/firebase';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Stethoscope, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import { toast } from 'sonner';

export default function Navbar() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      toast.success("Welcome back to Avenue Medical");
    } catch (error) {
      toast.error("Authentication failed");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast.success("Successfully signed out");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-deep-black/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-gold w-8 h-8 rounded-sm flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-black font-bold text-lg leading-none">+</span>
          </div>
          <span className="text-lg tracking-[0.3em] font-serif italic text-white uppercase hidden sm:block">Avenue Medical</span>
        </Link>

        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center space-x-8 text-[10px] uppercase tracking-[0.2em] font-semibold text-white/60">
            <Link to="/" className="hover:text-gold transition-colors">Specialties</Link>
            <Link to="/" className="hover:text-gold transition-colors">Surgeons</Link>
            {user && <Link to="/dashboard" className="hover:text-gold transition-colors text-gold">Patient Portal</Link>}
          </nav>

          <div className="flex items-center gap-6 border-l border-white/10 pl-6">
            {user ? (
              <div className="flex items-center gap-4">
                <Avatar className="h-8 w-8 rounded-sm border border-white/20">
                  <AvatarImage src={user.photoURL || ''} />
                  <AvatarFallback className="bg-soft-black text-[10px]">{user.displayName?.[0]}</AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-white/40 hover:text-white hover:bg-white/5 h-8 w-8">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={handleLogin} className="bg-gold text-black hover:bg-gold-hover h-10 px-6 text-[10px] uppercase tracking-[0.2em] font-bold rounded-sm">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
