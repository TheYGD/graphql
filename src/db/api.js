const axios = require("axios")

async function getRestUsersList(){
 try {
    const users = await axios.get("https://jsonplaceholder.typicode.com/users")
    return users.data.map(({ id, name, email, username }) => ({
        id: id,
        name: name,
        email: email,
        login: username,
    }))
    } catch (error) {
        throw error
 }
}

async function getRestTodosList(){
 try {
 const users = await axios.get("https://jsonplaceholder.typicode.com/todos")
 return users.data.map(({ id, userId, title, completed }) => ({
    id: id,
    title: title,
    completed: completed,
    user_id: userId,
 }))
 } catch (error) {
    throw error
 }
}

exports.getRestUsersList = getRestUsersList
exports.getRestTodosList = getRestTodosList