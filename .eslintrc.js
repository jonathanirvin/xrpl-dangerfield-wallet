module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
    ],
    overrides: [
        {
            env: {
                node: true,
            },
            files: [
                ".eslintrc.{js,cjs}",
            ],
            parserOptions: {
                sourceType: "script",
            },
        },
    ],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module", // Ensure this is set for ES Modules
        ecmaFeatures: {
            jsx: true, // Support JSX
        },
    },
    plugins: [
        "react",
    ],
    rules: {
        "react/react-in-jsx-scope": "off", // Disable this outdated rule
        "react/prop-types": "off", // Optional: Disable prop-types if you are using TypeScript or don't need them
        "no-unused-vars": "warn"
    },
    settings: {
        react: {
            version: "detect", // Automatically detect React version
        },
    },
};
