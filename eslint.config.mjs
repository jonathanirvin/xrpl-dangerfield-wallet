import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import globals from "globals";

const config = [
    pluginJs.configs.recommended,
    pluginReactConfig,
    {
        settings: {
            react: {
                version: "detect", // Detect React version
                runtime: "automatic", // Use React 17+ automatic runtime
            },
        },
        languageOptions: {
            globals: {
                ...Object.fromEntries(
                    Object.entries( globals.browser ).map( ( [ key, value ] ) => [ key.trim(), value ] )
                ),
                ...Object.fromEntries(
                    Object.entries( globals.node ).map( ( [ key, value ] ) => [ key.trim(), value ] )
                ),
            },
            ecmaVersion: "latest", // Use latest ECMAScript version
            sourceType: "module", // Use ES modules
        },
        rules: {
            "react/prop-types": "off", // Disable if unnecessary
            "react/react-in-jsx-scope": "off", // Disable outdated rule
            "no-unused-vars": "warn"
        },
    },
];

export default config;
