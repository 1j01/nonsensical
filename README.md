
# Nonsensical

Generates English sentences that are somewhat grammatically correct, or at least grammatically structured.

[Try it out on itch.io!](https://1j01.itch.io/nonsensical)

There are lots of lorem ipsum libraries, and ["thematic dummy text" generators](http://mashable.com/2013/07/11/lorem-ipsum/#VAftGtFa0iq9); there are Markov chain text generators.
But they're all lacking in structure, usually entirely.
There's [RNNs](https://en.wikipedia.org/wiki/Recurrent_neural_network), which [are cool](http://karpathy.github.io/2015/05/21/rnn-effectiveness/) and model structure, but they're much less accessible currently.
I haven't found any webpages where you can train one, for instance.

Nonsensical gives you structure, you know, something to hold on to, a banister,
and a banner, a banner with weird text written on it, that you can wave in the air.

### Better than Markov chain text generators: it can be

**Nonsensical** models the structure of a sentence,
inspired by [Google's Natural Language Syntax API](https://cloud.google.com/natural-language/).

This way it can do subject–verb agreement,
for example "The birds chirp" vs "The bird chirps",
and make articles and other determiners match up,
for example "a/the bird" vs "some/those/the birds",
and follow other rules of English.

Although with the random words it chooses acting as context,
the apparent structure might end up different than intended.

### Sample Output

> A secret plot in the charming saddle block anesthesias slammed those lacrimal sacs.  
> An enlisted woman on the adductive pitch blackness navigated an animatism.  
> Some spatula-shaped floricultures on the trap destressed the bad park.  
> A fight in a Malaysian straightenned some rosy-colored flags.  
> The imbricated throat in an alarming fire brigade queried a Circassian.  
> Some affixal icicles in a wintertime erred some white yams.  
> The virtuous sweetener in the ambulatory vase glorifies a downmarket graveyard.  
> Those cherries in a flying iron boot pursue some Plautuses.  
> Some stingy snows in those scriptural contraptions construct a Lygodium palmatum.  

In [the app](https://1j01.itch.io/nonsensical) you can mess around with giving it seed/suggestion/topic words.


## Install

`npm i nonsensical --save`


## API

**Note: UNSTABLE and not following semver until 1.0 is released**

Nonsensical first needs to load WordNet data, so the API isn't immediately available,
but once the data is loaded (asynchronously), the rest of the API is synchronous.

You need to copy the data JSON files and specify paths to load them from.

idk if something like this is a good idea or not:

    "postinstall": "cp -r node_modules/wordnetjs/data/ data/"

some things to consider:
cross-platform-ness of the copy command,
location of the module that has the data (might be in a sub node_modules folder? depending on npm version?),
when postinstall runs

maybe this package could provide a bin script to copy the wordnet data to a directory..

In Node it should really use the [version of wordnet.js](https://github.com/nlp-compromise/wordnet.js)
not [forked and ported for browser usage](https://github.com/wassname/wordnet.js).
Currently the API works using webpack (and should work with browserify or other bundlers),
run in the browser, but in Node there's no `window.fetch`.
It's hacked it to work in [`npm-start.js`](./src/npm-start.js)

```js
var Nonsensical = require("nonsensical");
var nonsensical = new Nonsensical();
var dataFilePaths = {
	noun: './data/noun.json',
	adverb: './data/adverb.json',
	adjective: './data/adjective.json',
	verb: './data/verb.json',
};
nonsensical.load(dataFilePaths, function () {
	// generate a sentence!
	console.log(nonsensical.generateSentence());
	// generate a sentence related to felines!
	console.log(nonsensical.generateSentence({
		wordSuggestions: {
			nouns: ["cat", "kitty", "mouse", "fur", "bird", "house"],
			verbs: ["purr", "pet", "hiss", "catch", "chase", "sleep"],
			adjectives: ["soft", "warm"]
		},
		useSuggestionRelatedWordChance: 1/2,
		maxSemanticStepsRemovedFromSuggestions: 3
	}));
});
```


### nonsensical.load(dataFilePaths, callback)

Loads WordNet data from the given file paths.

You wait for the callback before calling `generateSentence`.

### nonsensical.generateSentence(options)

All options are optional, including the options argument itself.

#### options.wordSuggestions

*Default: a built in map of word lists*

Suggestions for words to be incorporated into the output,
sort of like "topics" when semantic removal steps are enabled.
Should be an object with keys `nouns`, `verbs`, `adjectives`, `adverbs`, or a subset,
with arrays of words as values.

#### options.useSuggestionRelatedWordChance

*Default: 1*

A chance between 0 and 1 of using a one of your suggested words,
versus a word from the default word lists.

#### options.maxSemanticStepsRemovedFromSuggestions

*Default: 0*

If this is 1 or higher, Nonsensical will traverse WordNet synonym to synonym,
taking *up to this number of steps* away from the original word.

It *won't* take a *linearly* random number of steps away from the original word though, currently.


## To-Do

- Different types of sentences! Different structures!

- Make the API work reasonably for Node again

- Make a standalone build for browsers so you don't have to use a bundler

- Stuff mentioned in source code (TODO, FIXME)

- Poems would be fun; get some rhymes up in here~~?

- Constraints on sentences such as length
