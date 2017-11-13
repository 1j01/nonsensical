const path = require('path');

module.exports = {
	entry: './src/app.js',
	output: {
		filename: 'app-bundle.js',
		path: path.resolve(__dirname, 'app/build'),
		publicPath: '/build/',
	},
	devServer: {
		contentBase: './app',
		public: process.env.C9_HOSTNAME,
		host: process.env.IP || '127.0.0.1',
		port: process.env.PORT || '8080',
	}
};
