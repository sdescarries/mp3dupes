const path = require('path');

module.exports = [
  {
    mode: 'production',
    target: 'node',

    optimization: {
      minimize: false
    },

    module: {

      rules: [
        {
          test: /\.js$/,
          use: 'shebang-loader',
        }
      ],
    },

    node: {
      __filename: true,
    },

    resolve: {
      modules: [
        path.resolve('./node_modules'),
        path.resolve('./src')
      ],
      extensions: ['.json', '.js'],
    },

    entry: './src/index.js',
    output: {

      path: `${__dirname}/bin`,
      filename: 'mp3dupes',
    },
  }
];
