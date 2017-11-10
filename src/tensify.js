/* Based on: https://github.com/boo1ean/tensify

Copyright 2014 Egor Gumenyuk

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const PresentVerbInflector = require('natural/lib/natural/inflectors/present_verb_inflector');
const find_irregular_verb = require('./tensify-irregular-verbs');
const {is_consonant_excluding_y, is_vowel_including_y} = require('./helpers');

const present_inflector = new PresentVerbInflector();

// Pretty silly :D
// dict of verbs which have stress at not at the end
const stress_dict = ['inherit', 'target', 'visit', 'trigger'];

const has_stress_at_the_end_of_the_word = function (word) {
	return stress_dict.indexOf(word) === -1;
};

const ends_with_a_single_vowel_plus_a_consonant_and_not_wx = function (verb) {
	const last = verb.length - 1;

	return is_consonant_excluding_y(verb[last])
		&& is_vowel_including_y(verb[last - 1])
		&& !is_vowel_including_y(verb[last - 2])
		&& verb[last] !== 'w'
		&& verb[last] !== 'x';
};

const ends_with_c = function (verb) {
	return verb[verb.length - 1].toLowerCase() === 'c';
};

const ends_with_a_consonant_plus_y = function (verb) {
	const last = verb.length - 1;
	return verb[last].toLowerCase() === 'y'
		&& is_consonant_excluding_y(verb[last - 1]);
};

const ends_with_e = function (verb) {
	return verb[verb.length - 1].toLowerCase() === 'e';
};

const ends_with_two_vowels_plus_a_consonant = function (verb) {
	const last = verb.length - 1;

	return is_consonant_excluding_y(verb[last])
		&& is_vowel_including_y(verb[last - 1])
		&& is_vowel_including_y(verb[last - 2]);
};

const present_tense_verbs_that_end_in_ed = [
	'embed'
];

const already_in_past = function (verb) {
	return verb.slice(-2) === 'ed'
		&& present_tense_verbs_that_end_in_ed.indexOf(verb) === -1;
};

const edify = function (verb) {
	switch (true) {
		case already_in_past(verb):
			return verb;

		case ends_with_c(verb):
			return verb + 'ked';

		case ends_with_a_consonant_plus_y(verb):
			return verb.slice(0, -1) + 'ied';

		case ends_with_e(verb):
			return verb + 'd';

		case ends_with_two_vowels_plus_a_consonant(verb):
			return verb + 'ed';

		case ends_with_a_single_vowel_plus_a_consonant_and_not_wx(verb) && has_stress_at_the_end_of_the_word(verb):
			return verb + verb[verb.length - 1] + 'ed';

		default:
			return verb + 'ed';
	}
};

const tensify = function (verb) {
	let past, past_participle;

	// Normalize verb to simple plural form
	verb = present_inflector.pluralize(verb);

	// Attempt to find irregular verb
	const irregular = find_irregular_verb(verb);

	if (irregular) {
		past = irregular[0];
		past_participle = irregular[1];
	} else {
		past = past_participle = edify(verb);
	}

	return {
		past: past,
		past_participle: past_participle
	};
};

module.exports = tensify;
