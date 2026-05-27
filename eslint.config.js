import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import configPrettier from 'eslint-config-prettier';
import prettier from 'eslint-plugin-prettier';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      configPrettier,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      // 💥 Desactivamos la regla base de ESLint
      'no-unused-vars': 'off',
      'no-useless-escape': 'off',
      'no-control-regex': 'off',
      // ✅ Usamos la de TypeScript con patrón para ignorar variables/args con "_"
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-use-before-define': ['warn', { typedefs: false }],
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      'no-use-before-define': 'off',
      'no-unused-expressions': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',

      'prettier/prettier': 'error',
    },
  },
  configPrettier
);
