const db = require("./db");
const { getRestTodosList, getRestUsersList } = require("./api");

async function seed() {
  const users = await getRestUsersList();
  const todos = await getRestTodosList();

  db.exec(
    `
  CREATE TABLE IF NOT EXISTS Users (
    id INTEGER NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    login TEXT NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS Todos (
    id INTEGER NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    completed BOOLEAN NOT NULL,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES Users(id)
  );`,
    (res, err) => {
      if (err) {
        console.log("Something went wrong", err);
      }

      const stmt = db.prepare("INSERT INTO Users VALUES (?, ?, ?, ?)");
      for (const user of users) {
        stmt.run(Object.values(user));
      }
      stmt.finalize(() => {
        const stmt = db.prepare("INSERT INTO Todos VALUES (?, ?, ?, ?)");
        for (const todo of todos) {
          stmt.run(Object.values(todo));
        }
        stmt.finalize();
      });
    }
  );
}

seed();