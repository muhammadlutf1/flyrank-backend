CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title TEXT,
    done BOOLEAN
);

-- pre-filled
INSERT INTO tasks (title, done) 
VALUES 
    ('Finish the assignment', false),
    ('Buy groceries', true),
    ('Go for a run', false);