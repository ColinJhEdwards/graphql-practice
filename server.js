const express = require("express");
const app = express();
const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require("graphql");
const { graphqlHTTP } = require("express-graphql");

const authors = [
  { id: 1, name: "Brandon Sanderson" },
  { id: 2, name: "Patrick Rothfuss" },
  { id: 3, name: "Amor Towles" },
];

const books = [
  { id: 1, name: "The Way of Kings", authorId: 1 },
  { id: 2, name: "Words Of Radiance", authorId: 1 },
  { id: 3, name: "Oathbringer", authorId: 1 },
  { id: 4, name: "Name of The Wind", authorId: 2 },
  { id: 5, name: "A Wise Mans Fear", authorId: 2 },
  { id: 6, name: "A Gentleman in Moscow", authorId: 3 },
];

//schema defines the query section
const schema = new GraphQLSchema({
  //query defines the cases for our queries, in this case helloworld
  query: new GraphQLObjectType({
    name: "HelloWorld",
    //fields are all the different sections of the object we can query, in this case "message" which is a string that says hello world
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
