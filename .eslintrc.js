module.exports = {
  'env': {
      'node': true,
      'es2021': true
  },
  'extends': [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended'
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
      'ecmaVersion': 'latest',
      'tsconfigRootDir': __dirname,
      'sourceType': 'module'
  },
  'ignorePatterns': ['.eslintrc.js', 'dist', 'node_modules'],
  'plugins': [
      '@typescript-eslint'
  ],
  'rules': {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'indent': [
          'error',
          4
      ],
      'linebreak-style': [
          'error',
          'windows'
      ],
      'quotes': [
          'error',
          'single'
      ],
      'semi': [
          'error',
          'never'
      ],
      'array-bracket-spacing': [
          'error',
          'always'
      ],
      'object-curly-spacing': [
          'error',
          'always'
      ],
      'no-trailing-spaces': [
          'error'
      ],
  }
}

