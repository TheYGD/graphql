const { createSchema } = require('graphql-yoga');
const { createServer } = require( 'node:http');
const { createYoga } = require( 'graphql-yoga');
const fs = require('node:fs');
const path = require('path');
const { getRestUsersList, getRestTodoList} = require('./api');

const todoById = async (parent, args, context, info) => {
    const todoList = await getRestTodoList();
    return todoList.find(t => t.id == args.id);
}
const userById = async (parent, args, context, info) => {
    const userList = await getRestUsersList();
    return userList.find(u => u.id == args.id);
}

const getUserTodos = async (parent, args, context, info) => {
    const todoList = await getRestTodoList();
    return todoList.filter(todo => todo.userId === parent.id);
}

const getTodoUser = async (parent, args, context, info) => {
    const userList = await getRestUsersList();
    return userList.filter(user => user.id === parent.userId)[0];
}

const schema = createSchema({
    typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8'),
    resolvers: {
        Query: {
            users: () => getRestUsersList(),
            todos: () => getRestTodoList(),
            todo: async (parent, args, context, info) =>
                todoById(parent, args, context, info),
            user: async (parent, args, context, info) =>
                userById(parent, args, context, info)
        },
        User:{
            todos: async (parent, args, context, info) =>
                getUserTodos(parent, args, context, info)
        },
        ToDoItem:{
            user: async (parent, args, context, info) =>
                getTodoUser(parent, args, context, info)
        }
    }
})

// Create a Yoga instance with a GraphQL schema.
const yoga = createYoga({
    schema,
    graphqlEndpoint: '/'
})

// Pass it into a server to hook into request handlers.
const server = createServer(yoga)

// Start the server and you're done!
server.listen(4000, () => {
    console.info('Server is running on http://localhost:4000/')
})