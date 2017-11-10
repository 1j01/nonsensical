/**
 * Parts of speech are as defined in http://www.lrec-conf.org/proceedings/lrec2012/pdf/274_Paper.pdf
 * 
 * Enums are taken from https://cloud.google.com/natural-language/docs/reference/rest/v1/Token
 * Tables are formatted with https://ozh.github.io/ascii-tables/
 */

/**
+---------+--------------------------------------------+
| UNKNOWN | Unknown                                    |
| ADJ     | Adjective                                  |
| ADP     | Adposition (preposition and postposition)  |
| ADV     | Adverb                                     |
| CONJ    | Conjunction                                |
| DET     | Determiner                                 |
| NOUN    | Noun (common and proper)                   |
| NUM     | Cardinal number                            |
| PRON    | Pronoun                                    |
| PRT     | Particle or other function word            |
| PUNCT   | Punctuation                                |
| VERB    | Verb (all tenses and modes)                |
| X       | Other: foreign words, typos, abbreviations |
| AFFIX   | Affix                                      |
+---------+--------------------------------------------+
*/
exports.TAG = {
	UNKNOWN: "UNKNOWN",
    ADJ: "ADJ",
    ADP: "ADP",
    ADV: "ADV",
    CONJ: "CONJ",
    DET: "DET",
    NOUN: "NOUN",
    NUM: "NUM",
    PRON: "PRON",
    PRT: "PRT",
    PUNCT: "PUNCT",
    VERB: "VERB",
    X: "X",
    AFFIX: "AFFIX",
};

/**
+------------------+------------------------------------------------------------------------+
| PERSON_UNKNOWN   | Person is not applicable in the analyzed language or is not predicted. |
| FIRST            | First                                                                  |
| SECOND           | Second                                                                 |
| THIRD            | Third                                                                  |
| REFLEXIVE_PERSON | Reflexive                                                              |
+------------------+------------------------------------------------------------------------+
*/
exports.PERSON = {
    PERSON_UNKNOWN: "PERSON_UNKNOWN",
    FIRST: "FIRST",
    SECOND: "SECOND",
    THIRD: "THIRD",
    REFLEXIVE_PERSON: "REFLEXIVE_PERSON",
};

/**
+----------------+------------------------------------------------------------------------+
| NUMBER_UNKNOWN | Number is not applicable in the analyzed language or is not predicted. |
| SINGULAR       | Singular                                                               |
| PLURAL         | Plural                                                                 |
| DUAL           | Dual                                                                   |
+----------------+------------------------------------------------------------------------+
*/
exports.NUMBER = {
    NUMBER_UNKNOWN: "NUMBER_UNKNOWN",
    PLURAL: "PLURAL",
    SINGULAR: "SINGULAR",
    DUAL: "DUAL",
};

/**
+----------------+------------------------------------------------------------------------+
| PROPER_UNKNOWN | Proper is not applicable in the analyzed language or is not predicted. |
| PROPER         | Proper                                                                 |
| NOT_PROPER     | Not proper                                                             |
+----------------+------------------------------------------------------------------------+
*/
exports.PROPER = {
    PROPER_UNKNOWN: "PROPER_UNKNOWN",
    PROPER: "PROPER",
    NOT_PROPER: "NOT_PROPER",
};

/**
+-------------------+-----------------------------------------------------------------------+
| TENSE_UNKNOWN     | Tense is not applicable in the analyzed language or is not predicted. |
| CONDITIONAL_TENSE | Conditional                                                           |
| FUTURE            | Future                                                                |
| PAST              | Past                                                                  |
| PRESENT           | Present                                                               |
| IMPERFECT         | Imperfect                                                             |
| PLUPERFECT        | Pluperfect                                                            |
+-------------------+-----------------------------------------------------------------------+
*/
exports.TENSE = {
    TENSE_UNKNOWN: "TENSE_UNKNOWN",
    CONDITIONAL_TENSE: "CONDITIONAL_TENSE",
    FUTURE: "FUTURE",
    PAST: "PAST",
    PRESENT: "PRESENT",
    IMPERFECT: "IMPERFECT",
    PLUPERFECT: "PLUPERFECT",
};
