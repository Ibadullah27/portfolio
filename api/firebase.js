import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
export function db() {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) throw new Error('FIREBASE_SERVICE_ACCOUNT is not configured');
  const service = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  const app = getApps()[0] || initializeApp({ credential: cert(service) });
  return getFirestore(app);
}
