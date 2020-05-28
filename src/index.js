const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config()


const port = process.env.PORT || process.env.SERVER_PORT;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



// assim todos os controler que criarmos em nosso projeto são adicionados automaticamente ao nosso projeto
require('./app/controllers/index.js')(app);
// substituo esses controler por uma chamada unica, que esta acima.
// require('./app/controllers/authController')(app);
// require('./app/controllers/projectsController')(app);

app. listen(port);
console.log('server ok')