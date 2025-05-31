import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Configuración de Firebase proporcionada por el usuario
const firebaseConfig = {
  apiKey: "AIzaSyCwpHoVj63MTD3eVuzAhCxhS6jXGnjl0mE",
  authDomain: "wayrai.firebaseapp.com",
  projectId: "wayrai",
  storageBucket: "wayrai.firebasestorage.app",
  messagingSenderId: "980831941278",
  appId: "1:980831941278:web:b66dab2757e735c5b4418f",
  measurementId: "G-DXQSKK54HP"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Inicializar Analytics solo en entorno de navegador
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };

export default app; 