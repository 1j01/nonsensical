const Wordnet = require("wordnetjs");
const pluralize = require("pluralize");

const tensify = require("./tensify");
const tensify_verb_phrase = (verb_phrase, form) =>
	verb_phrase.split(" ").map(
		(word, index) => index === 0 ? tensify(word)[form] : word
	).join(" ");

const { choose, uppercase_first, get_indefinite_article } = require("./helpers");
const { TAG, NUMBER, TENSE } = require("./part-of-speech-enums");
const default_word_suggestions = require("./default-word-suggestions");
const Token = require("./Token");

const default_use_suggestion_related_word_chance = 1;
const default_max_semantic_steps_removed_from_suggestions = 0;

class Nonsensical {
	constructor() {
		this._wordnet = new Wordnet();
	}
	load(files, callback) {
		// TODO: error handling
		// the promise version of this probably implicitly supports error handling
		this._wordnet.load(files, callback);
	}
	generateSentence(options = {}) {
		this._word_suggestions = Object.assign({}, default_word_suggestions, options.wordSuggestions);
		this._use_suggestion_related_word_chance = options.useSuggestionRelatedWordChance != null ?
			options.useSuggestionRelatedWordChance : default_use_suggestion_related_word_chance;
		this._max_semantic_steps_removed_from_suggestions = options.maxSemanticStepsRemovedFromSuggestions != null ?
			options.maxSemanticStepsRemovedFromSuggestions : default_max_semantic_steps_removed_from_suggestions;

		return this._generate_sentence();
	}

	_find_a_word(part_of_speech, search_base_terms, semantic_removal_depth = 0) {
		if (!search_base_terms) {
			// const word_suggestions_key = tag_to_suggestions_part_of_speech[tag];
			const word_suggestions_key = part_of_speech + "s";
			if (Math.random() < this._use_suggestion_related_word_chance) {
				search_base_terms = this._word_suggestions[word_suggestions_key];
			} else {
				search_base_terms = default_word_suggestions[word_suggestions_key];
			}
		}
		if (this._max_semantic_steps_removed_from_suggestions < 1) {
			return choose(search_base_terms);
		}
		// const part_of_speech = tag_to_wordnet_part_of_speech[tag];
		let tries = 0;
		const max_tries = 5;
		for (let i = 0; i < max_tries; i++) {
			let search_base = choose(search_base_terms);
			let results = this._wordnet.lookup(search_base, part_of_speech);
			// console.log(results);
			if (results.length > 0) {
				let result = choose(results);
				let word = choose(result.words);
				// TODO: maybe flatten this and do a random number of semantic removals (including zero)
				if (Math.random() < 0.5 && semantic_removal_depth < this._max_semantic_steps_removed_from_suggestions) {
					return this._find_a_word(part_of_speech, [word], semantic_removal_depth + 1);
				}
				return word;
			}
		}
		return choose(search_base_terms);
	}

	_make_noun() {
		const noun = new Token({ partOfSpeech: { tag: TAG.NOUN } });
		// TODO: make sure lemmas are lemmas
		noun.lemma = this._find_a_word("noun");
		noun.partOfSpeech.number = choose([NUMBER.PLURAL, NUMBER.SINGULAR])
		if (noun.partOfSpeech.number === NUMBER.PLURAL || noun.partOfSpeech.number === NUMBER.DUAL) {
			noun.text = pluralize.plural(noun.lemma);
		} else {
			noun.text = pluralize.singular(noun.lemma);
		}
		return noun;
	};

	_make_spicy_noun() {
		const noun = this._make_noun();
		const determiner = new Token({ partOfSpeech: { tag: TAG.DET } });
		if(Math.random() < 0.5){
			noun.addDependency(this._make_adjective(), "adj");
		}
		const noun_text_before_adding_determiner = this._stringify_tokens_array(this._make_flat_tokens_array_from_structure(noun));
		noun.addDependency(determiner, "det");
		if (noun.partOfSpeech.number === NUMBER.PLURAL) {
			determiner.text = choose(["some", "some", "those", "those", "the"]); // could include informal "them"/"dem"/"'em"
			// console.log(`using plural determiner: \`${this._stringify_tokens_array(this._make_flat_tokens_array_from_structure(noun))}\` for`, noun);
		} else {
			if (Math.random() < 0.5) {
				// TODO: do this determination later?
				determiner.text = get_indefinite_article(noun_text_before_adding_determiner);
			} else {
				determiner.text = "the";
			}
			// console.log(`using singular determiner: \`${this._stringify_tokens_array(this._make_flat_tokens_array_from_structure(noun))}\` for`, noun);
		}
		return noun;
	};

