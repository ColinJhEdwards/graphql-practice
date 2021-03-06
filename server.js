const express = require("express");
const app = express();
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");
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

//the new objectype 'descripes' how a book is represented, in this case a book would have an id, name, and author id. All specified to a string or num, etc
const BookType = new GraphQLObjectType({
  name: "book",
  description: "This represents a book written by an author",
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    authorId: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve: (book) => {
        return authors.find((author) => author.id === book.authorId);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "author",
  description: "this represents all the authors",
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    books: {
      type: GraphQLList(BookType),
      resolve: (author) => {
        return books.filter((book) => book.id === author.id);
      },
    },
  }),
});

//the root query will be placed in the schema, and represents the different type of fields and their content, in this case books and authors
//you must create a new object type and declare a name and description followed by the fields
// alot of graphQL is typing our your objects
const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    book: {
      type: BookType,
      description: "Single Book",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => books.find((book) => book.id === args.id),
    },
    books: {
      type: new GraphQLList(BookType),
      description: "List of All Books",
      resolve: () => books,
    },
    author: {
      type: AuthorType,
      description: "single author",
      args: { id: { type: GraphQLInt } },
      resolve: (parent, args) =>
        authors.find((author) => author.id === args.id),
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "list of authors",
      resolve: () => authors,
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addBook: {
      type: BookType,
      description: "add a book",
      args: {
        name: { type: GraphQLString },
        authorId: { type: GraphQLInt },
      },
      resolve: (parents, args) => {
        const book = {
          id: books.length + 1,
          name: args.name,
          authorId: args.authorid,
        };
        books.push(book);
        return book;
      },
    },
    addAuthor: {
      type: AuthorType,
      description: "add an author",
      args: {
        name: { type: GraphQLString },
      },
      resolve: (parents, args) => {
        const author = {
          id: author.length + 1,
          name: args.name,
        };
        authors.push(author);
        return author;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
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

// the basics
// //schema defines the query section
// const schema = new GraphQLSchema({
//   //query defines the cases for our queries, in this case helloworld
//   query: new GraphQLObjectType({
//     name: "HelloWorld",
//     //fields are all the different sections of the object we can query, in this case "message" which is a string that says hello world
//     fields: () => ({
//       message: {
//         type: GraphQLString,
//         resolve: () => "Hello World",
//       },
//     }),
//   }),
// });
