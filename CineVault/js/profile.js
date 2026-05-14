function addToHistory(show) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.push(show);
  localStorage.setItem("history", JSON.stringify(history));
}
