export function writeLog(user, action, level = "Info") {
  const logEntry = {
    time: new Date().toLocaleString(),
    user: user || "Unknown",
    action,
    level
  };

  fetch("https://ghirass-api.onrender.com/logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(logEntry)
  }).catch((err) => console.error("Error writing log:", err));
}
