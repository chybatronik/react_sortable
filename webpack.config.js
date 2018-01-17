// webpack.config.js
var path = require('path');

const HtmlPlugin = require('html-webpack-plugin')

var BUILD_DIR = path.resolve(__dirname, './../src/client/public');
var APP_DIR = path.resolve(__dirname, './../src/client/app');

module.exports = {
  // Tell webpack to start bundling our app at app/index.js
  entry: {
    app: ['./src/lib/SortableReact.js']
  },
  // Output our app to the dist/ directory
  output: {
    filename: 'app.js',
    path: '/Users/develexedev/dev/react_sortable/distribute/'
  },
  resolve: {
      extensions: ['.js', '.jsx']
  },
  // Emit source maps so we can debug our code in the browser
  // devtool: 'source-map',
  // Tell webpack to run our source code through Babel
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
          presets: ['es2015', 'react', "stage-0"]
      }
      // use: 'jshint-loader'
    }]
  },
  // externals : {
  //   react: 'react',
  //   "react-motion":"react-motion",
  //   "develexe-sortable":"develexe-sortable",
  //   "prop-types":"prop-types"
  // },
  // Since Webpack only understands JavaScript, we need to
  // add a plugin to tell it how to handle html files.
  // plugins: [
  //   // Configure HtmlPlugin to use our own index.html file
  //   // as a template.
  //   // Check out https://github.com/jantimon/html-webpack-plugin
  //   // for the full list of options.
  //   new HtmlPlugin({
  //     template: 'public/index.html'
  //   })
  // ]

}
