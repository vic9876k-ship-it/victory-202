// Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyC4HhpXcYdGhvFRIz4IHksilgnMnRDbiS8",
  authDomain: "victory-fb944.firebaseapp.com",
  projectId: "victory-fb944",
  storageBucket: "victory-fb944.firebasestorage.app",
  messagingSenderId: "650310438797",
  appId: "1:650310438797:web:c0bd9a1caaa6093d5137c4"
};

// Initialize Firebase
export const initFirebase = async () => {
  if (!window.firebase || !window.firebase.app) {
    const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js');
    const {
      getAuth,
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword,
      signOut,
      onAuthStateChanged,
      updateProfile
    } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js');
    const {
      getFirestore,
      collection,
      doc,
      addDoc,
      getDoc,
      getDocs,
      setDoc,
      updateDoc,
      query,
      where,
      orderBy,
      limit,
      onSnapshot,
      deleteDoc,
      arrayUnion,
      serverTimestamp
    } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js');

    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    window.firebase = { app, auth, db };
    window.auth = auth;
    window.db = db;
    window.firebaseAuth = {
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword,
      signOut,
      onAuthStateChanged,
      updateProfile
    };
    window.firestore = {
      collection,
      doc,
      addDoc,
      getDoc,
      getDocs,
      setDoc,
      updateDoc,
      query,
      where,
      orderBy,
      limit,
      onSnapshot,
      deleteDoc,
      arrayUnion,
      serverTimestamp
    };

    return { app, auth, db };
  }

  return {
    app: window.firebase.app,
    auth: window.firebase.auth,
    db: window.firebase.db
  };
};

// Get current user data
export const getCurrentUserData = async () => {
  const { auth, db } = window.firebase || {};
  if (!auth?.currentUser) return null;
  
  const userDoc = await window.firestore.getDoc(
    window.firestore.doc(db, 'users', auth.currentUser.uid)
  );
  
  return userDoc.exists() ? userDoc.data() : null;
};
