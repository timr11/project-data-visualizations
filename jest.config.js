module.exports = {
	testRegex: ".spec.ts$", // Run tests on files ending with .spec.ts
	transform: {
		"^.+\\.ts$": "ts-jest",
	},
	moduleFileExtensions: ["ts", "js"],
	testEnvironment: "node",
};
