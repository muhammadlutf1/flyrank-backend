const express = require("express");
const app = express();

const tasksRouter = require("./tasks.router");

app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ "status": "ok" });
})

const endpoints = ["/tasks", "/tasks/:id", "/health"];

app.use("/tasks", tasksRouter);

app.get("/", (req, res) => {
    res.json({ "name": "Task API", "version": "1.0", endpoints });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});