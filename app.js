const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

// bind express with graphql
app.use('/graphql', graphqlHTTP({
    // pass in a schema property
    schema,
    // use graphiql tool
    graphiql: true
}));

app.listen(4123, () => {
    console.log('now listening for requests on port 4000');
});
