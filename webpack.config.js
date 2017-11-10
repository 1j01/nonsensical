const path = require('path');

module.exports = {
	entry: './src/nonsensical.js',
	output: {
	filename: 'bundle.js',
		path: path.resolve(__dirname, 'build'),
		publicPath: '/build/'
	}
};
