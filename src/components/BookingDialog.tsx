import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { bookAppointment } from '../services/doctorService';
import { Doctor } from '../types';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { CalendarIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '../lib/utils';

export default function BookingDialog({ doctor }: { doctor: Doctor }) {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBooking = async () => {
    if (!user || !date) return;
    
    setLoading(true);
    try {
      await bookAppointment({
        patientId: user.uid,
        doctorId: doctor.id,
        doctorName: doctor.name,
        date: date.toISOString(),
        status: 'scheduled',
      });
      setSuccess(true);
      toast.success("Consultation scheduled");
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
      }, 2000);
    } catch (error) {
      toast.error("Failed to book consultation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gold text-black hover:bg-gold-hover h-12 text-[10px] uppercase tracking-[0.2em] font-bold rounded-sm border-0">
          Book Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] bg-soft-black border border-white/10 p-0 overflow-hidden shadow-2xl rounded-sm">
        {success ? (
          <div className="flex flex-col items-center justify-center py-24 px-12 space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="bg-gold/10 p-5 rounded-full">
              <CheckCircle2 className="h-14 w-14 text-gold" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-serif text-white">Consultation Confirmed</h3>
              <p className="text-sm text-white/40 italic font-light">We look forward to seeing you at Avenue Medical.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-black/50 p-8 border-b border-white/5">
              <DialogHeader>
                <DialogTitle className="text-3xl font-serif text-white">Schedule Visit</DialogTitle>
                <DialogDescription className="text-white/40 italic mt-2">
                  Select your preferred consultation date with {doctor.name}
                </DialogDescription>
              </DialogHeader>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="flex items-center gap-5 p-5 bg-black/30 border border-white/5 rounded-sm">
                <div className="h-14 w-14 rounded-sm overflow-hidden border border-white/10">
                  <img src={doctor.image} alt={doctor.name} className="object-cover h-full w-full grayscale" />
                </div>
                <div>
                  <p className="text-lg font-serif text-white leading-tight">{doctor.name}</p>
                  <p className="text-[10px] text-gold uppercase tracking-[0.1em] font-bold mt-1">{doctor.specialty}</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold ml-1">Select Date</label>
                <div className="bg-black/20 p-2 border border-white/5 rounded-sm">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0}
                    className="rounded-none border-0 mx-auto bg-transparent"
                  />
                </div>
                {date && (
                  <p className="text-center text-[10px] uppercase tracking-widest font-black text-gold bg-gold/5 py-3 border border-gold/20 rounded-sm">
                    {format(date, 'PPPP')}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="p-8 pt-0">
              <Button 
                onClick={handleBooking} 
                disabled={loading || !date} 
                className="w-full bg-gold text-black hover:bg-gold-hover h-14 text-xs font-bold uppercase tracking-[0.3em] rounded-sm disabled:opacity-50 transition-all shadow-xl shadow-gold/10"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Confirm Selection"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
