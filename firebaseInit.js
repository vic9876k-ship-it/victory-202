import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC4HhpXcYdGhvFRIz4IHksilgnMnRDbiS8",
    authDomain: "victory-fb944.firebaseapp.com",
    projectId: "victory-fb944",
    storageBucket: "victory-fb944.firebasestorage.app",
    messagingSenderId: "650310438797",
    appId: "1:650310438797:web:c0bd9a1caaa6093d5137c4"
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

// Set auth persistence
await setPersistence(auth, browserLocalPersistence);

// Make globally available
window.auth = auth;
window.db = db;
window.app = app;

export { auth, db, app };
