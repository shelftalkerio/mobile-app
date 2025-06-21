import js from '@eslint/js';
import react from 'eslint-plugin-react/configs/recommended.js';
import reactNative from 'eslint-plugin-react-native';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-config-prettier';
import * as tseslint from 'typescript-eslint';
import { defineFlatConfig } from 'eslint-define-config';

export default defineFlatConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-native': reactNative,
      import: importPlugin,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react-native/no-inline-styles': 'off',
      'no-unused-vars': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // Add Prettier last to override formatting rules
  prettier,
  {
    ignores: [
      'node_modules',
      'dist',
      'build',
      'babel.config.js',
      'metro.config.js',
      'jest.config.js',
      'postcss.config.js',
      'tailwind.config.js',
      'declarations.d.ts',
      'frontend/**/*'
    ],
  },
]);
