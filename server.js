const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 5000;
const filePath = path.join(__dirname, "tasks.json");

// Utility: read tasks
function getTasks() {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf8");
  return data ? JSON.parse(data) : [];
}

// Utility: save tasks
function saveTasks(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

// Create server
const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/tasks") {
    const tasks = getTasks();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(tasks));

  } else if (req.method === "POST" && req.url === "/tasks") {
    let body = "";
    req.on("data", chunk => { body += chunk.toString(); });
    req.on("end", () => {
      const { text, time } = JSON.parse(body);
      const tasks = getTasks();
      const newTask = { id: Date.now(), text, time, completed: false };
      tasks.push(newTask);
      saveTasks(tasks);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newTask));
    });

  } else if (req.method === "DELETE" && req.url.startsWith("/tasks/")) {
    const id = parseInt(req.url.split("/")[2]);
    let tasks = getTasks();
    tasks = tasks.filter(t => t.id !== id);
    saveTasks(tasks);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Task deleted" }));

  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Not found" }));
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

