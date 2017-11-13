
# Nonsensical

Generates English sentences that are somewhat grammatically correct, or at least grammatically structured.
There are lots of lorem ipsum libraries, and "thematic dummy text" libraries; there are Markov chain text generators.

### Better than Markov chain text generators: it could be, potentially

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

> Some codes of the void air a nihility.  
> Those nihilities in the verb pass those estimators.  
> The noun in those spaces exhibitted the pragmatism.  
> A world on the dimension placed the metres.  
> Those regular hexahedra in the distances scromble some times.  
> A reckoner on those third powers frames the noun.
> Some entities in some cubes render the electronic computer.
> The graphic in those cubes uploads an attribute.
> Those texts in the texts bring forth those spaces.
> Those pillars in a data processor became an orang.
> The production on the outputs goes past a Pongo pygmaeus.
> Some anchors in the turnouts transgress the reality.

So far it's somewhat homogeneous. There's only *one sentence structure* output!
(DET NOUN PREP DET NOUN VERB DET NOUN PUNCT)

But it's already fun.
It's currently seeded with words themed around [r/SurrealMemes](https://www.reddit.com/r/surrealmemes/)
and computers, and a few grammar terms.

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
nonsensical.load(dataFilePaths, function(){
	console.log(nonsensical.generateSentence());
});
// look how simple the API could maybe have been, ideally:
// var sentence = nonsensical.sentence();
// var paragraph = nonsensical.paragraph();
// var stanza = nonsensical.stanza();
// var poem = nonsensical.poem();
```

## To-Do

- Pass words for it to incorporate into the output! This could be implemented easily now!

- Different types of sentences! Different structures!

- Make the API work reasonably for Node again

- Poems would be fun; get some rhymes up in here~~?

- Constraints on sentences such as length
