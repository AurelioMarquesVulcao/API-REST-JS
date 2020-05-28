const fs = require('fs');
const path = require('path');


// assim todos os controler que criarmos em nosso projeto são adicionados automaticamente ao nosso projeto
module.exports = app => {
    fs
    .readdirSync(__dirname)
    .filter(file =>((file.indexOf('.')) !== 0 && (file !== "index.js")))
    .forEach(file => require(path.resolve(__dirname, file))(app));
};