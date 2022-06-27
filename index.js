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

server.get("/bank/:company/:employee", mainController.listAll);

server.get("/overdue/:company/:employee",mainController.listOverdue);

server.get("/clockin", mainController.clockin);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});