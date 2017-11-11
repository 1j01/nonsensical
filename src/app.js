const { sentence } = require("./nonsensical");

const output_el = document.getElementById("output");
const another_one_button = document.getElementById("another-one");
// const previous_one_button = document.getElementById("previous-one");

const another_one = () => {
	location.hash = sentence();
};
const render_from_hash = () => {
	output_el.textContent = decodeURIComponent(location.hash.replace("#", ""));
};

if (location.hash.length <= 1) {
	another_one();
}

window.onhashchange = render_from_hash;
render_from_hash();

another_one_button.onclick = another_one;

// previous_one_button.onclick = ()=> {
// 	history.back();
// };