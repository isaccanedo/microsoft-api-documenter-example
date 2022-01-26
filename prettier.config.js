module.exports = {
  bracketSpacing: false,
  singleQuote: true,
  trailingComma: 'es5',
  semi: false,
  printWidth: 80,
  importOrder: ['<THIRD_PARTY_MODULES>', '^@/(.*)$', '^[~/]', '^[./]'],
  importOrderSortSpecifiers: true,
  overrides: [
    {
      files: '*.ts?(x)',
      options: {
        parser: 'babel-ts',
      },
    },
  ],
}
