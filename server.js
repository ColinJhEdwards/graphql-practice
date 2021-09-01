const express = require("express");
const app = express();
const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require("graphql");
const { graphqlHTTP } = require("express-graphql");

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "HelloWorld",
    fields: () => ({
      message: {
        type: GraphQLString,
        resolve: () => "Hello World",
      },
    }),
  }),
});

//setting up graphql
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    //allows the use of graphiql which is an in browser tool for testing queries
    graphiql: true,
  })
);

// Set up server to listen on port 5000
app.listen(5000, () => console.log("Server is running"));
