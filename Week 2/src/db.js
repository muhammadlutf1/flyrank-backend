const { DatabaseSync } = require("node:sqlite");

const database = new DatabaseSync(":memory:");

database.exec(`
    CREATE TABLE tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        done BOOLEAN
    );

    -- pre-filled
    INSERT INTO tasks (title, done) 
    VALUES 
        ('Finish the assignment', 0),
        ('Buy groceries', 1),
        ('Go for a run', 0);
`)


// Helpers
const getAllTasks = () => database.prepare("SELECT * FROM tasks").all();
const getTask = (id) => database.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
const createTask = (title, done) => database.prepare("INSERT INTO tasks (title, done) VALUES (?, ?) RETURNING *").get(title, done);
const updateTask = (id, title, done) => {
    if (title && done) return database.prepare("UPDATE tasks SET title = ?, done = ? WHERE id = ? RETURNING *").get(title, done, id);
    if (title) return database.prepare("UPDATE tasks SET title = ? WHERE id = ? RETURNING *").get(title, id);
    return database.prepare("UPDATE tasks SET done = ? WHERE id = ? RETURNING *").get(done, id);
};
const deleteTask = (id) => database.prepare("DELETE FROM tasks WHERE id = ?").run(id);

module.exports = {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
};