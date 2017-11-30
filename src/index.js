import './less/main.less'
import * as d3 from 'd3'
let insertParam = require('./utils/insertParam').insertParam
let parseGoogleSpreadsheetURL = require('./utils/parseGoogleSpreadsheetURL').parseGoogleSpreadsheetURL

let sUrlEl = d3.select('#section3__source-url')
let sUrlLink = d3.select('#link__generate-historymap')

sUrlLink.on('click',d=>{
  let sheetUrl = sUrlEl.node().value === ''?sUrlEl.attr('placeholder'):parseGoogleSpreadsheetURL(sUrlEl.node().value).key
  let param = insertParam('source',sheetUrl)
  sUrlLink.attr('href','./app.html?'+param)
})