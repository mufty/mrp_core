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
                "resolvePaths": [
                    `${process.env.SPLICE_GIT_ROOT}/node_services/common/src`
                ],
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
                "version": ">=12.13.0",
                "ignores": []
            }
        ],
        "node/no-unsupported-features/node-builtins": [
            "error",
            {
                "version": ">=12.13.0",
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
        "standard/object-curly-even-spacing": [
            "warn",
            "always"
        ],
        "no-process-exit": [
            "warn"
        ],
        "no-irregular-whitespace": [
            "warn",
            {
                "skipComments": true
            }
        ],

        // new added ignored rules can be fixed by LINT option --fix
        "indent": [
            "off"
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
        "no-trailing-spaces": [
            "off"
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
