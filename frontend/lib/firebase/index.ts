import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { config } from '@/config';

// Initialize Firebase only if it hasn't been initialized yet
const firebaseApp = getApps().length === 0 
  ? initializeApp(config.firebase) 
  : getApps()[0];

export const auth = getAuth(firebaseApp);

// Connect to emulator in development if needed
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099');
}

export { firebaseApp };
