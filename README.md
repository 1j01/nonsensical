
# Nonsensical

Generates English sentences that are somewhat grammatically correct, or at least structured.
If you want safer text to use in a demo of a product or design, maybe go with the standard lorem ipsum,
but if you want something more fun, well.. well there are a lot of "thematic dummy text" libraries,
but this library is interesting because of the structure of the sentences.

### Better than Markov chain text generators

**Nonsensical** models the structure of a sentence,
inspired by [Google's Natural Language Syntax API](https://cloud.google.com/natural-language/).

This way it can make verbs' and nouns' plurality match up,
for example "The birds chirp" or "The bird chirps",
and make articles and other determiners match up,
for example "a/the bird" or "some/those/the birds",
and follow other rules of English.

Although with the random words it chooses acting as context,
the apparent structure might end up different than intended.


## Sample Output

> "Those hypercubes in a noun outputted those hypercubes. 🕡"  
> "The cubes in the meme man retain those outputs. 🚣🏿‍♀️"  
> "Some nouns on those vegetals put the computer. ☝"

Yeah, currently it outputs random emoji at the end,
and it's themed around [r/SurrealMemes](https://www.reddit.com/r/surrealmemes/).

## Install

Not published yet.

<!-- `npm i nonsensical --save` -->

## API

Not defined yet.

```js
// var nonsensical = require("nonsensical");
// var sentence = nonsensical.sentence();
// var paragraph = nonsensical.paragraph();
// var stanza = nonsensical.stanza();
// var poem = nonsensical.poem();
// var prose = nonsensical.prose();
```

## To-Do

- Handle tenses.
("The birds chirp", "The bird chirps")

- Generate different types of sentences.

- Poems would be fun.
(Get some rhymes up in here..)

- The API could include constraints.

- Pass words as suggestions
