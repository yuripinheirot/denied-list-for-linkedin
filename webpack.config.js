const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/scripts/index.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.build-script.json',
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {},
  },
  output: {
    filename: 'content.js',
    path: path.resolve(__dirname, 'build'),
  },
}
