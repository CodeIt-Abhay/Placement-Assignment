import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB7gaMGu6PV2kOQREXYTaC67wNNYJiqaP8",
  authDomain: "netflix-2613c.firebaseapp.com",
  projectId: "netflix-2613c",
  storageBucket: "netflix-2613c.firebasestorage.app",
  messagingSenderId: "600788158614",
  appId: "1:600788158614:web:920d6f5d311f94e18b5ab7",
  measurementId: "G-QX7WZ8G87L"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const authMessage = document.getElementById("authMessage");

window.login = async function () {
  const { email, password } = getCredentials();

  if (!validateCredentials(email, password)) return;

  setMessage("Signing you in...");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "home.html";
  } catch (error) {
    setMessage(formatAuthError(error.code), "error");
  }
};

window.signup = async function () {
  const { email, password } = getCredentials();

  if (!validateCredentials(email, password)) return;

  setMessage("Creating your account...");

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    setMessage("Account created. You can sign in now.", "success");
  } catch (error) {
    setMessage(formatAuthError(error.code), "error");
  }
};

function getCredentials() {
  return {
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value
  };
}

function validateCredentials(email, password) {
  if (!email || !password) {
    setMessage("Enter both email and password.", "error");
    return false;
  }

  if (password.length < 6) {
    setMessage("Password must be at least 6 characters.", "error");
    return false;
  }

  return true;
}

function setMessage(message, type = "") {
  authMessage.textContent = message;
  authMessage.className = `form-message ${type}`.trim();
}

function formatAuthError(code) {
  const messages = {
    "auth/email-already-in-use": "This email already has an account.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/invalid-credential": "Email or password is incorrect.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Email or password is incorrect.",
    "auth/weak-password": "Choose a stronger password."
  };

  return messages[code] || "Authentication failed. Please try again.";
}
