var cluster		= require('cluster'),
	app			= require('koa')(),
	numCPUs		= require('os').cpus().length;

data2 = [
	{outlook: "nuageux", temperature: "23", jour: "lundi", position: "travail", heure: "22", humeur: "content"},
	{outlook: "nuageux", temperature: "15", jour: "vendredi", position: "maison", heure: "17", humeur: "vraiment pas terrible"},
	{outlook: "soleil", temperature: "35", jour: "samedi", position: "ecole", heure: "16", humeur: "moyen"},
	{outlook: "soleil", temperature: "32", jour: "lundi", position: "travail", heure: "14", humeur: "moyen"},
	{outlook: "nuageux", temperature: "6", jour: "jeudi", position: "travail", heure: "13", humeur: "pas content"},
	{outlook: "neige", temperature: "-4", jour: "samedi", position: "ecole", heure: "11", humeur: "pas terrible"},
	{outlook: "soleil", temperature: "-6", jour: "mercredi", position: "ecole", heure: "09", humeur: "pas content"},
	{outlook: "orage", temperature: "12", jour: "mardi", position: "travail", heure: "12", humeur: "content"},
	{outlook: "pluie", temperature: "5", jour: "dimanche", position: "paris", heure: "18", humeur: "super content"},
	{outlook: "pluie", temperature: "23", jour: "dimanche", position: "paris", heure: "13", humeur: "super content"},
	{outlook: "nuageux", temperature: "4", jour: "samedi", position: "lorraine", heure: "15", humeur: "content"},
	{outlook: "orage", temperature: "8", jour: "dimanche", position: "lorraine", heure: "08", humeur: "content"},
	{outlook: "pluie", temperature: "23", jour: "mercredi", position: "maison", heure: "12", humeur: "moyen"}
]

var getAllAttr = function(dataset) {
	var attr = {};
	for (var i in dataset[0]) {
		attr[i] = [];
	}
	var isPresent;

	for (var j in attr) {
		for (var index = 0; index < dataset.length; index++) {
			isPresent = 0;
			for (var index2 = 0; index2 < attr[j].length; index2++) {
				if (attr[j][index2] === dataset[index][j]) {
					isPresent = 1;
					break ;
				}
			}
			if (isPresent !== 1) attr[j].push(dataset[index][j]);
		}
	}
	return attr;
}

if (cluster.isMaster) {

	for(var i = 0; i < numCPUs; i++) {cluster.fork();}
	cluster.on('exit', function(worker, code, signal) {
		console.log('worker' + worker.process.pid + ' died.');
	});

} else {
	app.use(function* () {
		this.body = getAllAttr(data2);
	}).listen(3000);
}
