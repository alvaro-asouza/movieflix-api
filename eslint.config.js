import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts}"],
    },
    {
        languageOptions: {
            globals: globals.node,
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            "indent": ["error", 4],
            "quotes": ["error", "double"],
            "linebreak-style": ["error", "windows"],
            "semi": ["error", "always"],
            "comma-spacing": [
                "error",
                {
                    "before": false,
                    "after": true,
                },
            ],
            "key-spacing": [
                "error",
                {
                    "beforeColon": false,
                    "afterColon": true,
                },
            ],
            "object-curly-spacing": ["error", "always"],
            "array-bracket-spacing": ["error", "never"],
            "space-before-function-paren": [
                "error",
                {
                    "anonymous": "always",
                    "named": "never",
                    "asyncArrow": "always",
                },
            ],
            "space-infix-ops": "error",
            "space-before-blocks": ["error", "always"],
            "no-trailing-spaces": "error",
            "eol-last": ["error", "always"],
        },
    },
];
