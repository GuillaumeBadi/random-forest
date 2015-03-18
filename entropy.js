// - ∑ (P(i) * log2 (P(i))

var entropies = [];

class informationGain {
	constructor (dataset, targetAttr) {
		// p = tableau de proba
		// attr = tableau d'attr
		// entropies = []
		//
	}

	// return the entropy before the split
	// p: probability tab (1/5, 3/5, 1/5)...
	entropyBefore () {
		let sum = 0;
		for (let i; i < p.length; i++) {
			sum -= p[i] * Math.log2(p[i])
		}
		return (sum);
	}

	computeAverage () {

	}

	processChild (attr) {
		var possibles = this.getAllAttr();
		var freq = {};
		for (var i = 0; i < possibles[targetAttr].length; i++) {
			freq[possibles[targetAttr][i]][attr] = this.computeAverage(possibles[targetAttr][i], attr);

		}
	}

	entropyAll () {
		for (let attr in this.attributes) {
			this.processChild(attr);
		}
	}
}
