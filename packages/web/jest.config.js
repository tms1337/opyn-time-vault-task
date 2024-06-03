module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.spec.js?$": "babel-jest",
    "^.+\\.int.spec.js?$": "babel-jest",
    "^.+\\.tsx?$": "babel-jest",
  },
  testEnvironment: "node",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  testPathIgnorePatterns: ["/node_modules/"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
