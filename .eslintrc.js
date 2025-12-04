module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  ignorePatterns: [
    'templates/**/*',
    'node_modules/**/*',
    'dist/**/*',
    '*.min.js'
  ],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
  }
};
