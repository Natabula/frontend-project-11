import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([
  {
    ignores: [
      'node_modules/**',
      '**/dist/**',

    ],
  },
  stylistic.configs.recommended,
  { files: ['/*.{js,mjs,cjs}'], plugins: { js }, extends: ['js/recommended'] },
  { files: ['/*.{js,mjs,cjs}'], languageOptions: { globals: globals.node } },
])
