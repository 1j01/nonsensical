const Nonsensical = require("./nonsensical");
const nonsensical = new Nonsensical();

const loading_indicator = document.getElementById("loading-indicator");
const output_container = document.getElementById("output");
const another_one_button = document.getElementById("another-one");
// const previous_one_button = document.getElementById("previous-one");
const toggle_config_button = document.getElementById("toggle-config");
const config_container = document.getElementById("config");
const nouns_input = document.getElementById("nouns");
const verbs_input = document.getElementById("verbs");
// const adjectives_input = document.getElementById("adjectives");
// const presets_select = document.getElementById("presets");
// const use_suggestion_chance_slider = document.getElementById("use-suggestion-chance");

const data_file_paths = {
	noun: './data/noun.json',
	adverb: './data/adverb.json',
	adjective: './data/adjective.json',
	verb: './data/verb.json',
};

toggle_config_button.onclick = () => {
	// if (config_container.hasAttribute("hidden")) {
	// 	config_container.removeAttribute("hidden");
	// } else {
	// 	config_container.setAttribute("hidden", "hidden");
	// }

	// config_container.style.flexBasis = config_container.clientHeight + "px";
	// config_container.classList.toggle("hidden");
	// config_container.style.flexBasis = "";

	
	if(config_container.classList.contains("hidden")){
		config_container.style.height = "0px";
		// config_container.style.flexBasis = "0.001px";
		config_container.classList.remove("hidden");
		// config_container.style.flexBasis = config_container.scrollHeight + "px";
		config_container.style.height = config_container.scrollHeight + "px";
	}else{
		config_container.classList.add("hidden");
		// config_container.style.flexBasis = "0.001px";
		config_container.style.height = "0px";
	}
};

const split_words = (input_text) => input_text.split(/[,\s]\s*/);

loading_indicator.removeAttribute("hidden");
nonsensical.load(data_file_paths, function () {
	loading_indicator.setAttribute("hidden", "hidden");

	const output_el = document.createElement("p");
	output_container.appendChild(output_el);

	const another_one = () => {
		location.hash = nonsensical.generateSentence({
			wordSuggestions: {
				nouns: split_words(nouns_input.value),
				verbs: split_words(verbs_input.value),
				// adjectives: split_words(adjectives_input.value),
			},
			useSuggestionRelatedWordChance: 1 / 2,//parseFloat(use_suggestion_chance_slider.value) / 100,
			maxSemanticStepsRemovedFromSuggestions: 5
		});
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
