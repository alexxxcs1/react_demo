const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const project = require('../project.config')

const inProject = path.resolve.bind(path, project.basePath)
const inProjectSrc = (file) => inProject(project.srcDir, file)

const __DEV__ = project.env === 'development'
const __TEST__ = project.env === 'test'
const __PROD__ = project.env === 'production'

const config = {
  entry: {
    normalize: [
      inProjectSrc('normalize'),
    ],
    main: [
      inProjectSrc(project.main),
    ],
  },
  devtool: project.sourcemaps ? 'source-map' : false,
  output: {
    path: inProject(project.outDir),
    filename: __DEV__ ? 'public/js/[name].js' : 'public/js/[name].[chunkhash].js',
    publicPath: project.publicPath,
  },
  resolve: {
    mainFiles: ['index.web', 'index'],
    modules: [
      inProject(project.srcDir),
      'node_modules',
    ],
    extensions: ['*', '.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.ts', '.tsx', '.js', '.jsx', '.json'],
    mainFields: [
      'browser',
      'jsnext:main',
      'main',
    ],
  },
  externals: project.externals,
  module: {
    rules: [],
  },
  plugins: [
    new webpack.DefinePlugin(Object.assign({
      'process.env': {
        NODE_ENV: JSON.stringify(project.env)
      },
      __DEV__,
      __TEST__,
      __PROD__,
    }, project.globals))
  ],
}

// JavaScript
// ------------------------------------
config.module.rules.push({
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: [{
    loader: 'babel-loader',
    query: {
      cacheDirectory: true,
      plugins: [
        'babel-plugin-transform-class-properties',
        'babel-plugin-syntax-dynamic-import',
        ["import", { "libraryName": "antd", "style": true }],
        [
          'babel-plugin-transform-runtime',
          {
            helpers: true,
            polyfill: false, // we polyfill needed features in src/normalize.js
            regenerator: true,
          },
        ],
        [
          'babel-plugin-transform-object-rest-spread',
          {
            useBuiltIns: true // we polyfill Object.assign in src/normalize.js
          },
        ],
      ],
      presets: [
        'babel-preset-react',
        ['babel-preset-env', {
          targets: {
            ie9: true,
            uglify: true,
            modules: false,
          },
        }],
      ]
    },
  }],
})

// Styles
// ------------------------------------
const extractStyles = new ExtractTextPlugin({
  filename: 'public/css/[name].[contenthash].css',
  allChunks: true,
  disable: __DEV__,
})

config.module.rules.push({
  test: /\.(sass|scss|css)$/,
  exclude: /node_modules/,
  // exclude: path.resolve(__dirname, 'node_modules/quill'),
  loader: extractStyles.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        options: {
          sourceMap: project.sourcemaps,
          // exclude: [
          //   path.resolve(__dirname, "/node_modules/react-quill")
          // ],
          modules: true,
          localIdentName:'[path][name]__[local]--[hash:base64:5]',
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: project.sourcemaps,
        },
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: project.sourcemaps,
          includePaths: [
            inProjectSrc('styles'),
          ],
        },
      },

    ],
  })
})
config.module.rules.push({
  test: /\.(sass|scss|css)$/,
  include: /node_modules/,
  // exclude: path.resolve(__dirname, 'node_modules/quill'),
  loader: extractStyles.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        options: {
          sourceMap: project.sourcemaps,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: project.sourcemaps,
        },
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: project.sourcemaps,
          includePaths: [
            inProjectSrc('styles'),
          ],
        },
      },

    ],
  })
})

config.plugins.push(extractStyles)

// LESS
// ------------------------------------
config.module.rules.push({
  test: /\.less$/,
  use: [{
    loader: 'style-loader'
  }, {
    loader: 'css-loader'
  }, {
    loader: 'less-loader'
  }]
})

// Images
// ------------------------------------
config.module.rules.push({
  test: /\.(png|jpg|gif)$/,
  loader: 'url-loader',
  options: {
    limit: 8192,
    name: 'images/[name]-[hash].[ext]',
  },
})

// Fonts
// ------------------------------------
;[
  ['woff', 'application/font-woff'],
  ['woff2', 'application/font-woff2'],
  ['otf', 'font/opentype'],
  ['ttf', 'application/octet-stream'],
  ['eot', 'application/vnd.ms-fontobject'],
].forEach((font) => {
  const extension = font[0]
  const mimetype = font[1]
  config.module.rules.push({
    test: new RegExp(`\\.${extension}$`),
    loader: 'url-loader',
    options: {
      name: 'fonts/[name].[ext]',
      limit: 10000,
      mimetype,
    },
  })
})

// SVG
// ------------------------------------
config.module.rules.push({
  test: /\.svg$/,
  loader: 'svg-sprite-loader',
  include: [
    require.resolve('antd').replace(/warn\.js$/, ''),
  ]
})

// HTML Template
// ------------------------------------
config.plugins.push(new HtmlWebpackPlugin({
  template: inProjectSrc('index.html'),
  inject: true,
  minify: {
    collapseWhitespace: true,
  },
}))

// Development Tools
// ------------------------------------
if (__DEV__) {
  config.entry.main.push(
    `webpack-hot-middleware/client.js?path=${config.output.publicPath}__webpack_hmr`
  )
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  )
}

// Bundle Splitting
// ------------------------------------
if (!__TEST__) {
  const bundles = ['normalize', 'manifest']

  if (project.vendors && project.vendors.length) {
    bundles.unshift('vendor')
    config.entry.vendor = project.vendors
  }
  config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    names: bundles
  }))
}

// Production Optimizations
// ------------------------------------
if (__PROD__) {
  config.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: !!config.devtool,
      comments: false,
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
    })
  )
}

module.exports = config
