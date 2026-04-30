import { collection, getDocs, doc, setDoc, query, where, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Doctor, Appointment, OperationType } from '../types';

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const DOCTORS_PATH = 'doctors';
const APPOINTMENTS_PATH = 'appointments';

export const getDoctors = async (): Promise<Doctor[]> => {
  try {
    const snapshot = await getDocs(collection(db, DOCTORS_PATH));
    const doctors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
    
    if (doctors.length === 0) {
      await seedDoctors();
      return getDoctors();
    }
    
    return doctors;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, DOCTORS_PATH);
    return [];
  }
};

export const bookAppointment = async (appointment: Omit<Appointment, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, APPOINTMENTS_PATH), {
      ...appointment,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, APPOINTMENTS_PATH);
  }
};

export const getPatientAppointments = async (patientId: string): Promise<Appointment[]> => {
  try {
    const q = query(
      collection(db, APPOINTMENTS_PATH),
      where('patientId', '==', patientId),
      orderBy('date', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, APPOINTMENTS_PATH);
    return [];
  }
};

const seedDoctors = async () => {
  const doctors: Omit<Doctor, 'id'>[] = [
    {
      name: "Dr. Sarah Mitchell",
      specialty: "Cardiologist",
      experience: 12,
      rating: 4.9,
      bio: "Expert in interventional cardiology and heart failure management.",
      image: "https://images.unsplash.com/photo-1559839734-2b71f153678f?w=400&h=400&fit=crop",
      department: "Cardiology"
    },
    {
      name: "Dr. James Wilson",
      specialty: "Neurologist",
      experience: 15,
      rating: 4.8,
      bio: "Specializing in stroke prevention and complex neurological disorders.",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b1a8?w=400&h=400&fit=crop",
      department: "Neurology"
    },
    {
      name: "Dr. Elena Rodriguez",
      specialty: "Pediatrician",
      experience: 8,
      rating: 5.0,
      bio: "Dedicated to providing compassionate care for children of all ages.",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
      department: "Pediatrics"
    },
    {
      name: "Dr. David Chen",
      specialty: "Dermatologist",
      experience: 10,
      rating: 4.7,
      bio: "Specialist in clinical dermatology and skin cancer screening.",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
      department: "Dermatology"
    }
  ];

  for (const docData of doctors) {
    await addDoc(collection(db, DOCTORS_PATH), docData);
  }
};
