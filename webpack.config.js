const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const extractLess = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  disable: process.env.NODE_ENV === 'development'
})

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html',
  inject: 'body'
})

module.exports = { 
  entry: './src/index.js', 
  output: { 
    path: path.resolve('dist'), 
    filename: 'index_bundle.js'
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
      use: extractLess.extract({
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
          loader: 'file-loader',
          options: {}  
        }
      ]
    }]
  }, 
  plugins: [extractLess,HtmlWebpackPluginConfig]
}