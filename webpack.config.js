const path = require('path');

module.exports = {
	entry: './src/app.js',
	output: {
		filename: 'app-bundle.js',
		path: path.resolve(__dirname, 'build'),
		publicPath: '/build/',
	},
	devServer: {
		public: process.env.C9_HOSTNAME,
		host: process.env.IP || "127.0.0.1",
		port: process.env.PORT || "8080",
	}
};
