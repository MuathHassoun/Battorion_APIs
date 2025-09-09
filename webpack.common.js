const path = require('path');

module.exports = {
  entry: {
    app: './public/js/app.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: './public/js/app.js',
  },
};
