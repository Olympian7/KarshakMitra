import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

function requirePublicEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Add it to .env.local (dev) or Vercel env (prod).`
    );
  }
  return value;
}

const isBrowser = typeof window !== 'undefined';

let firebaseConfig: FirebaseWebConfig | null = null;
if (isBrowser) {
  firebaseConfig = {
    apiKey: requirePublicEnv('NEXT_PUBLIC_FIREBASE_API_KEY', process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
    authDomain: requirePublicEnv(
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    ),
    projectId: requirePublicEnv(
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    ),
    storageBucket: requirePublicEnv(
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    ),
    messagingSenderId: requirePublicEnv(
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
    ),
    appId: requirePublicEnv('NEXT_PUBLIC_FIREBASE_APP_ID', process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
  };
}

export const app = isBrowser
  ? (getApps().length ? getApps()[0]! : initializeApp(firebaseConfig!))
  : (null as any);
export const auth = isBrowser ? getAuth(app) : (null as any);
export const db = isBrowser ? getFirestore(app) : (null as any);

// Optional local emulators (set NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true)
const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';
if (useEmulator && isBrowser) {
  const authHost = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST ?? 'localhost:9099';
  const [authHostname, authPort] = authHost.split(':');
  connectAuthEmulator(auth, `http://${authHostname}:${authPort}`, { disableWarnings: true });

  const firestoreHost = process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_HOST ?? 'localhost:8080';
  const [fsHostname, fsPort] = firestoreHost.split(':');
  connectFirestoreEmulator(db, fsHostname!, Number(fsPort));
}
