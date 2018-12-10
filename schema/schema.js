const graphql = require('graphql');
const { find } = require('lodash');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList } = graphql;

// dummy data
var books = [
    { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId:'1' },
    { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId:'1' },
    { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId:'2' },
];

var authors = [
    { name: 'Patrick Rothfuss', age: 44, id: '1' },
    { name: 'Brandon Sanderson', age: 42, id: '2' },
    { name: 'Terry Pratchett', age: 66, id: '3' }
];

// Define an Object type
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return find(authors, { id: parent.authorId });
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return _.filter(books, { authorId: parent.id });
            }
        }
    })
});

// root query is the entry point to the graph
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        // name of query : value
        book: {
            type: BookType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {

                // code to get data from db/other sources
                return find(books, {id: args.id});
            }
        },
        author: {
            type: AuthorType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                // code to get data from db/other sources
                return find(authors, {id: args.id});
            }
        }
    }
});

// The queries that is exposed to the front end clients
module.exports = new GraphQLSchema({
    query: RootQuery
});
