const Nonsensical = require("./nonsensical");
const nonsensical = new Nonsensical();
global.window = {
	fetch: (path) => {
		return new Promise(function (resolve, reject) {
			require("fs").readFile(path, "utf8", function (err, data) {
				if (err) {
					reject(err);
				} else {
					resolve({
						json: () => JSON.parse(data)
					});
				}
			});
		})
	}
};
const data_file_paths = {
	noun: './data/noun.json',
	adverb: './data/adverb.json',
	adjective: './data/adjective.json',
	verb: './data/verb.json',
};
nonsensical.load(data_file_paths, function () {
	console.log(nonsensical.generateSentence());
});
