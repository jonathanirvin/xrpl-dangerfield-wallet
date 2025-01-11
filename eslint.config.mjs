import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import globals from "globals";

const config = [
    pluginJs.configs.recommended,
    pluginReactConfig,
    {
        settings: {
            react: {
                version: "detect",
                runtime: "automatic",
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
            ecmaVersion: 2021,
            sourceType: "module",
        },
        rules: {
            "react/prop-types": "off",
            "react/react-in-jsx-scope": "off",
        },
    },
];

export default config;
