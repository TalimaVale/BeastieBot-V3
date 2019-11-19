module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json"
    }
  },
  moduleFileExtensions: ["js", "ts", "json"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testMatch: ["**/test/**/*.test.(ts|js)"],
  testEnvironment: "node",
  preset: "ts-jest",
  reporters: ["default", "jest-junit"]
};
