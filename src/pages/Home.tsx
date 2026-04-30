import { useEffect, useState } from 'react';
import { getDoctors } from '../services/doctorService';
import { Doctor } from '../types';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Star, Clock, User, ShieldCheck, HeartPulse } from 'lucide-react';
import BookingDialog from '../components/BookingDialog';
import { motion } from 'motion/react';
import { signInWithGoogle } from '../lib/firebase';
import { toast } from 'sonner';

export default function Home() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoctors().then(docs => {
      setDoctors(docs);
      setLoading(false);
    });
  }, []);

  const handleLoginRequired = () => {
    toast.info("Please enter the patient portal to book.");
    signInWithGoogle();
  };

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center gap-16 py-12 border-b border-white/5">
        <div className="flex-1 space-y-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-serif leading-[1.05] tracking-tight text-white mb-8">
              Exceptional <br />
              <span className="italic text-gold">Care</span> for Life.
            </h1>
            <p className="text-xl text-white/50 leading-relaxed max-w-lg font-light">
              Access our premier network of healthcare providers. Manage your appointments and consult with world-class specialists via your private portal.
            </p>
            
            <div className="flex flex-wrap gap-6 pt-10">
              <Button onClick={() => user ? document.getElementById('doctors-section')?.scrollIntoView({behavior: 'smooth'}) : signInWithGoogle()} size="lg" className="bg-gold text-black hover:bg-gold-hover px-10 py-7 rounded-sm text-xs font-bold uppercase tracking-[0.2em] transition-all">
                {user ? "View Specialists" : "Sign In to Schedule"}
              </Button>
              <div className="hidden sm:flex items-center gap-4 px-6 border-l border-white/10">
                <div className="text-2xl font-serif text-gold">4.9/5</div>
                <div className="text-[10px] uppercase tracking-widest opacity-40 leading-tight">Patient <br/>Satisfaction</div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="flex-1 w-full aspect-[4/5] relative overflow-hidden bg-soft-black border border-white/5">
           <img 
             src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2653&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
             alt="Modern Medical Center" 
             className="object-cover w-full h-full opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent" />
        </div>
      </section>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-12 border-b border-white/5">
        {[
          { label: "Specialists", value: "250+", sub: "World-class surgeons & physicians" },
          { label: "Available", value: "24/7", sub: "Emergency & consulting services" },
          { label: "Trusted By", value: "50k+", sub: "Patients globally each year" }
        ].map((stat, i) => (
          <div key={i} className="space-y-2">
            <h3 className="text-4xl font-serif text-gold">{stat.value}</h3>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/80">{stat.label}</p>
            <p className="text-xs text-white/30 italic">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Doctors Grid */}
      <section id="doctors-section" className="space-y-16 py-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-4xl font-serif text-white">Our Premier Specialists</h2>
          <p className="text-white/40 text-sm italic font-light">Select a specialist below to view profile and availability.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[3/4] w-full animate-pulse bg-soft-black border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctors.map((doc, idx) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
              >
                <Card className="group bg-black/40 border-white/5 hover:border-gold/50 transition-all duration-500 rounded-sm overflow-hidden flex flex-col h-full">
                  <div className="relative aspect-[3/4] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                    <img src={doc.image} alt={doc.name} className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  </div>
                  <CardHeader className="p-6 space-y-4 flex-1">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-gold font-bold">{doc.specialty}</span>
                      <div className="flex items-center gap-1 text-[10px] text-white/40 uppercase tracking-widest font-bold">
                        <Star className="h-2.5 w-2.5 fill-gold text-gold" />
                        {doc.rating}
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-serif text-white group-hover:text-gold transition-colors">{doc.name}</CardTitle>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">{doc.experience} Years Experience</p>
                  </CardHeader>
                  <CardFooter className="p-6 pt-0">
                    {user ? (
                      <BookingDialog doctor={doc} />
                    ) : (
                      <Button onClick={handleLoginRequired} variant="outline" className="w-full border-white/10 hover:border-gold hover:text-gold text-white/60 h-12 text-[10px] uppercase tracking-[0.2em] font-bold rounded-sm">
                        Sign In to Schedule
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
