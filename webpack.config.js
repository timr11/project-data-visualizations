const path = require("path");
const pkg = require("./package.json");

env = process.env;
const NODE_ENV = env.NODE_ENV;
const MIN = env.MIN;
const PROD = NODE_ENV === "production";

module.exports = {
	mode: "production", // Set the mode to 'production' for minification
	entry: "./src/app.ts", // Entry point of your application
	output: {
		filename: pkg.name + ".js", // Output file name
		path: path.resolve(__dirname, "bin"), // Output directory path
	},
	resolve: {
		extensions: [".ts", ".js"], // Add TypeScript and JavaScript as resolvable extensions
	},
	module: {
		rules: [
			{
				test: /\.ts$/, // Apply the following rules to TypeScript files
				exclude: /node_modules/, // Exclude node_modules directory from processing
				use: "ts-loader", // Use ts-loader for transpiling TypeScript
			},
		],
	},
	externals: PROD ? Object.keys(pkg.dependencies || {}) : [],
	optimization: {
		minimize: !!MIN,
	},
};
