const status = document.getElementById("status");

function updateStatus() {
  status.innerText = navigator.onLine ? "Online" : "Offline mode";
  status.className = navigator.onLine ? "online" : "offline";
}

window.addEventListener("online", updateStatus);
window.addEventListener("offline", updateStatus);

updateStatus();
