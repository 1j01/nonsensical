const Nonsensical = require("./nonsensical");
const nonsensical = new Nonsensical();

const loading_indicator = document.getElementById("loading-indicator");
const output_container = document.getElementById("output");
const another_one_button = document.getElementById("another-one");
// const previous_one_button = document.getElementById("previous-one");

const data_file_paths = {
	noun: './data/noun.json',
	adverb: './data/adverb.json',
	adjective: './data/adjective.json',
	verb: './data/verb.json',
};

loading_indicator.removeAttribute("hidden");
nonsensical.load(data_file_paths, function(){
	loading_indicator.setAttribute("hidden", "hidden");

	const output_el = document.createElement("p");
	output_container.appendChild(output_el);

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
