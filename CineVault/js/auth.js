window.firebaseConfig = {
  apiKey: "AIzaSyB55mJE2aoJBU1MITNPC8ITRJTYJX6tks8",
  authDomain: "cinevault-f87d8.firebaseapp.com",
  projectId: "cinevault-f87d8",
  storageBucket: "cinevault-f87d8.firebasestorage.app",
  messagingSenderId: "104270493917",
  appId: "1:104270493917:web:1a44ea96ea122cd90f4334",
  measurementId: "G-9X8KN8TP9R"
};

const LOCAL_USERS_KEY = "cinevault-demo-users";
const LOCAL_SESSION_KEY = "cinevault-session";
const authMessage = document.getElementById("authMessage");

let firebaseAuth = null;
let firebaseFns = null;

initFirebase();

window.login = async function () {
  const { email, password } = getCredentials();

  if (!validateCredentials(email, password)) return;

  setMessage("Signing you in...");

  if (firebaseAuth && firebaseFns) {
    try {
      await firebaseFns.signInWithEmailAndPassword(firebaseAuth, email, password);
      saveSession(email, "firebase");
      window.location.href = "home.html";
      return;
    } catch (error) {
      const canTryLocal = [
        "auth/invalid-credential",
        "auth/user-not-found",
        "auth/wrong-password",
        "auth/network-request-failed",
        "auth/unauthorized-domain"
      ].includes(error.code);

      if (!canTryLocal) {
        setMessage(formatAuthError(error.code), "error");
        return;
      }
    }
  }

  loginWithLocalAccount(email, password);
};

window.signup = async function () {
  const { email, password } = getCredentials();

  if (!validateCredentials(email, password)) return;

  setMessage("Creating your account...");

  if (firebaseAuth && firebaseFns) {
    try {
      await firebaseFns.createUserWithEmailAndPassword(firebaseAuth, email, password);
      saveSession(email, "firebase");
      setMessage("Account created. Redirecting...", "success");
      setTimeout(() => {
        window.location.href = "home.html";
      }, 700);
      return;
    } catch (error) {
      const canUseLocalFallback = [
        "auth/network-request-failed",
        "auth/operation-not-allowed",
        "auth/unauthorized-domain"
      ].includes(error.code);

      if (!canUseLocalFallback) {
        setMessage(formatAuthError(error.code), "error");
        return;
      }
    }
  }

  createLocalAccount(email, password);
};

async function initFirebase() {
  try {
    const [{ initializeApp }, authModule] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js")
    ]);

    const app = initializeApp(firebaseConfig);
    firebaseAuth = authModule.getAuth(app);
    firebaseFns = authModule;
  } catch {
    setMessage("Demo auth is ready. Create an account to continue.");
  }
}

function createLocalAccount(email, password) {
  const users = getLocalUsers();

  if (users[email]) {
    setMessage("This email already has a demo account. Sign in instead.", "error");
    return;
  }

  users[email] = {
    email,
    password: encodePassword(password),
    createdAt: new Date().toISOString()
  };

  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  saveSession(email, "demo");
  setMessage("Demo account created. Redirecting...", "success");

  setTimeout(() => {
    window.location.href = "home.html";
  }, 700);
}

function loginWithLocalAccount(email, password) {
  const user = getLocalUsers()[email];

  if (!user || user.password !== encodePassword(password)) {
    setMessage("No matching demo account found. Create an account first.", "error");
    return;
  }

  saveSession(email, "demo");
  window.location.href = "home.html";
}

function getLocalUsers() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY)) || {};
  } catch {
    return {};
  }
}

function saveSession(email, provider) {
  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({ email, provider }));
}

function encodePassword(password) {
  return btoa(unescape(encodeURIComponent(password)));
}

function getCredentials() {
  return {
    email: document.getElementById("email").value.trim().toLowerCase(),
    password: document.getElementById("password").value
  };
}

function validateCredentials(email, password) {
  if (!email || !password) {
    setMessage("Enter both email and password.", "error");
    return false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setMessage("Enter a valid email address.", "error");
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
    "auth/operation-not-allowed": "Firebase email/password sign-up is not enabled.",
    "auth/unauthorized-domain": "This domain is not authorized in Firebase.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Email or password is incorrect.",
    "auth/weak-password": "Choose a stronger password."
  };

  return messages[code] || "Authentication failed. Please try again.";
}
