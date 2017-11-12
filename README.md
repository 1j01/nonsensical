
# Nonsensical

Generates English sentences that are somewhat grammatically correct, or at least structured.
If you want safer text to use in a demo of a product or design, maybe go with the standard lorem ipsum,
but if you want something more fun, well.. well there are a lot of "thematic dummy text" libraries,
but this library is interesting because of the structure of the sentences.

### Better than Markov chain text generators: it could be, potentially

**Nonsensical** models the structure of a sentence,
inspired by [Google's Natural Language Syntax API](https://cloud.google.com/natural-language/).

This way it can make verbs' and nouns' plurality match up,
for example "The birds chirp" or "The bird chirps",
and make articles and other determiners match up,
for example "a/the bird" or "some/those/the birds",
and follow other rules of English.

Although with the random words it chooses acting as context,
the apparent structure might end up different than intended.

### Sample Output

> The computer in the output scromble the cube. (WRONG; should be 'scrombles' or 'computers')  
> Those nouns on some entities upload the reality.  
> Those hypercubes on the computer scromble the time.  
> Those graphics in those realities render some cubes.  
> The space of the dimensions outputted a computer. (WRONGish; should be 'output')  
> The pillar in those graphics scrombled some realities.  
> Those computers in the computer consume some vegetals.  
> The outputs of the text transcend the reality.  

Yeah, it's currently themed around [r/SurrealMemes](https://www.reddit.com/r/surrealmemes/).
And so far it's very homogeneous. There's only one sentence structure that it outputs.

## Install

`npm i nonsensical --save`

## API

```js
var nonsensical = require("nonsensical");
var sentence = nonsensical.sentence();
// var paragraph = nonsensical.paragraph();
// var stanza = nonsensical.stanza();
// var poem = nonsensical.poem();
```

## To-Do

- Subject–verb agreement
("The birds chirp", "The bird chirps")

- Different types of sentences

- Poems would be fun; get some rhymes up in here~¿^`

- Constraints on sentences such as, importantly, length

- Pass words for it to incorporate into the output
