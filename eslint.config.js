import globals from 'globals';
import pluginJs from '@eslint/js';
import importPlugin from "eslint-plugin-import";
import tsEsLint from 'typescript-eslint';

export default [
  pluginJs.configs.recommended,
  ...tsEsLint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2020,
        ...globals.mocha,
        ...globals.jest,
        ...globals.node,
      },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      extends: [
        'standard-with-typescript',
        'plugin:@typescript-eslint/recommended',
      ],
      plugins: [
        '@typescript-eslint',
        'promise',
        'n',
      ],
    },
    rules: {
      indent: ['error', 2],
      '@typescript-eslint/indent': ['error', 2],
      // 允许使用 any（可选）
      '@typescript-eslint/no-explicit-any': 'off',
      // 多行必须尾逗号
      'comma-dangle': ['error', 'always-multiline'],
      // 禁止默认导出（适合组件库）
      'import/no-default-export': 'error',
      // 关闭对非相对路径的严格检查
      'n/no-missing-import': 'off'
    },
  },
  {
    plugins: { import: importPlugin },
    rules: {
      'import/order': ['error', {
        'groups': ['builtin', 'external', 'parent', 'sibling', 'index'],
        'newlines-between': 'always'
      }]
    }
  },
  {
    ignores: [
      'types/**'
    ],
  },
];
