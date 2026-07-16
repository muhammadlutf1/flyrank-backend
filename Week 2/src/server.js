const express = require("express");
const app = express();

const endpoints = ["/tasks"]

app.get("/health", (req, res) => {
    res.json({ "status": "ok" });
})

app.get("/", (req, res) => {
    res.json({ "name": "Task API", "version": "1.0", endpoints });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});