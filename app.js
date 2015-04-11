/*
var cluster		= require('cluster'),
	app			= require('koa')(),
	numCPUs		= require('os').cpus().length;
*/
var _ = require ("underscore");
var async = require ("async");

var log = Math.log2 || Math.log

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
	{name: "ashley",	"ev": 1, "nv": 3, length: 6, g: "f"},
	{name: "brian",		"ev": 0, "nv": 2, length: 5, g: "m"},
	{name: "Caroline",	"ev": 1, "nv": 4, length: 8, g: "f"},
	{name: "david",		"ev": 0, "nv": 3, length: 5, g: "m"},
	{name: "norih",		"ev": 0, "nv": 2, length: 5, g: "m"},
	{name: "guillaume",	"ev": 1, "nv": 4, length: 9, g: "m"},
	{name: "christian",	"ev": 0, "nv": 3, length: 9, g: "m"},
	{name: "totot",		"ev": 0, "nv": 2, length: 5, g: "m"},
	{name: "meganne",	"ev": 1, "nv": 3, length: 7, g: "f"},
	{name: "lolat",		"ev": 0, "nv": 2, length: 5, g: "f"},
	{name: "thor",		"ev": 0, "nv": 1, length: 4, g: "m"},
	{name: "justinino",	"ev": 1, "nv": 4, length: 9, g: "m"},
	{name: "pierre",	"ev": 1, "nv": 3, length: 6, g: "f"},
	{name: "theo",		"ev": 1, "nv": 2, length: 4, g: "m"}
]

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
			sum -= node[key] ? node[key] / dataset.length * log(node[key] / dataset.length) : 0;
		}
		return sum;
	}

	this.computeEntropyChild = function (node) {
		var sum = 0,
			len	= 0;

		for (var key in node) len += node[key];
		for (var key in node) {
			sum -= node[key] ? node[key] / len * log(node[key] / len) : 0;
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

	this.gains = function () {
		var allEntropy = {};

		for (var attr in this.possibles) {
			if (attr !== this.targetAttr) allEntropy[attr] = this.processAttr(attr);
		}
		return allEntropy;
	}
}


function ID3 (dataset, targetAttr, exception) {
	this.dataset = dataset;
	this.info = new informationGain(dataset, targetAttr);
	this.branches = [];
	this.exception = (exception === undefined) ? [] : exception;

	if (targetAttr === undefined) console.log (dataset);

	var self = this;
	this.bestAttr = (function () {
		var gains = self.info.gains();

		var max = 0;
		var at = "";
		async.forEach(Object.keys(gains), function (key, done) {
			if (gains[key] > max && self.exception.indexOf(key) == -1) {
				max = gains[key];
				at = key;
			}
			done(0);
		}, function (err) {
			self.exception.push(at);
		});
		return at;
	})();

	var self = this;
	this.split = function () {
		// We get all the possible values for the given best attribute to split our data
		var possibles = this.info.getAllAttr()[this.bestAttr];
		this.children = [];
		self.leaf = true;

		async.forEach(self.dataset, function (data, doneCheck) {
			// We loop through our dataset to make sure they do not belong to the same class
			// i.e. They are not terminal
			// if some are happy and some are not, this is not a leaf node
			if (data[targetAttr] != self.dataset[0][targetAttr])
				self.leaf = false;
			doneCheck();
		}, function (err) {
			if (err) console.log (err);

			// If we do not deal with a leaf node
			if (self.leaf === false) {
				async.forEach(possibles, function (possible, callback) {
					// we iterate through all the possible values of
					// our best attribute
					// and we create an empty array in our children array to store the data
					// that match the possible value
					// i.e. if we choose to split outcast, there will be one array to store the rain data
					// one array to store the sunny data etc
					self.children.push([]);
					async.forEach(self.dataset, function (data, dataDone) {
						// for each line in our dataset,
						// if it match the current possible value, we store it in the last array of the children array
						if (possible === data[self.bestAttr])
							self.children[self.children.length - 1].push (data);
						dataDone(0, data);
					}, function (err, data) {
						if (err) console.log (err);
					});
					callback();
				}, function (err) {
					// Now we got an array of dataset groups
					// we want to create new branches out of it
					async.forEach(self.children, function (child, doneBranch) {
						// So for each child array in children,
						// we create a new branch with the matching dataset
						// and we split it the same way
						var branch = new ID3(child, targetAttr, self.exception);
						branch.split();
						self.branches.push(branch);
						doneBranch();
					}, function (err) {
						if (err) console.log (err);
					});
				});
			}
		});
	}

	this.predict = function (data) {
		var self = this;
		if (this.leaf) {
			// if we deal with a terminal node,
			// return the value of the targetAttri class (happy, bad...)
			self.prediction = this.dataset[0][targetAttr];
		} else {
			async.map(this.branches, function (branch, done) {
				// else we create an array
				// that will contains either 0 or the prediction of the matching branch
				// of the tree
				// data = [0,0,0,rainy,0,0,0]
				if (data[self.bestAttr] === branch.dataset[0][self.bestAttr])	
					return done(0, branch.predict(data));
				done(0, 0);
			}, function (err, data) {
				async.forEach(data, function (d, done) {
					// Now we look for the only element of the array that is not a 0
					// and we return it
					if (d !== 0) self.prediction = d;
					done();
				}, function (err) {
					if (err) console.log (err);
				});
			});
		}
		return self.prediction;
	}

}

(function main () {
	var tree = new ID3(perso, "g");
	tree.split();
	console.log (tree.predict({name: "reynald",	"ev": 0, "nv": 2, length: 7}));
})();
