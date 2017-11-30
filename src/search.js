import {Fuse} from 'fuse.js'

let KEYSEARCH, RECORDSEARCH

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
  KEYSEARCH= new Fuse(data,sleutelOptions)
  RECORDSEARCH = new Fuse(data,briefOptions)
}

export function goSearch(str) {
  window.alert(str)
}