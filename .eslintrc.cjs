/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'boundaries'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  settings: {
    'boundaries/elements': [
      { type: 'domain', pattern: '**/domain/**' },
      { type: 'application', pattern: '**/application/**' },
      { type: 'infrastructure', pattern: '**/infrastructure/**' },
      { type: 'presentation', pattern: '**/presentation/**' },
      { type: 'app', pattern: 'apps/**' },
    ],
    'boundaries/ignore': ['**/*.test.ts', '**/*.spec.ts'],
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'error',
    'boundaries/element-types': [
      'warn',
      {
        default: 'disallow',
        rules: [
          { from: 'domain', allow: ['domain'] },
          { from: 'application', allow: ['domain', 'application'] },
          { from: 'infrastructure', allow: ['domain', 'application', 'infrastructure'] },
          { from: 'presentation', allow: ['domain', 'application', 'presentation'] },
          { from: 'app', allow: ['domain', 'application', 'infrastructure', 'presentation', 'app'] },
        ],
      },
    ],
  },
  ignorePatterns: ['dist', 'node_modules', '.expo', 'coverage'],
};
