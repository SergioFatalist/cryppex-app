/** @type {import("eslint").Linter.BaseConfig} **/
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true,
    "vue/setup-compiler-macros": true,
  },
  plugins: [
    "@typescript-eslint",
    "vue",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: "latest",
    sourceType: "module",
    globalReturn: false,
    impliedStrict: false,
  },
  ignorePatterns: [
    ".eslintrc.cjs",
    ".prettierrc.cjs",
    "dist/*",
    "node_modules/*"
  ],
  rules: {
    "no-undef": "off",
    "vue/multi-word-component-names": "off",
    "vue/valid-v-for": "off",
    "vue/prefer-true-attribute-shorthand": ["error", "always"],
    "vue/no-reserved-component-names": "off",
    "vue/no-v-html": "off",
    "vue/no-v-text-v-html-on-component": "off",
    "vue/no-prop-default": "off",
    "vue/no-mutating-props": "off",
    "vue/no-template-shadow": "off",
    "vue/first-attribute-linebreak": ["error", {
      "singleline": "ignore",
      "multiline": "below",
    }],
    "vue/require-default-prop": "off",
    "@typescript-eslint/quotes": ["error", "double"],
    "@typescript-eslint/semi": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
      }
    ],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: ["parameter", "variable"],
        leadingUnderscore: "forbid",
        filter: {
          regex: "_*",
          match: false
        },
        format: null,
      },
      {
        selector: "parameter",
        leadingUnderscore: "require",
        format: null,
        modifiers: ["unused"],
      },
    ],
  },
};
