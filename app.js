var cluster		= require('cluster'),
	app			= require('koa')(),
	numCPUs		= require('os').cpus().length;

if (cluster.isMaster) {

	for(var i = 0; i < numCPUs; i++) {cluster.fork();}
	cluster.on('exit', function(worker, code, signal) {
		console.log('worker' + worker.process.pid + ' died.');
	});

} else {
	app.use(function* () {
		this.body = "Hello World";
	}).listen(3000);
}
