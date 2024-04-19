const { createServer } = require('http')
const { createYoga } = require('graphql-yoga')
const schema = require('./schema')
 
// Create a Yoga instance with a GraphQL schema.
const yoga = createYoga(schema)

// Pass it into a server to hook into request handlers.
const server = createServer(yoga)
 
// Start the server and you're done!
server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})