// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Adicionando o storage

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Inicializando o storage

function isLoggedIn(callback) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      callback(true);
    } else {
      callback(false);
    }
  });
}

const logout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
};

// Exportando auth, db e storage para serem usados em outros lugares
export { auth, db, storage, isLoggedIn, logout };
