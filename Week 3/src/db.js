import { Client } from "pg";
const client = await new Client({
  connectionString: process.env.DATABASE_URL,
}).connect();

// Helpers
export const getTasks = async (search, done, limit) => {
  const limitClause = limit ? `LIMIT ${limit}` : "";

  if (search && done)
    return (
      await client.query(
        `SELECT * FROM tasks WHERE title LIKE $1 AND done = $2 ${limitClause}`,
        [search, done],
      )
    ).rows;

  if (search)
    return (
      await client.query(
        `SELECT * FROM tasks WHERE title LIKE $1 ${limitClause}`,
        [search],
      )
    ).rows;

  if (typeof done === "number")
    return (
      await client.query(`SELECT * FROM tasks WHERE done = $1 ${limitClause}`, [
        done,
      ])
    ).rows;

  return (await client.query(`SELECT * FROM tasks ${limitClause}`)).rows;
};

export const getTask = async (id) => {
  return (await client.query("SELECT * FROM tasks WHERE id = $1", [id]))
    .rows[0];
};

export const createTask = async (title, done) => {
  return (
    await client.query(
      "INSERT INTO tasks (title, done) VALUES ($1, $2) RETURNING *",
      [title, done],
    )
  ).rows[0];
};

export const updateTask = async (id, title, done) => {
  if (title && done)
    return (
      await client.query(
        "UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING *",
        [title, done, id],
      )
    ).rows[0];

  if (title)
    return (
      await client.query(
        "UPDATE tasks SET title = $1 WHERE id = $2 RETURNING *",
        [title, id],
      )
    ).rows[0];

  return (
    await client.query("UPDATE tasks SET done = $1 WHERE id = $2 RETURNING *", [
      done,
      id,
    ])
  ).rows[0];
};

export const deleteTask = (id) => {
  return client.query("DELETE FROM tasks WHERE id = $1", [id]);
};

export const getTasksStats = async () => {
  return (
    await client.query(`
    SELECT
      SUM(CASE WHEN done = true THEN 1 ELSE 0 END) AS done,
      SUM(CASE WHEN done = false THEN 1 ELSE 0 END) AS open
    FROM tasks
  `)
  ).rows[0];
};
