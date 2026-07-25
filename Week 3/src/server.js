import express from "express";
import path from "node:path";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import tasksRouter from "./tasks.router.js";
import { getTasksStats } from "./db.js";

const app = express();

const specs = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo API",
      description:
        "A small CRUD API for managing a to-do list — create, read, update, and delete tasks, backed by in-memory storage",
      version: "1.0.0",
    },
    components: {
      schemas: {
        Task: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            title: { type: "string", example: "Buy milk" },
            done: { type: "boolean", example: false },
          },
          required: ["id", "title", "done"],
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string", example: "Task 99 not found" },
          },
        },
      },
    },
  },
  apis: [
    path.join(import.meta.dirname, "server.js"),
    path.join(import.meta.dirname, "tasks.router.js"),
  ],
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json());

const endpoints = ["/tasks", "/tasks/:id", "/health", "/stats", "/docs"];

app.use("/tasks", tasksRouter);

/**
 * @openapi
 * /:
 *   get:
 *     description: Root endpoint
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "Task API"
 *                 version:
 *                   type: string
 *                   example: "1.0"
 *                 endpoints:
 *                   type: array
 *                   items:
 *                     type: string
 */
app.get("/", (req, res) => {
  res.json({ name: "Task API", version: "1.0", endpoints });
});

/**
 * @openapi
 * /health:
 *   get:
 *     description: Health check endpoint
 *     responses:
 *       200:
 *         description: OK
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/**
 * @openapi
 * /stats:
 *   get:
 *     description: Stats endpoint
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 10
 *                 done:
 *                   type: integer
 *                   example: 5
 *                 open:
 *                   type: integer
 *                   example: 5
 */
app.get("/stats", async (req, res) => {
  const stats = await getTasksStats();

  stats.done = Number(stats.done);
  stats.open = Number(stats.open);
  res.json({ total: stats.done + stats.open, ...stats });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
