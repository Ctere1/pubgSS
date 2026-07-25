import js from '@eslint/js'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'

/**
 * Flat config, pinned to ESLint 9 — jsx-a11y does not support 10 yet.
 *
 * Two environments live in this repo and they do not share globals: the app
 * under src/ runs in a browser, while the Vite config, its plugins and the
 * one-off scripts run in Node.
 *
 * index.html is not linted — the inline theme bootstrap is HTML, which ESLint
 * cannot parse without a dedicated plugin.
 */
export default [
  { ignores: ['dist/**', 'node_modules/**'] },

  js.configs.recommended,

  // ---- Application code ----------------------------------------------------
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: { react: { version: 'detect' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      // React 19 with the automatic runtime: no import needed to use JSX.
      ...react.configs.flat['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,

      // Props are not typed anywhere in this project — no PropTypes, no TS —
      // so the rule would flag every component without adding a check.
      'react/prop-types': 'off',

      // Fast Refresh only reloads a module cleanly when everything it exports
      // is a component. Constants are tolerated; anything else breaks HMR.
      // Icons.jsx is a registry by design: it names icon components and the
      // maps that group them, and HMR of an icon table is not a concern.
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true, allowExportNames: ['featureIcons'] },
      ],

      // The codebase already treats these as errors in practice; make it so.
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  // ---- Build tooling: Vite config, plugins, one-off scripts -----------------
  {
    files: ['*.config.js', 'plugins/**/*.js', 'scripts/**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
]
