var cluster		= require('cluster'),
	app			= require('koa')(),
	numCPUs		= require('os').cpus().length;

data2 = [
	{outlook: "nuageux",	temperature: "23", 	jour: "lundi", 		position: "travail", 	heure: "22", humeur: "content"},
	{outlook: "nuageux",	temperature: "15", 	jour: "vendredi", 	position: "maison", 	heure: "17", humeur: "vraiment pas terrible"},
	{outlook: "soleil",		temperature: "35", 	jour: "samedi",		position: "ecole", 		heure: "16", humeur: "moyen"},
	{outlook: "soleil",		temperature: "32", 	jour: "lundi", 		position: "travail", 	heure: "14", humeur: "moyen"},
	{outlook: "nuageux",	temperature: "6", 	jour: "jeudi", 		position: "travail", 	heure: "13", humeur: "pas content"},
	{outlook: "neige",		temperature: "-4", 	jour: "samedi", 	position: "ecole", 		heure: "11", humeur: "pas terrible"},
	{outlook: "soleil",		temperature: "-6", 	jour: "mercredi", 	position: "ecole", 		heure: "09", humeur: "pas content"},
	{outlook: "orage",		temperature: "12", 	jour: "mardi", 		position: "travail", 	heure: "12", humeur: "content"},
	{outlook: "pluie", 		temperature: "5", 	jour: "dimanche", 	position: "paris", 		heure: "18", humeur: "super content"},
	{outlook: "pluie", 		temperature: "23", 	jour: "dimanche", 	position: "paris", 		heure: "13", humeur: "super content"},
	{outlook: "nuageux", 	temperature: "4", 	jour: "samedi", 	position: "lorraine", 	heure: "15", humeur: "content"},
	{outlook: "orage", 		temperature: "8", 	jour: "dimanche", 	position: "lorraine", 	heure: "08", humeur: "content"},
	{outlook: "pluie", 		temperature: "23", 	jour: "mercredi", 	position: "maison", 	heure: "12", humeur: "moyen"}
]

perso = [
	{name: "ashley", "ev": 1, "nv": 3, length: 6, g: "f"}, //
	{name: "brian", "ev": 0, "nv": 2, length: 5, g: "m"},
	{name: "Caroline", "ev": 1, "nv": 4, length: 8, g: "f"}, //
	{name: "david", "ev": 0, "nv": 3, length: 5, g: "m"},
	{name: "norih", "ev": 0, "nv": 2, length: 5, g: "m"},
	{name: "guillaume", "ev": 1, "nv": 4, length: 9, g: "m"},
	{name: "christian", "ev": 0, "nv": 3, length: 9, g: "m"},
	{name: "totot", "ev": 0, "nv": 2, length: 5, g: "m"},
	{name: "meganne", "ev": 1, "nv": 3, length: 7, g: "f"},
	{name: "lolat", "ev": 0, "nv": 2, length: 5, g: "f"},
	{name: "thor", "ev": 0, "nv": 1, length: 4, g: "m"},
	{name: "justinino", "ev": 1, "nv": 4, length: 9, g: "m"},
	{name: "pierre", "ev": 1, "nv": 3, length: 6, g: "f"},
	{name: "theo", "ev": 1, "nv": 2, length: 4, g: "m"}
]

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

var informationGain = function(dataset, targetAttr) {

	this.dataset 	= dataset,
	this.targetAttr = targetAttr;

	this.getAllAttr = function () {
		var attr = {};
		for (var i in this.dataset[0]) {
			attr[i] = [];
		}
		var isPresent;

		for (var j in attr) {
			for (var index = 0; index < this.dataset.length; index++) {
				isPresent = 0;
				for (var index2 = 0; index2 < attr[j].length; index2++) {
					if (attr[j][index2] === this.dataset[index][j]) {
						isPresent = 1;
						break ;
					}
				}
				if (isPresent !== 1) attr[j].push(this.dataset[index][j]);
			}
		}
		return attr;
	}

	this.possibles = this.getAllAttr();

	this.createChild = function (target, attr) { // cette fonction va compter le nombre d'attr qui correspondent a la class
		var res = [];

		for (var i = 0; i < dataset.length; i++) {
			if (dataset[i][attr] === target) res.push(dataset[i]);
		}
		return res;
	}

	this.countChildArg = function (child) {
		var list 	= this.possibles[targetAttr],
			res		= {};

		for (var i = 0; i < list.length; i++) {
			var count = 0;
			for (var index = 0; index < child.length; index++) {
				if (child[index][targetAttr] === list[i]) count++;
			}
			res[list[i]] = count;
		}
		return res;
	}

	this.computeEntropyBefore = function (node) {
		var sum = 0;

		for (var key in node) {
			if (node[key] > dataset.length) throw new Error("fucking division");
			sum -= node[key] ? node[key] / dataset.length * Math.log2(node[key] / dataset.length) : 0;
			console.log (node[key], "/", dataset.length, "*", Math.log2(node[key] / dataset.length), " = ", node[key] ? node[key] / dataset.length * Math.log2(node[key] / dataset.length) : 0);
			console.log ("sum = " + sum);
		}
		return sum;
	}

	this.computeEntropyChild = function (node) {
		var sum = 0,
			len	= 0;

		for (var key in node) len += node[key];
		for (var key in node) {
			sum -= node[key] ? node[key] / len *Math.log2(node[key] / len) : 0;
		}
		return sum;
	}

	this.computeEntropyAfter = function (children, payload) {
		var sum = 0;

		var i = 0;
		for (var child in children) {
			var sub = 0;

			for (var key in children[child]) sub += children[child][key];
			sum += sub / dataset.length * payload[i];
			i++;
		}
		return sum;
	}

	this.processAttr = function(attr) {
		var res 			= [],
			parentDivsion	= {},
			firstDivison 	= {},
			childDivision	= {},
			list 			= this.possibles[attr]; //sa c'est // outlook = []

		for (var i = 0; i < this.possibles[targetAttr].length; i++) {
			var count = 0;

			for (var index = 0; index < dataset.length; index++) {
				if (dataset[index][targetAttr] === this.possibles[targetAttr][i]) count++;
			}
			parentDivsion[this.possibles[targetAttr][i]] = count;
		}
		for (var i = 0; i < list.length; i++) {
			firstDivison[list[i]] = this.createChild(list[i], attr); // pluie, outlook
		}
		for (var i = 0; i < list.length; i++) {
			childDivision[list[i]] = this.countChildArg(firstDivison[list[i]]);
		}
		var entropyBefore = this.computeEntropyBefore(parentDivsion);
		for (var key in childDivision) {
			res.push(this.computeEntropyChild(childDivision[key]));
		}
		var entropyAfter = this.computeEntropyAfter(childDivision, res);

		return entropyBefore - entropyAfter;
	}

	this.entropyAll = function () {
		var allEntropy = {};

		for (var attr in this.possibles) {
			if (attr !== this.targetAttr) allEntropy[attr] = this.processAttr(attr);
		}
		return allEntropy;
	}
}

if (cluster.isMaster) {

	for(var i = 0; i < numCPUs; i++) {cluster.fork();}
	cluster.on('exit', function(worker, code, signal) {
		console.log ("died");
	});

} else {
	app.use(function* () {
		var test = new informationGain(data2, "humeur");
		// var test = new informationGain(perso, "g");
		var tres = test.entropyAll();
		this.body = tres;
	}).listen(3000);
}
