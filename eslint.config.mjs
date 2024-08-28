// eslint.config.js
import stylisticTs from '@stylistic/eslint-plugin-ts'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
export default tseslint.config({
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
  ],
  plugins: { '@stylistic/ts': stylisticTs },
  ignores: ['out/**/*', 'esbuild.js', '.vscode-test.mjs'],
  rules: {
    '@stylistic/ts/indent': ['error', 2],
    '@stylistic/ts/quotes': ['error', 'single'],
    '@stylistic/ts/semi': ['error', 'never'],
    '@stylistic/ts/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    '@stylistic/ts/comma-dangle': ['error', 'always-multiline'],
    '@stylistic/ts/comma-spacing': ['error', { before: false, after: true }],
    '@/no-trailing-spaces': 'error',
    '@/no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 0 }],
    '@typescript-eslint/no-unused-vars': ['error', { vars: 'all', argsIgnorePattern: '^_',  args: 'after-used', ignoreRestSiblings: true }],
  },
})
