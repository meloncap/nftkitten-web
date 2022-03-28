module.exports = {
  "extends": ["plugin:tailwindcss/recommended", "eslint:recommended", "next/core-web-vitals", "prettier"],
  "rules": {
    "import/prefer-default-export": "off",
    "no-console": "warn",
    "no-var": "error"
  },
  "plugins": ["tailwindcss", "cypress"]
}