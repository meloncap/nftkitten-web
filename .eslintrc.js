module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['tailwindcss', 'cypress', '@typescript-eslint'],
  extends: [
    'plugin:tailwindcss/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
    'prettier',
  ],
  rules: {
    'import/prefer-default-export': 'off',
    'no-console': 'warn',
    'no-var': 'error',
    'no-unused-vars': 'off',
    'react/display-name': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },
}
