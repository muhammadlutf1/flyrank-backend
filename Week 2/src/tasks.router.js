const router = require("express").Router();
const { getAllTasks, getTask, createTask, updateTask, deleteTask } = require("./db");

router.get("/", (req, res) => {
    res.json(getAllTasks());
});

router.get("/:id", (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ "error": "Missing id" });

    const task = getTask(id);
    if (!task) return res.status(404).json({ "error": `Task ${id} not found` });

    res.json(getTask(id));
});

router.post("/", (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ "error": "Missing title" });

    const task = createTask(title, 0); // 0: false
    res.json(task);
});

module.exports = router;