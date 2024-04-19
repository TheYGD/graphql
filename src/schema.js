const { createSchema } = require('graphql-yoga')
const fs = require('fs')
const path = require('path')
const { getAllTodos, getOneTodoById, createOneTodo, deleteOneTodo, updateOneTodo } = require('./repositories/todos')
const { getAllUsers, getOneUserById, createOneUser, deleteOneUser, updateOneUser } = require('./repositories/users')

function todoById(parent, args, context, info){
 return todosList.find(t => t.id == args.id);
}
function userById(parent, args, context, info){
 return usersList.find(u => u.id == args.id);
} 

const resolvers = {
  Query: {
    todos: () => getAllTodos(),
    todo: (parent, args, context, info) => getOneTodoById(args.id),
    users: () => getAllUsers(),
    user: (parent, args, context, info) => getOneUserById(args.id),
  },
  Todo: {
    user: (parent, args, context, info) => 
      getAllUsers().then(users => users.find(u => u.id == parent.user_id)),
  },
  User: {
    todos: (parent, args, context, info) => 
      getAllTodos().then(todos => todos.filter(t => t.user_id == parent.id)),
  },
  Mutation: {
    addTodo: (parent, args, context, info) => createOneTodo(args.title, args.user_id),
    deleteTodo: (parent, args, context, info) => deleteOneTodo(args.id),
    editTodo: (parent, args, context, info) => updateOneTodo(args.id, args.title, args.completed, args.user_id),
    addUser: (parent, args, context, info) => createOneUser(args.name, args.email, args.login),
    deleteUser: (parent, args, context, info) => deleteOneUser(args.id),
    editUser: (parent, args, context, info) => updateOneUser(args.id, args.name, args.email, args.login),
  }
 } 

const schema = createSchema({
  typeDefs:  fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8'),
  resolvers: resolvers,
})

exports.schema = schema