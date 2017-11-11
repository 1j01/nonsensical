// TODO: fancy choosing, like maybe remember choices and rechoose those things?
// maybe expose decisions and allow tweaking weights
// although context-sensitive decisions would probably be good
exports.choose = arr => arr[Math.floor(Math.random() * arr.length)];

// TODO: ..handle whitespace? or more importantly emoji? or more importantly sentence-starting contractions? ('em "'em"s, eh?)
// could use regex replace, should be quite simple
exports.uppercase_first = (text) => text[0].toUpperCase() + text.slice(1);

// TODO: smarter? this looks smarter: https://www.npmjs.com/package/retext-indefinite-article
exports.get_indefinite_article = (noun_text) => exports.is_vowel_excluding_y(noun_text[0]) ? "an" : "a";

// you've got to be explicit when doing these sorts of things
exports.is_consonant_including_y = (character) => /[bcdfghjklmnpqrstvwxyz]/i.test(character);
exports.is_consonant_excluding_y = (character) => /[bcdfghjklmnpqrstvwxz]/i.test(character);

// a e i o u and sometimes y
exports.is_vowel_including_y = (character) => /[aeiouy]/i.test(character);
exports.is_vowel_excluding_y = (character) => /[aeiou]/i.test(character);
