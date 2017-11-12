const Wordnet = require("wordnetjs");
const pluralize = require("pluralize");

const tensify = require("./tensify");

const { choose, uppercase_first, get_indefinite_article } = require("./helpers");
const { TAG, NUMBER, TENSE } = require("./part-of-speech-enums");
const Token = require("./Token");


// some foobular words
const VERBZ = ["parse", "output", "retain", "generate", "put", "display", "render", "upload", "consume", "transcend", "assemble", "scromble", "scronch", "become"];
const NOUNZ = ["noun", "verb", "output", "code", "graphic", "computer", "text", "orang", "meme man", "vegetal", "cube", "dimension", "hypercube", "pillar", "space", "time", "reality", "entity", "void"];
const ADJZ = ["amazing", "boring", "nonsensical", "silly", "lame", "orange", "aesthetic", "surreal", "hyperdimensional", "human"];
const ADPZ = ["in", "in", "in", "on", "of"];
const DETZ_PLURAL = ["some", "some", "those", "those", "the"]; // could include informal "them"/"dem"/"'em"
const DETZ_SINGULAR = ["a", "an", "the"];

// @HACK @XXX
// @TODO make things class methods instead or whatever
let wordnet;

// function take_one_step_away_semantically() {

// }

// const TAG_to_WordNet_POS = {
// 	[TAG.NOUN]: "noun",
// 	[TAG.VERB]: "verb",
// 	[TAG.ADV]: "adverb",
// 	[TAG.ADJ]: "adjective"
// };

function find_a_word(part_of_speech, search_base_terms, semantic_removal_depth=0) {
	// const part_of_speech = TAG_to_WordNet_POS[tag];
	let tries = 0;
	const max_tries = 5;
	const max_semantic_removal_depth = 2;
	for(let i=0;i<max_tries;i++){
		let search_base = choose(search_base_terms);
		let results = wordnet.lookup(search_base, part_of_speech);
		// console.log(results);
		if(results.length > 0){
			let result = choose(results);
			let word = choose(result.words);
			// TODO: maybe flatten this and do a random number of semantic removals (including zero)
			if(Math.random() < 0.5 && semantic_removal_depth < max_semantic_removal_depth){
				return find_a_word(part_of_speech, [word], semantic_removal_depth + 1);
			}
			return word;
		}
	}
	return choose(NOUNZ);
}

function make_noun() {
	const noun = new Token({ partOfSpeech: { tag: TAG.NOUN } });
	noun.lemma = find_a_word("noun", NOUNZ);
	noun.partOfSpeech.number = choose([NUMBER.PLURAL, NUMBER.SINGULAR])
	if (noun.partOfSpeech.number === NUMBER.PLURAL || noun.partOfSpeech.number === NUMBER.DUAL) {
		noun.text = pluralize.plural(noun.lemma);
	} else {
		noun.text = pluralize.singular(noun.lemma);
	}
	return noun;
};

function make_spicy_noun() {
	const noun = make_noun();
	const initial_noun_text = stringify_tokens_array(make_flat_tokens_array_from_structure(noun));
	const determiner = new Token({ partOfSpeech: { tag: TAG.DET } });
	noun.addDependency(determiner, "det");
	if (noun.partOfSpeech.number === NUMBER.PLURAL) {
		determiner.text = choose(DETZ_PLURAL);
		// console.log(`using plural determiner: \`${stringify_tokens_array(make_flat_tokens_array_from_structure(noun))}\` for`, noun);
	} else {
		// determiner.text = choose(DETZ_SINGULAR);
		if (Math.random() < 0.5) {
			determiner.text = get_indefinite_article(initial_noun_text);
		} else {
			determiner.text = "the";
		}
		// console.log(`using singular determiner: \`${stringify_tokens_array(make_flat_tokens_array_from_structure(noun))}\` for`, noun);
	}
	return noun;
};

function make_adpositional_phrase() {
	const preposition = new Token({ partOfSpeech: { tag: TAG.ADP } });
	const preposition_object_noun = make_spicy_noun();
	preposition.lemma = choose(ADPZ);
	preposition.addDependency(preposition_object_noun, "pobj");
	return preposition;
};

function make_verb() {
	const verb = new Token({ partOfSpeech: { tag: TAG.VERB } });
	verb.lemma = find_a_word("verb", VERBZ);
	if (Math.random() < 0.5) {
		verb.text = tensify(verb.lemma).past;
		// console.log(token.lemma, irregular(verb.lemma));
		// verb.text = irregular(verb.lemma).PP;
		verb.partOfSpeech.tense = TENSE.PAST;
	}
	return verb;
};

function make_structure() {
	const root_verb = make_verb();
	root_verb.label = "root";
	const ending_punctuation = new Token({ partOfSpeech: { tag: TAG.PUNCT }, text: "." });
	root_verb.addDependency(make_spicy_noun(), "nsubj");
	root_verb.addDependency(make_spicy_noun(), "nobj");
	root_verb.addDependency(make_adpositional_phrase(), "prep");
	root_verb.addDependency(ending_punctuation, "p");
	return root_verb;
};

function make_flat_tokens_array_from_structure(token) {
	let tokens = [token];
	for (let dep_token of token.dependencies) {
		const dep_flattened_tokens = make_flat_tokens_array_from_structure(dep_token);
		const dep_tag = dep_token.partOfSpeech.tag;
		const parent_tag = token.partOfSpeech.tag;
		// console.log(`what order for ${parent_tag} (\`${stringify_tokens_array(tokens)}\`) and dep ${dep_tag} (\`${stringify_tokens_array(dep_flattened_tokens)}\`)?`, token, dep_token); 
		let dep_after;
		if (dep_tag === TAG.PUNCT || dep_tag === TAG.X) {
			dep_after = true;
		} else if (parent_tag === TAG.ADP) {
			dep_after = false;
		} else {
			dep_after = (dep_tag === TAG.NOUN && dep_token.label === "nobj");
		}
		// TODO: don't forget some Math.random() < 0.5
		if (dep_after) {
			tokens = [...tokens, ...dep_flattened_tokens];
		} else {
			tokens = [...dep_flattened_tokens, ...tokens];
		}
		// console.log(`going with ${dep_after ? "dep after" : "dep before"}  (\`${stringify_tokens_array(tokens)}\`)`);
	}
	return tokens;
};

function stringify_tokens_array(tokens) {
	let text = "";
	for (let index = 0; index < tokens.length; index++) {
		const token = tokens[index];
		const token_text = token.text != null ? token.text : token.lemma;
		if (!token_text) {
			console.error("Token has no text or lemma", token);
		}
		if ((index > 0) && (token.partOfSpeech.tag !== TAG.PUNCT) && (!token_text[0].match(/'’/))) {
			text += " ";
		}
		text += token_text;
	}
	return text;
};

function generate_sentence() {
	if(!wordnet){
		// throw new Error("WordNet data must be loaded first");
		throw new Error("Something bad happened, a variable didn't get set.");
	}
	const root_token = make_structure();
	const tokens_array = make_flat_tokens_array_from_structure(root_token);
	const sentence = uppercase_first(stringify_tokens_array(tokens_array));
	return sentence;
};

class Nonsensical {
	constructor() {
		this.wordnet = new Wordnet();
	}
	load(files, callback) {
		this.wordnet.load(files, callback);
	}
	generateSentence() {
		wordnet = this.wordnet;
		return generate_sentence();
	}
}

module.exports = Nonsensical;
