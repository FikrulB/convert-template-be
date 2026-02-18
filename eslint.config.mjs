// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'dist/**', 'node_modules/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    rules: {
      // ========================
      // TYPE SAFETY (INTI)
      // ========================
      '@typescript-eslint/no-explicit-any': 'warn',

      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',

      // ========================
      // ERROR HANDLING
      // ========================
      '@typescript-eslint/only-throw-error': 'off',

      // ========================
      // PROMISE & ASYNC
      // ========================
      '@typescript-eslint/return-await': ['error', 'in-try-catch'],
      'require-await': 'error',
      '@typescript-eslint/no-floating-promises': 'error',

      // ========================
      // NULL / UNDEFINED
      // ========================
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // ========================
      // CLEAN CODE
      // ========================
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/explicit-function-return-type': 'off',

      // ========================
      // FORMAT
      // ========================
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
);
