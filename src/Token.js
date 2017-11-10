/**
 * Represents the smallest syntactic building block of the text.
 */
module.exports = class Token {
	constructor({label, partOfSpeech, lemma, text}){
		this.label = label;
		this.partOfSpeech = partOfSpeech;
		this.lemma = lemma;
		this.text = text;
		this.dependencies = [];
	}
    
    addDependency(token, label){
        this.dependencies.push(token);
        if(token.label){
            console.error("Relabeling token!", token, `from ${token.label} to ${label}`);
        }
        token.label = label;
        if(token.dependender){
            console.error("Overwriting dependender!", token, `from ${token.dependender} to ${this}`);
        }
        token.dependender = this;
	}
	
	toString(){
		return  `Token[${this.partOfSpeech.tag}]('${this.text || this.lemma}')`;
	}
}