	_make_adjective(){
		const adjective = new Token({ partOfSpeech: { tag: TAG.ADJ } });
		adjective.lemma = this._find_a_word("adjective");
		return adjective;
	}

	_make_adpositional_phrase(recurse_depth = 0) {
		const max_recurse_depth = 2;
		const preposition = new Token({ partOfSpeech: { tag: TAG.ADP } });
		const preposition_object_noun = this._make_spicy_noun();
		if(Math.random() < 0.1 && recurse_depth < max_recurse_depth){
			preposition_object_noun.addDependency(this._make_adpositional_phrase(recurse_depth + 1), "prep");
		}
		preposition.lemma = choose(["in", "in", "in", "on", "of"]);
		preposition.addDependency(preposition_object_noun, "pobj");
		return preposition;
	};

	_make_verb() {
		const verb = new Token({ partOfSpeech: { tag: TAG.VERB } });
		verb.lemma = this._find_a_word("verb");
		// TODO: this should probably be at a later step,
		// since it has to get overridden later in at least one case
		// Note: one piece of code stringifies a noun during generation in order to do a/an
		if (Math.random() < 0.5) {
			verb.text = tensify_verb_phrase(verb.lemma, "past");
			verb.partOfSpeech.tense = TENSE.PAST;
		} else {
			// Note: plural means _without_ an s
			verb.text = tensify_verb_phrase(verb.lemma, "present_plural");
			verb.partOfSpeech.tense = TENSE.PRESENT;
		}
		return verb;
	};

	_make_structure() {
		const root_verb = this._make_verb();
		root_verb.label = "root";
		const ending_punctuation = new Token({ partOfSpeech: { tag: TAG.PUNCT }, text: "." });
		const subject_noun = this._make_spicy_noun();
		const object_noun = this._make_spicy_noun();
		root_verb.addDependency(subject_noun, "nsubj");
		subject_noun.addDependency(this._make_adpositional_phrase(), "prep");
		root_verb.addDependency(object_noun, "nobj");
		root_verb.addDependency(ending_punctuation, "p");
		if (root_verb.partOfSpeech.tense === TENSE.PRESENT) {
			if (subject_noun.partOfSpeech.number === NUMBER.SINGULAR) {
				root_verb.text = tensify_verb_phrase(root_verb.lemma, "present_singular");
			}
		}
		return root_verb;
	};

	_make_flat_tokens_array_from_structure(token) {
		let tokens = [token];
		for (let dep_token of token.dependencies) {
			const dep_flattened_tokens = this._make_flat_tokens_array_from_structure(dep_token);
			const dep_tag = dep_token.partOfSpeech.tag;
			const parent_tag = token.partOfSpeech.tag;
			// console.log(`what order for ${parent_tag} (\`${this._stringify_tokens_array(tokens)}\`) and dep ${dep_tag} (\`${this._stringify_tokens_array(dep_flattened_tokens)}\`)?`, token, dep_token);
			let dep_after;
			if (dep_tag === TAG.PUNCT || dep_tag === TAG.X) {
				dep_after = true;
			} else if (parent_tag === TAG.ADP) {
				dep_after = true;
			} else if (dep_tag === TAG.ADP) {
				dep_after = true;
				// for phrases like "the clock in the room"
				// but there are also phrases like "in the room, there's a clock"
			} else if (dep_tag === TAG.ADJ) {
				// adjectives prospective may be ordered poetic / poetic, reversed, and aft
				// that would be with a flag, you see / not just global, no don't be daft
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
			// console.log(`going with ${dep_after ? "dep after" : "dep before"}  (\`${this._stringify_tokens_array(tokens)}\`)`);
		}
		return tokens;
	};

	_stringify_tokens_array(tokens) {
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

	_generate_sentence() {
		// if(!this._wordnet._is_loaded_()){
		// 	throw new Error("WordNet data must be loaded first");
		// }
		const root_token = this._make_structure();
		const tokens_array = this._make_flat_tokens_array_from_structure(root_token);
		const sentence = uppercase_first(this._stringify_tokens_array(tokens_array));
		return sentence;
	};

}

module.exports = Nonsensical;
