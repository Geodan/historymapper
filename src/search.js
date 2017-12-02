import * as Fuse from 'fuse.js'
import * as d3 from 'd3'
import {createMapResult} from './maps'
import {createCard} from './card'

let KEYSEARCH, RECORDSEARCH
let brieven = [], sleutels =[]
let briefresults =  d3.select('#searchbrieven')
let personresults =  d3.select('#searchmensen')

let briefOptions = {
  shouldSort: true,
  threshold: 0.3,
  location: 0,
  distance: 40,
  maxPatternLength: 16,
  minMatchCharLength: 1,
  tokenize: false,
  keys: [
    '"properties.description',
    'properties.fromname',
    'properties.tags',
    'properties.fromlocation',
    'properties.toname',
    'properties.tolocation'    
  ]
}
let sleutelOptions = {
  shouldSort: true,
  threshold: 0.3,
  location: 0,
  distance: 40,
  maxPatternLength: 16,
  minMatchCharLength: 1,
  tokenize: false,
  keys: [
    'properties.alternatives',
    'properties.description',
    'properties.name',
    'properties.tags'
    //TODO: search in 'color' column
  ]
} 
     
export function createSearch(data) {  
  KEYSEARCH = new  Fuse(data.sleutel,sleutelOptions)
  RECORDSEARCH = new Fuse(data.records,briefOptions)
  
}

export function goSearch(str,search) {
  console.log(str)
  if(!search)document.getElementById('search-text').value = str
  sleutels = KEYSEARCH.search(str)
  brieven = RECORDSEARCH.search(str)


  d3.selectAll('.nodes circle').classed('unselected',true)
  d3.selectAll('.links line').classed('unselected',true)
  brieven.forEach(d=>{
    d3.select('#person-'+d.fromId).classed('unselected',false)
    d3.select('#person-'+d.toId).classed('unselected',false)
    d3.select('#link-'+d.toId+'-'+d.fromId).classed('unselected',false)
  })
  sleutels.forEach(d=>d3.select('#person-'+d.id).classed('unselected',false))
  let briefdata  =  briefresults
    .selectAll('div').data(brieven,function(d) { return d.id })
  
  briefdata.enter()
    .append('div')
    .classed('searchrecord',true)
    .merge(briefdata)  
    .on('mouseover',d=>{
      d3.select('#person-'+d.fromId)
        .classed('hilight',true)
      d3.select('#person-'+d.toId)
        .classed('hilight',true)
      d3.select('#link-'+d.toId+'-'+d.fromId)
        .classed('hilight',true)
    })
    .on('mouseout',d=>{
      d3.select('#person-'+d.fromId)
        .classed('hilight',false)
      d3.select('#person-'+d.toId)
        .classed('hilight',false)
      d3.select('#link-'+d.toId+'-'+d.fromId)
        .classed('hilight',false)
    })
    .html(d=>'<span class="fromname">'+d.properties.fromname+'</span><span class="toname">'+d.properties.toname+'</span>')
    .on('click',d=>createCard(d.id,'brief'))

  briefdata.exit().html('').remove()
  
  let persondata  =  personresults
    .selectAll('div').data(sleutels,function(d) { return d.id })
  
  persondata.enter()
    .append('div')
    .classed('searchrecord',true)
    .merge(persondata)  
    .on('mouseover',d=>{
      d3.select('#person-'+d.id)
        .classed('hilight',true)
    })
    .on('mouseout',d=>{
      d3.select('#person-'+d.id)
        .classed('hilight',false)
    }).text(d=>d.properties.name).on('click',d=>createCard(d.id,'person'))

  persondata.exit().remove()
  createMapResult(brieven)
}