// @ts-check

import stylisticTs from '@stylistic/eslint-plugin'
import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig(
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    ignores: ['out/**/*', 'esbuild.js', '.vscode-test.mjs'],
  },
  {
    plugins: { '@stylistic/ts': stylisticTs },
    rules: {
      '@stylistic/ts/indent': ['error', 2],
      '@stylistic/ts/quotes': ['error', 'single'],
      '@stylistic/ts/semi': ['error', 'never'],
      '@stylistic/ts/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/ts/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/ts/comma-spacing': ['error', { before: false, after: true }],
      '@/no-trailing-spaces': 'error',
      '@/no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 0 }],
      '@typescript-eslint/no-unused-vars': ['error', { vars: 'all', argsIgnorePattern: '^_', args: 'after-used', ignoreRestSiblings: true }],
    },
  },
)
