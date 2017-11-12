const Nonsensical = require("./nonsensical");
const nonsensical = new Nonsensical();

const output_el = document.getElementById("output");
const another_one_button = document.getElementById("another-one");
// const previous_one_button = document.getElementById("previous-one");

const data_file_paths = {
	noun: './data/noun.json',
	adverb: './data/adverb.json',
	adjective: './data/adjective.json',
	verb: './data/verb.json',
};
nonsensical.load(data_file_paths, function(){
	const another_one = () => {
		location.hash = nonsensical.generateSentence();
	};
	const render_from_hash = () => {
		output_el.textContent = decodeURIComponent(location.hash.replace("#", ""));
	};

	if (location.hash.length <= 1) {
		another_one();
	}

	window.onhashchange = render_from_hash;
	render_from_hash();

	another_one_button.onclick = another_one;

	// previous_one_button.onclick = ()=> {
	// 	history.back();
	// };
});