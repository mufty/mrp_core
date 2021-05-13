module.exports = {
    "env": {
        "browser": false,
        "amd": true,
        "node": true,
        "mocha": true,
        "es6": true
    },
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "script"
    },
    "extends": [
        "standard",
        "eslint:recommended",
        "plugin:node/recommended"
    ],
    "rules": {
        "node/no-missing-require": [
            "error",
            {
                "allowModules": [],
                "resolvePaths": [],
                "tryExtensions": [
                    ".js",
                    ".json"
                ]
            }
        ],
        "node/exports-style": [
            "error",
            "module.exports"
        ],
        "node/no-unsupported-features/es-syntax": [
            "error",
            {
                "version": ">=14.15.0",
                "ignores": []
            }
        ],
        "node/no-unsupported-features/node-builtins": [
            "error",
            {
                "version": ">=14.15.0",
                "ignores": []
            }
        ],
        "node/prefer-global/buffer": [
            "error",
            "always"
        ],
        "node/prefer-global/console": [
            "error",
            "always"
        ],
        "node/prefer-global/process": [
            "error",
            "always"
        ],
        "node/prefer-global/url-search-params": [
            "error",
            "always"
        ],
        "node/prefer-global/url": [
            "error",
            "always"
        ],
        "node/no-unpublished-require": [
            "off"
        ],
        "no-eval": [
            "off"
        ],
        "standard/object-curly-even-spacing": [
            "warn",
            "always"
        ],
        "no-irregular-whitespace": [
            "warn",
            {
                "skipComments": true
            }
        ],

        // new added ignored rules can be fixed by LINT option --fix
        "no-new": [
            "off"
        ],
        "no-shadow": [
            2, 
            {"allow": ["done"], "hoist": "functions"}
        ],
        "indent": [
            "error", 4, { "SwitchCase": 1, "ignoreComments": true  }
        ],
        "semi": [
            "off"
        ],
        "keyword-spacing": [
            "off"
        ],
        "key-spacing": [
            "off"
        ],
        "spaced-comment": [
            "off"
        ],
        "no-process-exit": [
            "off"
        ],
        "one-var": [
            "off"
        ],
        "no-path-concat": [
            "off"
        ],
        "no-trailing-spaces": [
            "error", { "skipBlankLines": true, "ignoreComments": true }
        ],
        "no-multi-spaces": [
            "off"
        ],
        "quotes": [
            "off"
        ],
        "space-in-parens" : [
            "off"
        ],
        "padded-blocks": [
            "off"
        ],
        "space-before-function-paren": [
            "off"
        ],
        "space-before-blocks": [
            "off"
        ],
        "quote-props": [
            "off"
        ],
        "comma-dangle": [
            "off"
        ],
        "brace-style": [
            "off"
        ],
        "block-spacing": [
            "off"
        ],
        "no-useless-computed-key": [
            "off"
        ],
        "comma-spacing": [
            "off"
        ],
        "space-infix-ops": [
            "off"
        ],
        "prefer-const": [
            "off"
        ],
        "curly": [
            "off"
        ],
        "operator-linebreak": [
            "off"
        ],
        "eol-last": [
            "off"
        ],
        "no-multiple-empty-lines": [
            "off"
        ],
        "space-unary-ops": [
            "off"
        ],
        "eqeqeq": [
            "off"
        ],
        "object-curly-spacing": [
            "off"
        ],
        "object-curly-even-spacing": [
            "off"
        ],
        "semi-spacing": [
            "off"
        ],
        "no-extra-semi": [
            "off"
        ],
        "no-case-declarations": [
            "off"
        ],
        "node/no-deprecated-api": ["error", {
            "ignoreModuleItems": ["domain"]
        }],
        "promise/param-names": [
            "off"
        ],
        "prefer-promise-reject-errors": [
            "off"
        ],
        "standard/no-callback-literal": [
            "off"
        ],
        "comma-style": [
            "off"
        ],
        "array-bracket-spacing": [
            "off"
        ],
        "no-unneeded-ternary": [
            "off"
        ],
        "no-useless-return": [
            "off"
        ],
        "arrow-spacing": [
            "off"
        ],
        "arrow-body-style": [
            "error", "as-needed"
        ],
        "standard/object-curly-even-spacing": [
            "off"
        ],
        "lines-between-class-members": [
            "off"
        ],
        "yoda": [
            "off"
        ],
        "no-floating-decimal" : [
            "off"
        ],

        // project specific or legacy system

        "camelcase": [
            "off"
        ],
        "no-prototype-builtins":[
            "off"
        ]

    }
}
