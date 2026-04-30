import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getPatientAppointments } from '../services/doctorService';
import { Appointment } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Calendar, Clock, MapPin, User, FileText, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { ScrollArea } from '../components/ui/scroll-area';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getPatientAppointments(user.uid).then(apps => {
        setAppointments(apps);
        setLoading(false);
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        <div className="bg-soft-black p-8 border border-white/5 shadow-2xl">
           <AlertCircle className="h-14 w-14 text-white/20" />
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-serif text-white">Access Restricted</h2>
          <p className="text-white/40 italic font-light">Please sign in to your medical account to view records.</p>
        </div>
        <Link to="/">
          <Button size="lg" className="bg-gold text-black hover:bg-gold-hover px-10 py-7 text-xs font-bold uppercase tracking-widest rounded-sm">Return Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-16 py-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-white/5 pb-10">
        <div className="space-y-4">
          <span className="text-[10px] text-gold uppercase tracking-[0.3em] font-bold">Patient Portal</span>
          <h1 className="text-6xl font-serif text-white leading-tight">Welcome, <br/><span className="italic text-white/60">{profile?.displayName || user.displayName}</span></h1>
          <p className="text-white/30 text-sm italic font-light">Manage your upcoming visits and medical records in safety.</p>
        </div>
        <div className="flex items-center gap-4 bg-black/40 p-6 border border-white/5 shadow-xl rounded-sm">
           <div className="bg-gold/10 p-3 rounded-full">
             <CheckCircle2 className="h-6 w-6 text-gold" />
           </div>
           <div>
             <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Profile Verified</p>
             <p className="text-sm font-serif text-white uppercase tracking-widest">Active Member</p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Appointments List */}
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif text-white flex items-center gap-3">
              <Calendar className="h-6 w-6 text-gold" />
              Your Schedule
            </h2>
          </div>

          {loading ? (
            <div className="space-y-8">
              {[1, 2].map(i => (
                <div key={i} className="h-40 w-full animate-pulse bg-soft-black border border-white/5" />
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <div className="bg-soft-black/30 border border-white/5 p-20 text-center space-y-6">
              <div className="bg-black/40 p-5 rounded-full w-fit mx-auto border border-white/5 shadow-inner">
                <Calendar className="h-8 w-8 text-white/10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif text-white">No Appointments</h3>
                <p className="text-sm text-white/30 italic max-w-xs mx-auto">Access our specialized network to schedule your first consultation.</p>
              </div>
              <Link to="/">
                <Button className="bg-white/5 hover:bg-white/10 text-white/60 text-[10px] uppercase tracking-widest px-8 rounded-sm py-6">Browse Doctors</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {appointments.map((app, idx) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="bg-black/40 border-white/5 hover:border-gold/30 transition-all duration-500 rounded-sm group overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="bg-gold p-8 flex flex-col items-center justify-center md:w-40 text-black shrink-0">
                           <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-2">{format(new Date(app.date), 'MMM')}</span>
                           <span className="text-5xl font-serif italic">{format(new Date(app.date), 'dd')}</span>
                        </div>
                        <div className="p-8 flex-1 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                           <div className="space-y-4">
                             <div className="flex items-center gap-3">
                               <span className="text-[10px] text-gold uppercase tracking-[0.2em] font-bold border border-gold/30 px-3 py-1 rounded-sm">
                                 Confirmed
                               </span>
                               <span className="text-[10px] text-white/30 tracking-[0.2em] uppercase font-bold flex items-center gap-1.5">
                                 <Clock className="h-3 w-3" />
                                 {format(new Date(app.date), 'hh:mm a')}
                               </span>
                             </div>
                             <div>
                               <h3 className="text-3xl font-serif text-white group-hover:text-gold transition-colors">Consultation with <span className="italic opacity-60">{app.doctorName}</span></h3>
                               <p className="text-xs text-white/30 flex items-center gap-1.5 mt-3 uppercase tracking-widest font-bold">
                                 <MapPin className="h-3 w-3 text-gold" />
                                 Central Plaza • Suite 402
                               </p>
                             </div>
                           </div>
                           <div className="flex gap-4">
                             <Button variant="outline" className="border-white/10 hover:border-gold hover:text-gold text-white/40 text-[10px] uppercase tracking-widest h-12 px-6 rounded-sm">
                               Reschedule
                             </Button>
                           </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Health Profile */}
        <div className="space-y-10">
           <Card className="bg-soft-black border-white/5 shadow-2xl rounded-sm group overflow-hidden">
             <CardHeader className="p-8 border-b border-white/5 bg-black/40">
                <CardTitle className="text-xl font-serif text-white flex items-center gap-3">
                  <User className="h-5 w-5 text-gold" />
                  Health Record
                </CardTitle>
             </CardHeader>
             <CardContent className="p-8 space-y-10">
                <div className="flex items-center gap-6">
                   <div className="h-16 w-16 rounded-sm bg-gold/5 flex items-center justify-center font-serif text-3xl text-gold border border-gold/20 italic">
                     {user.displayName?.[0]}
                   </div>
                   <div className="space-y-1">
                     <p className="text-lg font-serif text-white leading-tight">{profile?.displayName || user.displayName}</p>
                     <p className="text-xs text-white/20 uppercase tracking-widest font-medium">Digital ID: AM-{user.uid.slice(0,6).toUpperCase()}</p>
                   </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                   <div className="flex justify-between items-center p-4 bg-black/20 border border-white/5">
                     <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Blood Group</span>
                     <span className="text-sm font-serif italic text-gold">O-Positive</span>
                   </div>
                   <div className="flex justify-between items-center p-4 bg-black/20 border border-white/5">
                     <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Latest Vitals</span>
                     <span className="text-sm font-serif italic text-white/60 italic">Stable</span>
                   </div>
                   <div className="flex justify-between items-center p-4 bg-black/20 border border-white/5">
                     <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Documents</span>
                     <span className="text-sm font-serif italic text-gold hover:underline cursor-pointer">Access (12)</span>
                   </div>
                </div>
             </CardContent>
           </Card>

           <div className="p-10 bg-gold text-black space-y-6 rounded-sm relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                <FileText className="h-8 w-8 opacity-40 shrink-0" />
                <h3 className="text-4xl font-serif leading-[1.1]">Require <br/><span className="italic opacity-60">Immediate</span> Advice?</h3>
                <p className="text-black/60 text-sm leading-relaxed font-medium">Connect with our on-call specialist panel for urgent medical consultations via private link.</p>
                <Button className="w-full bg-black text-white hover:bg-black/90 font-bold text-[10px] uppercase tracking-[0.3em] h-14 rounded-sm transition-all shadow-xl shadow-black/20">
                  Connect Now
                </Button>
              </div>
              <div className="absolute top-0 right-0 h-40 w-40 bg-white/10 blur-3xl -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000" />
           </div>
        </div>
      </div>
    </div>
  );
}
