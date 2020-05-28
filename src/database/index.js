const mongoose = require('mongoose');
require('dotenv').config()


// process.env.ACCESS_DB


mongoose.connect(process.env.ACCESS_DB, { 
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
});
// mongoose.connect(process.env.ACCESS_DB, { useNewUrlParser: true });
// mongoose.connect(process.env.ACCESS_DB, { useMongoClient: true });
mongoose.Promise = global.Promise;

module.exports = mongoose;