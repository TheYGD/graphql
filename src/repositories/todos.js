const db = require("../db/db");
const { getOneUserById } = require('./users');

const getAllTodos = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM Todos", (err, rows) => {
        if (err) {
            reject(err);
        }
        resolve(rows);
        });
    });
};

const getOneTodoById = (id) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM Todos WHERE id = ?", [id], (err, row) => {
        if (err) {
            reject(err);
        }
        resolve(row);
        });
    });
}

const createOneTodo = async ( title, user_id ) => {
  const user = await getOneUserById(user_id);
  if (!user) {
    return null;
  }
  const todos = await getAllTodos();
  const id = todos[todos.length - 1].id + 1;
  return await new Promise((res, rej) => {
    db.run(
      "INSERT INTO Todos VALUES (?, ?, ?, ?)",
      [id, title, false, user_id],
      (err) => (err ? rej() : res({ id, title, completed: false, user_id }))
    );
  });
}

const updateOneTodo = async (id, title, completed, user_id) => {
    const user = await getOneUserById(user_id);
    const todo = await getOneTodoById(id);
    if (!user) {
        throw new Error(`User with id ${user_id} not found`);
    }
    if (!todo) {
        throw new Error(`Todo with id ${id} not found`);
    }
    return await new Promise((resolve, reject) => {
        db.run("UPDATE Todos SET title = ?, completed = ?, user_id = ? WHERE id = ?", [title, completed, user_id, id], function(err) {
        if (err) {
            reject(err);
        }
        resolve({ id, title, completed, user_id });
        });
    });
}

const deleteOneTodo = async (id) => {
    const todo = await getOneTodoById(id);
    if (!todo) {
        throw new Error(`Todo with id ${id} not found`);
    }
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM Todos WHERE id = ?", [id], function(err) {
        if (err) {
            reject(err);
        }
        resolve(todo);
        });
    });
}

exports.getAllTodos = getAllTodos;
exports.getOneTodoById = getOneTodoById;
exports.createOneTodo = createOneTodo;
exports.updateOneTodo = updateOneTodo;
exports.deleteOneTodo = deleteOneTodo;