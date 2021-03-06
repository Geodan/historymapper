import {parseGoogleSpreadsheetURL} from './utils/parseGoogleSpreadsheetURL'
import {buildGoogleFeedURL} from './utils/buildGoogleFeedURL'
import {extractData} from './utils/extractData'
import {createGeojson,createLocation, replaceAll} from './utils/utils'

import {createSearch, goSearch} from './search'
import {renderGraph} from './graph'
import {createMapData} from './maps'
import {createCard} from './card'


import * as d3 from 'd3'
/*
local globals
*/
let SLEUTELTIME = 0
let DATATIME = 0
let RECORDID = 0

export function getData(part) {  
  var url = parseGoogleSpreadsheetURL(part)
  var requests =[new Request(buildGoogleFeedURL(url.key,1)),new Request(buildGoogleFeedURL(url.key,2))];
  getResults(requests)

}

function getResults(requests) {
  return Promise.all(requests.map(url =>
    fetch(url)
      .then(response => response.json())
      .then(json => json)
      .catch(error => error)
  ))
    .then(results => parseResults(results))
}

function parseResults(results) {
  let update = false
  let data = {}
  let sleutel = results.filter(d=>d.feed.title.$t==='Key')[0]
  let st = new Date(sleutel.feed.updated.$t).getTime()
  if(st > SLEUTELTIME || data.sleutel === undefined){
    update = true
    SLEUTELTIME = st
    data.sleutel = parseSleutel(sleutel)
  }
  let records = results.filter(d=>d.feed.title.$t==='Data')[0]
  let dt = new Date(records.feed.updated.$t).getTime()
  if(dt > DATATIME){
    update = true
    DATATIME = dt
    data = parseData(records,data)
  }
  
  if(update) {      
    // DATA= data  
    renderGraph(data)
    createMapData(data)
    createSearch(data)
    
    createCard(data.sleutel[Math.floor(Math.random()*data.sleutel.length)].id,'person')  
    
    goSearch(document.getElementById('search-text').value)

  }
}



function parseSleutel(sleutel) {
  let persons = []
  if(sleutel.feed.entry.length == 0) return false
  sleutel.feed.entry.map(entry => {
    let d =extractData(entry)
    let person = {}
    if(d===null)return false
    person.id=+d.id
    person.linkCount =0
    d.tags=d3.csvParseRows(d.tags)[0]
    d.colorLabel = d.color
    d.color=d.color!==''?d[d.color]:null
    person.properties =d
    persons.push(person)
  })
  return persons
}

function parseData(records,data) {
  if(records.feed.entry.length === 0 || data.sleutel === undefined) return false
  let brieven = [], locations = [], frm = [], too = []
  records.feed.entry.map(entry => {    
    let d =extractData(entry)
    if(d===null)return false   
    let record = {}
    record.id = RECORDID++
    
    record.fromId =+ d.fromid
    let from = data.sleutel.filter(l=>l.id===record.fromId)[0]
    if(from && d.fromname !== from.properties.name) {
      d.fromname !== ''?from.properties.alternatives += ' '+d.fromname:false
      d.fromname = from.properties.name
    }
    record.fromLoc = replaceAll('fromla'+d.fromlatitude+'lo'+d.fromlongitude,'.','p')
    record.fromAccuracy =+ d.fromaccuracy
    record.fromLon=d.fromlongitude==''?null:+d.fromlongitude
    record.fromLat=d.fromlatitude==''?null:+d.fromlatitude
  
    record.toId =+ d.toid
    let to = data.sleutel.filter(l=>l.id===record.toId)[0]
    if(to && d.toname !== to.properties.name) {
      d.toname !== ''?to.properties.alternatives += ' '+d.toname:false
      d.toname = to.properties.name
    }
    record.toLoc = replaceAll('tola'+d.tolatitude+'lo'+d.tolongitude,'.','p')
    record.toAccuracy =+ d.toaccuracy
    record.toLon=d.tolongitude==''?null:+d.tolongitude
    record.toLat=d.tolatitude==''?null:+d.tolatitude
    
    d.tags=d3.csvParseRows(d.tags)[0]

    record.properties = {}
    Object.assign(record.properties, d)


    if(record.fromLoc === record.toLoc) {
      locations = addLocation(record,locations,true)
    }
    else {
      locations = addLocation(record,locations)        
    }   
    frm.push(createGeojson(record,'from'))
    too.push(createGeojson(record,'to'))
    brieven.push(record)
  })
  return {'sleutel':data.sleutel,'records':brieven,'locations':locations,'from':frm, 'to':too}
}

function addLocation(record,locations,same) {
  if(same) {
    let loc = locations.filter(l=>l.properties.id===record.fromLoc)
    if(loc.length === 0) {
      locations.push(createLocation(record,'from',same))
    }
    else {
      loc[0].properties.cnt++
      loc[0].properties.fromcnt++
      loc[0].properties.tocnt++
    }
  }

  let sendloc = locations.filter(l=>l.properties.id===record.fromLoc)
  let recloc = locations.filter(l=>l.properties.id===record.toLoc)
  if(sendloc.length === 0) {
    locations.push(createLocation(record,'from'))
  }
  else {
    sendloc[0].properties.cnt++
    sendloc[0].properties.fromcnt++  
  }
  if(recloc.length === 0) {
    locations.push(createLocation(record,'to'))
  }
  else {
    recloc[0].properties.cnt++
    recloc[0].properties.tocnt++
  }
  return locations
}