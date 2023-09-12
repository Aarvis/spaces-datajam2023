// const { createSchema, createYoga } = require("graphql-yoga");
// const { createServer } = require("node:http");
const { GraphQLServer } = require("graphql-yoga");
// const { typeDefs } = require("./schema");
const { resolvers } = require("./resolver.js");

const port = process.env.PORT || 3000;

const server = new GraphQLServer({ 
  typeDefs:"schema.graphql", 
  resolvers, 
  context: (req) =>({ req: req.request }) });

  
server.start(
	{
		tracing: false,
		uploads: {
			maxFileSize: 10000000,
		},
		port: process.env.PORT || 9090,
	},
	({ port }) => {
		console.log(`Server is running on http://localhost:${port}`);
	}
);


// const yoga = createYoga({
//   schema: createSchema({
//     typeDefs,
//     resolvers,
//     context: ({ req }) => ({ req }),
//   }),
// });

// const server = createServer(yoga);

// server.listen(port, () => {
//   console.info(`Server is running on http://localhost:${port}/graphql`);
// });
