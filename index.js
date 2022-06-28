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

server.get("/bank", mainController.listAll); // READ (ALL)

server.get("/edit", mainController.edit); // UPDATE (ONE)

server.get("/delete", mainController.delete) // DELETE (ONE)

server.get("/clockin", mainController.clockin); // CREATE (ONE)

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});