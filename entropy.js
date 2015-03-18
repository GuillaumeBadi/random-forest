// - ∑ (P(i) * log2 (P(i))

var entropies = [];

class informationGain {
	constructor (dataset, targetAttr) {
		// p = tableau de proba
		// attr = tableau d'attr
		// entropies = []
		//
		this.possibles = this.getAllAttr();
		this.frequencies = {};
	}

	// return the entropy before the split
	// p: probability tab (1/5, 3/5, 1/5)...
	entropy (p) {
		var sum = 0;
		for (var i; i < p.length; i++) {
			sum -= p[i] * Math.log2(p[i])
		}
		return (sum);
	}

	getFrequencies (newDataset) {
		var proba = [];
		var freqs = {}

		for (var humor in this.possibles[targetAttr]) {
			freqs[humor] = 0;
			for (var i = 0; i < newDataset.length; i++) {
				if (newDataset[i][targetAttr] == humor) freqs[humor]++;
			}
			proba.push(freqs[humor] / newDataset.length);
		}
	}

	processAttr (attr) {
		var res = [];
		var newDataset = {};
		var list = this.possibles[attr];

		for (var i = 0; i < list.length; i++) {
			for (var index = 0; index < dataset.length; index++) {
				if (dataset[index][attr] === i) {
					newDataset[i] = dataset[index];
				}
			}
		};
		for (var key in newDataset) {
			var propa = [];
			proba = this.getFrequencies(newDataset[key]);
			res.push(this.entropy(proba));
		}

	}

	entropyAll () {
		var allEntropy = {};

		for (var attr in this.attributes) {
			if (attr !== this.targetAttr) allEntropy[attr] = this.processAttr(attr);
		}
	}
}





	// processChild (attr) {
	// 	var res = [];
	// 	var list = dataset[attr];

	// 	// ici on parcour chaque possibilite de attr
	// 	for (var i in this.possibles[attr]) {
	// 		var count = 0;

	// 		//ici on parcour chaque ligne de dataset correspondant a i
	// 		for (var cursor = 0; cursor < dataset.length; cursor++) {
	// 			//si la ligne de dataset[attr] = attr[i] on augmente count
	// 			if (dataset[cursor][attr][i] === this.possibles[attr][i]) count++;
	// 		}
	// 		//ici on enregistre la frequence
	// 		// this.frequencies[this.possibles[attr]] = count;
	// 		res.push(count / dataset.length);
	// 	}
	// 	console.log(res);
	// 	return (this.entropy(res));
	// }
