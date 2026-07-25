import { Router } from "express";
import { getTasks, getTask, createTask, updateTask, deleteTask } from "./db.js";

const router = Router();

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
router.get("/", async (req, res) => {
  let { search, done, limit } = req.query;

  done = done === "true" ? true : done === "false" ? false : undefined;
  search = search ? `%${search}%` : undefined;

  res.json(await getTasks(search, done, parseInt(limit)));
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
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Missing id" });

  const task = await getTask(id);
  if (!task) return res.status(404).json({ error: `Task ${id} not found` });

  res.json(task);
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
router.post("/", async (req, res) => {
  const { title, done } = req.body;
  if (!title) return res.status(400).json({ error: "Missing title" });
  if (done !== undefined && typeof done !== "boolean")
    return res.status(400).json({ error: "Done must be a boolean" });

  const task = await createTask(title, done ?? false);
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
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Missing id" });

  const { title, done } = req.body;
  if (!title && done === undefined)
    return res
      .status(400)
      .json({ error: "Include at least one field to update" });

  if (done !== undefined && typeof done !== "boolean")
    return res.status(400).json({ error: "Done must be a boolean" });

  const task = await updateTask(id, title, done);
  if (!task) return res.status(404).json({ error: `Task ${id} not found` });

  res.json(task);
});

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
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Missing id" });

  const { rowCount } = await deleteTask(id);
  if (rowCount === 0)
    return res.status(404).json({ error: `Task ${id} not found` });

  res.status(204).end();
});

export default router;
