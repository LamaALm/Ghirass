export const writeLog = (action, level = "Info", user = "System") => {
  const newLog = {
    time: new Date().toLocaleString(),
    action,
    level,
    user
  };

  fetch("https://ghirass-api.onrender.com/logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newLog)
  }).catch((err) => console.error("Error writing log:", err));
};
