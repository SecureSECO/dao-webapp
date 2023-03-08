module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "plugin:tailwindcss/recommended",
  ],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
  },
  settings: {
    react: {
      version: "detect",
    },
  },

  plugins: ["react", "@typescript-eslint", "tailwindcss"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "tailwindcss/no-custom-classname": "off",
    "react/jsx-key": "off",
    "no-undef": "off",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },
}
