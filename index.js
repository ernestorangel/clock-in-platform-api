const restify = require('restify');
const mainController = require('./src/controllers/mainController');

const server = restify.createServer({
  name: 'meuServer'
});

server.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  }
);
server.use(restify.plugins.queryParser());

server.get("/clockin", mainController.clockin); // CREATE 
server.get("/bank", mainController.listAll); // READ 
server.get("/edit", mainController.edit); // UPDATE
server.get("/delete", mainController.delete) // DELETE

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});