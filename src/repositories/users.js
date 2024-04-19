const db = require("../db/db");

const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM Users", (err, rows) => {
        if (err) {
            reject(err);
        }
        resolve(rows);
        });
    });
}

const getOneUserById = (id) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM Users WHERE id = ?", [id], (err, row) => {
        if (err) {
            reject(err);
        }
        resolve(row);
        });
    });
}

const createOneUser = (name, email, login) => {
    return getAllUsers().then((users) => {
    const id = users[users.length - 1].id + 1;
    return new Promise((res, rej) => {
      db.run(
        "INSERT INTO Users VALUES (?, ?, ?, ?)",
        [id, name, email, login],
        (err) => (err ? rej() : res({ id, name, email, login }))
      );
    });
  });
}

const updateOneUser = async (id, name, email, login) => {
    const user = await getOneUserById(id);
    if (!user) {
        throw new Error(`User with id ${id} not found`);
    }
    return await new Promise((resolve, reject) => {
        db.run("UPDATE Users SET name = ?, email = ?, login = ? WHERE id = ?", [name, email, login, id], function(err) {
        if (err) {
            reject(err);
        }
        resolve({ id, name, email, login });
        });
    });
}

const deleteOneUser = async (id) => {
    const user = await getOneUserById(id);
    if (!user) {
        throw new Error(`User with id ${id} not found`);
    }
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM Users WHERE id = ?", [id], function(err) {
        if (err) {
            reject(err);
        }
        resolve(user);
        });
    });
}

exports.getAllUsers = getAllUsers;
exports.getOneUserById = getOneUserById;
exports.createOneUser = createOneUser;
exports.updateOneUser = updateOneUser;
exports.deleteOneUser = deleteOneUser;