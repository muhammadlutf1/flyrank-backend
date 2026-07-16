const router = require("express").Router();
const { getAllTasks, getTask, createTask, updateTask, deleteTask } = require("./db");

router.get("/", (req, res) => {
    res.json(getAllTasks());
});

router.get("/:id", (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ "error": "Missing id" });

    const task = getTask(req.params.id);
    if (!task) return res.status(404).json({ "error": `Task ${req.params.id} not found` });

    res.status.json(getTask(req.params.id));
});

module.exports = router;