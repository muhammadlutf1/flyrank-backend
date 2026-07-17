const router = require("express").Router();
const { getAllTasks, getTask, createTask, updateTask, deleteTask } = require("./db");

/**
 * @openapi
 * /tasks:
 *   get:
 *     description: Get all tasks
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get("/", (req, res) => {
    res.json(getAllTasks());
});

/**
 * @openapi
 * /tasks/{id}:
 *   get:
 *     description: Get a task by id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:     
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request - missing id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Not found - task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ "error": "Missing id" });

    const task = getTask(id);
    if (!task) return res.status(404).json({ "error": `Task ${id} not found` });

    res.json(getTask(id));
});

/**
 * @openapi
 * /tasks:
 *   post:
 *     description: Create a task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request - missing title
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error' 
 */
router.post("/", (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ "error": "Missing title" });

    const task = createTask(title, 0); // 0: false
    res.status(201).json(task);
});

/**
 * @openapi
 * /tasks/{id}:
 *   put:
 *     description: Update a task by id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               done:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request - missing id or missing title or done must be 0 or 1
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Not found - task not found
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ "error": "Missing id" });

    const { title, done } = req.body;
    if (!title && done === undefined) return res.status(400).json({ "error": "Include at least one field to update" });

    if (typeof done !== "boolean") return res.status(400).json({ "error": "Done must be boolean" });

    const task = updateTask(id, title, done);
    if (!task) return res.status(404).json({ "error": `Task ${id} not found` });

    res.json(task);
})

/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     description: Delete a task by id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: No content
 *       400:
 *         description: Bad request - missing id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Not found - task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ "error": "Missing id" });

    const { changes } = deleteTask(id);
    if (!changes) return res.status(404).json({ "error": `Task ${id} not found` });

    res.status(204).end();
});

module.exports = router;