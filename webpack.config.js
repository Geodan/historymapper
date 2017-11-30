const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const ExtractTextPluginConfig = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  disable: process.env.NODE_ENV === 'development'
})

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html',
  chunks: ['index'],
  inject: 'body'
})
const HtmlWebpackPluginConfigApp = new HtmlWebpackPlugin({
  template: './src/app.html',
  filename: 'app.html',
  chunks: ['app'],
  inject: 'body'
})
const CopyWebpackPluginConfig = new CopyWebpackPlugin([{
  from:'src/assets/images',to:'assets/images'
}])

module.exports = { 
  entry: {
    index: './src/index.js', 
    app: './src/app.js'
  },
  output: { 
    path: path.resolve('dist'), 
    filename: '[name]_bundle.js'
  }, 
  module: { 
    loaders: [ 
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,                    
              localIdentName: '[name]__[local]--[hash:base64:5]'
            }
          }
        ]
      }
    ],
    rules: [{
      test: /\.less$/,
      use: ExtractTextPluginConfig.extract({
        fallback: 'style-loader',
        use: [ {
          loader: 'css-loader', options: {
            sourceMap: true
          }
        }, {
          loader: 'less-loader', options: {
            sourceMap: true
          }
        }]
      })
    },{
      test: /\.(png|jpg|gif)$/,
      use: [
        {
          loader: 'file-loader'
        }
      ]
    }]
  }, 
  plugins: [ExtractTextPluginConfig,HtmlWebpackPluginConfig,HtmlWebpackPluginConfigApp,CopyWebpackPluginConfig]
}