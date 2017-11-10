import pluralize from "pluralize";
import emojis from "emojis-list";

import tensify from "./tensify";

import {choose, uppercase_first, get_indefinite_article} from "./helpers";
import {TAG, NUMBER, TENSE} from "./part-of-speech-enums";
import Token from "./Token";


// some foobular words
const VERBZ = ["parse", "output", "retain", "generate", "put", "display", "render", "upload", "consume", "transcend", "assemble", "scromble", "scronch", "become"];
const NOUNZ = ["noun", "verb", "output", "code", "graphic", "computer", "text", "orang", "meme man", "vegetal", "cube", "dimension", "hypercube", "pillar", "space", "time", "reality", "entity", "void"];
const ADJZ = ["amazing", "boring", "nonsensical", "silly", "lame", "orange", "aesthetic", "surreal", "hyperdimensional", "human"];
const ADPZ = ["in", "in", "in", "on", "of"];
const DETZ_PLURAL = ["some", "some", "those", "those", "the"]; // could include informal "them"/"dem"/"'em"
const DETZ_SINGULAR = ["a", "an", "the"];

const make_noun = function() {
    const noun = new Token({partOfSpeech: {tag: TAG.NOUN}});
    noun.lemma = choose(NOUNZ);
    noun.partOfSpeech.number = choose([NUMBER.PLURAL, NUMBER.SINGULAR])
    if(noun.partOfSpeech.number === NUMBER.PLURAL || noun.partOfSpeech.number === NUMBER.DUAL){
        noun.text = pluralize.plural(noun.lemma);
    }else{
        noun.text = pluralize.singular(noun.lemma);
    }
    return noun;
};

const make_spicy_noun = function() {
    const noun = make_noun();
    const initial_noun_text = stringify_tokens_array(make_flat_tokens_array_from_structure(noun));
    const determiner = new Token({partOfSpeech: {tag: TAG.DET}});
    noun.addDependency(determiner, "det");
    if(noun.partOfSpeech.number === NUMBER.PLURAL){
        determiner.text = choose(DETZ_PLURAL);
        // console.log(`using plural determiner: \`${stringify_tokens_array(make_flat_tokens_array_from_structure(noun))}\` for`, noun);
    }else{
        // determiner.text = choose(DETZ_SINGULAR);
        if(Math.random() < 0.5){
            determiner.text = get_indefinite_article(initial_noun_text);
        }else{
            determiner.text = "the";
        }
        // console.log(`using singular determiner: \`${stringify_tokens_array(make_flat_tokens_array_from_structure(noun))}\` for`, noun);
    }
    return noun;
};

const make_adpositional_phrase = function() {
    const preposition = new Token({partOfSpeech: {tag: TAG.ADP}});
	const preposition_object_noun = make_spicy_noun();
    preposition.lemma = choose(ADPZ);
	preposition.addDependency(preposition_object_noun, "pobj");
	return preposition;
};

const make_verb = function(){
    const verb = new Token({label: "root", partOfSpeech: {tag: TAG.VERB}});
    verb.lemma = choose(VERBZ);
    if(Math.random() < 0.5){
        verb.text = tensify(verb.lemma).past;
        // console.log(token.lemma, irregular(verb.lemma));
        // verb.text = irregular(verb.lemma).PP;
        verb.partOfSpeech.tense = TENSE.PAST;
    }
    return verb;
};

const make_structure = function() {
	const root_verb = make_verb();
	const ending_punctuation = new Token({partOfSpeech: {tag: TAG.PUNCT}, text: "."});
	const ending_emoji = new Token({partOfSpeech: {tag: TAG.X}, text: choose(emojis)});
	root_verb.addDependency(make_spicy_noun(), "nsubj");
	root_verb.addDependency(make_spicy_noun(), "nobj");
    root_verb.addDependency(make_adpositional_phrase(), "prep");
	root_verb.addDependency(ending_punctuation, "p");
	root_verb.addDependency(ending_emoji, "x");
	return root_verb;
};

var make_flat_tokens_array_from_structure = function(token){
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

const stringify_tokens_array = function(tokens){
	let text = "";
	for (let index = 0; index < tokens.length; index++) {
		const token = tokens[index];
        const token_text = token.text != null ? token.text : token.lemma;
        if(!token_text){
            console.error("Token has no text or lemma", token);
        }
		if ((index > 0) && (token.partOfSpeech.tag !== TAG.PUNCT) && (!token_text[0].match(/'’/))) {
			text += " ";
		}
		text += token_text;
	}
	return text;
};


const root_token = make_structure();
console.log("root:", root_token);

const tokens_array = make_flat_tokens_array_from_structure(root_token);
console.log("tokens:", tokens_array);

const sentence = uppercase_first(stringify_tokens_array(tokens_array));
console.log("sentence:", sentence);

if (typeof document !== "undefined") {
    document.getElementById("output").textContent = sentence;
}
