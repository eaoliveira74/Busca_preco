const globals = require('globals');

module.exports = [
  {
    ignores: ['node_modules/**']
  },
  {
    files: ['assets/js/**/*.js', 'server.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      'no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }],
      'no-console': 'off'
    }
  }
];
