const axios = require('axios');

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
        throw error;
    }
}

async function getRestTodoList(){
    try {
        const todos = await axios.get("https://jsonplaceholder.typicode.com/todos")
        return todos.data
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getRestUsersList,
    getRestTodoList
}