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
    res.status(201).json(task);
});


router.put("/:id", (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ "error": "Missing id" });

    const { title, done } = req.body;
    if (!title && done === undefined) return res.status(400).json({ "error": "Include at least one field to update" });

    if (done !== undefined && (done !== 0 && done !== 1)) return res.status(400).json({ "error": "Done must be 0 or 1" });

    const task = updateTask(id, title, done);
    if (!task) return res.status(404).json({ "error": `Task ${id} not found` });

    res.json(task);
})

router.delete("/:id", (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ "error": "Missing id" });

    const { changes } = deleteTask(id);
    if (!changes) return res.status(404).json({ "error": `Task ${id} not found` });

    res.status(204).end();
});

module.exports = router;