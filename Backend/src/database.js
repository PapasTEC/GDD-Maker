const mongoose = require('mongoose');

const URI = 'mongodb://admin-proyectois:proyectoi5@150.136.169.6:27017?tls=false';

function connectDB() {
    mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "GDD" } )
        .then(db => console.log(`Mongo database is connected from ${db.connection.host}:${db.connection.port}`, ))
        .catch(err => console.error(err));
}

module.exports = { connectDB };