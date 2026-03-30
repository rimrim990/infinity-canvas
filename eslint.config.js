import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import reactPlugin from 'eslint-plugin-react'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier, // Prettier와 충돌하는 ESLint 규칙 비활성화 (반드시 마지막에)
    ],
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: {
        version: 'detect', // React 버전 자동 감지
      },
    },
    rules: {
      // ── TypeScript ──────────────────────────────────────────
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

      // ── React Hooks ─────────────────────────────────────────
      'react-hooks/exhaustive-deps': 'error', // stale closure 방지

      // ── React ───────────────────────────────────────────────
      'react/react-in-jsx-scope': 'off',       // React 17+ 신규 JSX transform
      'react/prop-types': 'off',               // TypeScript로 대체
      'react/self-closing-comp': 'error',      // <Foo></Foo> → <Foo />
      'react/jsx-curly-brace-presence': [      // 불필요한 중괄호 제거
        'error',
        { props: 'never', children: 'never' },
      ],

      // ── 일반 ────────────────────────────────────────────────
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
])
