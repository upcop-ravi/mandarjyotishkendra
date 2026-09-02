// src/lib/firebase.js
// ─────────────────────────────────────────────────────────
// Firebase SDK initialization. Replace the values below with
// your actual Firebase project credentials from the Console.
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

const app        = initializeApp(firebaseConfig);
export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);

// ── Post helpers ──────────────────────────────────────────
export const postsRef = () => collection(db, 'posts');

export async function fetchPublishedPosts() {
  const q = query(
    collection(db, 'posts'),
    where('status', '==', 'published'),
    orderBy('date', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function fetchAllPosts() {
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createPost(data) {
  return addDoc(collection(db, 'posts'), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

export async function updatePost(id, data) {
  return updateDoc(doc(db, 'posts', id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deletePost(id) {
  return deleteDoc(doc(db, 'posts', id));
}

export async function getPost(id) {
  const snap = await getDoc(doc(db, 'posts', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// ── Storage helpers ───────────────────────────────────────
export async function uploadImage(file, path) {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteImage(url) {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (_) { /* ignore if already deleted */ }
}

export { Timestamp };
