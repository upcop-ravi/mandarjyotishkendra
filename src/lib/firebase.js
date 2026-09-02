// src/lib/firebase.js
// ─────────────────────────────────────────────────────────
// Firebase SDK initialization with safe fallback for unconfigured environments
// ─────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if valid Firebase configuration is supplied
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'YOUR_API_KEY' &&
  !firebaseConfig.apiKey.includes('undefined')
);

let app = null;
let auth = null;
let db = null;
let storage = null;

if (isFirebaseConfigured) {
  try {
    app     = initializeApp(firebaseConfig);
    auth    = getAuth(app);
    db      = getFirestore(app);
    storage = getStorage(app);
  } catch (err) {
    console.warn('Firebase initialization warning:', err.message);
  }
}

export { auth, db, storage };

// ── Post helpers ──────────────────────────────────────────
export async function fetchPublishedPosts() {
  if (!isFirebaseConfigured || !db) {
    return [];
  }
  try {
    const q = query(
      collection(db, 'posts'),
      where('status', '==', 'published'),
      orderBy('date', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn('Firestore fetchPublishedPosts error:', err.message);
    return [];
  }
}

export async function fetchAllPosts() {
  if (!isFirebaseConfigured || !db) {
    return [];
  }
  try {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn('Firestore fetchAllPosts error:', err.message);
    return [];
  }
}

export async function createPost(data) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured. Please set your credentials in .env');
  }
  return addDoc(collection(db, 'posts'), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

export async function updatePost(id, data) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured. Please set your credentials in .env');
  }
  return updateDoc(doc(db, 'posts', id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deletePost(id) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured. Please set your credentials in .env');
  }
  return deleteDoc(doc(db, 'posts', id));
}

export async function getPost(id) {
  if (!isFirebaseConfigured || !db) {
    return null;
  }
  try {
    const snap = await getDoc(doc(db, 'posts', id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (err) {
    return null;
  }
}

// ── Storage helpers ───────────────────────────────────────
export async function uploadImage(file, path) {
  if (!isFirebaseConfigured || !storage) {
    throw new Error('Firebase Storage is not configured.');
  }
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteImage(url) {
  if (!isFirebaseConfigured || !storage) return;
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (_) { /* ignore */ }
}

export { Timestamp };
